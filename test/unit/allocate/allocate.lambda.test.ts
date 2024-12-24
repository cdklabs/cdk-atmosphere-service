import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../../src/allocate/allocate.lambda';
import { RuntimeClients } from '../../../src/clients';
import { ConfigurationClient } from '../../../src/config/configuration.client';
import { AllocationsClient, InvalidInputError } from '../../../src/storage/allocations.client';
import { EnvironmentAlreadyAcquiredError, EnvironmentsClient } from '../../../src/storage/environments.client';
import 'aws-sdk-client-mock-jest';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  const stsMock = mockClient(STSClient);

  beforeEach(() => {
    stsMock.reset();
    jest.clearAllMocks();
  });

  test('returns 400 when request body doesnt exist', async () => {

    const response = await handler({} as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 when request body doesnt contain pool', async () => {

    const response = await handler({ body: JSON.stringify({}) } as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 when request body doesnt contain requester', async () => {

    const response = await handler({ body: JSON.stringify({ pool: 'release' }) } as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 on invalid input when starting allocation', async () => {

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });
    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'start').mockReturnValue(Promise.reject(new InvalidInputError('Invalid')));

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Invalid input: Invalid');

  });

  test('rethrows on unexpected error when allocating', async () => {

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });
    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'start').mockReturnValue(Promise.reject(new Error('Unexpected')));

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(body.message).toEqual('Unexpected');

  });

  test('returns 200 on success', async () => {

    stsMock.on(AssumeRoleCommand).resolves({
      Credentials: {
        AccessKeyId: 'key',
        SecretAccessKey: 'secret',
        SessionToken: 'token',
        Expiration: new Date(),
      },
    });

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });
    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'start').mockReturnValue(Promise.resolve('id'));

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.id).toEqual('id');
    expect(body.environment).toEqual({
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    });
    expect(body.credentials).toEqual({
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      sessionToken: 'token',
    });

    expect(environments.acquire).toHaveBeenCalledWith('1111', 'us-east-1');
    expect(allocations.start).toHaveBeenCalledWith({
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      requester: 'user1',
    });

    expect(stsMock).toHaveReceivedCommandTimes(AssumeRoleCommand, 1);
    expect(stsMock).toHaveReceivedCommandWith(AssumeRoleCommand, {
      RoleArn: 'arn:aws:iam::1111:role/Admin',
      RoleSessionName: 'atmosphere.allocation.id',
    });

  });

  test('will try acquiring multiple environments if needed', async () => {

    stsMock.on(AssumeRoleCommand).resolves({
      Credentials: {
        AccessKeyId: 'key',
        SecretAccessKey: 'secret',
        SessionToken: 'token',
        Expiration: new Date(),
      },
    });

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });
    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'canary',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
      {
        account: '1111',
        region: 'us-east-2',
        pool: 'canary',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
    ]));
    jest.spyOn(environments, 'acquire').mockImplementation(async (account: string, region: string) => {
      if (region === 'us-east-1') {
        throw new EnvironmentAlreadyAcquiredError(account, region);
      }
      return Promise.resolve();
    });
    jest.spyOn(allocations, 'start').mockReturnValue(Promise.resolve('id'));

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.id).toEqual('id');

  });

  test('will rethrow on unexpected failures when acquiring environment', async () => {

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });
    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'canary',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
    ]));
    jest.spyOn(environments, 'acquire').mockImplementation(async (account: string, region: string) => {
      if (region === 'us-east-1') {
        throw new Error(`Unexpected failure when acquiring aws://${account}/${region}`);
      }
      return Promise.resolve();
    });
    jest.spyOn(allocations, 'start').mockReturnValue(Promise.resolve('id'));

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(body.message).toEqual('Unexpected failure when acquiring aws://1111/us-east-1');

  });

  test('returns 423 if no environments are available', async () => {

    const configuration = new ConfigurationClient({ bucket: 'dummy', key: 'dummy' });

    jest.spyOn(configuration, 'listEnvironments').mockReturnValue(Promise.resolve([]));
    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(423);
    expect(body.message).toEqual('No environments available in pool \'release\'');

  });

});
