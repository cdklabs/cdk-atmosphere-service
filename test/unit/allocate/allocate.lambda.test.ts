import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../../src/allocate/allocate.lambda';
import { RuntimeClients } from '../../../src/clients';
import * as envars from '../../../src/envars';
import { InvalidInputError } from '../../../src/storage/allocations.client';
import { EnvironmentAlreadyAcquiredError } from '../../../src/storage/environments.client';
import * as _with from '../../with';
import { RuntimeClientsMock } from '../clients.mock';
import 'aws-sdk-client-mock-jest';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  const stsMock = mockClient(STSClient);

  beforeEach(() => {
    stsMock.reset();
    RuntimeClientsMock.mock();
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

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'start').mockReturnValue(Promise.reject(new InvalidInputError('Invalid')));

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Invalid input: Invalid');

  });

  test('returns 400 when duration excceeds maximum', async () => {
    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1', durationSeconds: 2 * 60 * 60 }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Maximum allocation duration is 3600 seconds');

  });

  test('rethrows on unexpected error when allocating', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'start').mockReturnValue(Promise.reject(new Error('Unexpected')));

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

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'start').mockImplementation(jest.fn());
    jest.spyOn(clients.scheduler, 'scheduleAllocationTimeout').mockImplementation(jest.fn());

    const response = await _with.env({ [envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: 'arn' }, async () => handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent));
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.durationSeconds).toEqual(3600);
    expect(body.id.length).toEqual(36);
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

    expect(clients.environments.acquire).toHaveBeenCalledWith(expect.any(String), '1111', 'us-east-1');
    expect(clients.allocations.start).toHaveBeenCalledWith({
      id: body.id,
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      requester: 'user1',
    });
    expect(clients.scheduler.scheduleAllocationTimeout).toHaveBeenCalledWith({
      allocationId: body.id,
      functionArn: 'arn',
      timeoutDate: expect.any(Date),
    });

    expect(stsMock).toHaveReceivedCommandTimes(AssumeRoleCommand, 1);
    expect(stsMock).toHaveReceivedCommandWith(AssumeRoleCommand, {
      RoleArn: 'arn:aws:iam::1111:role/Admin',
      RoleSessionName: `atmosphere.allocation.${body.id}`,
    });

  });

  test('respects duration seconds', async () => {

    stsMock.on(AssumeRoleCommand).resolves({
      Credentials: {
        AccessKeyId: 'key',
        SecretAccessKey: 'secret',
        SessionToken: 'token',
        Expiration: new Date(),
      },
    });

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'acquire').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'start').mockImplementation(jest.fn());
    jest.spyOn(clients.scheduler, 'scheduleAllocationTimeout').mockImplementation(jest.fn());

    const response = await _with.env({ [envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: 'arn' }, async () => handler({ body: JSON.stringify({ pool: 'release', requester: 'user1', durationSeconds: 30 }) } as APIGatewayProxyEvent));
    const body = JSON.parse(response.body);

    expect(body.durationSeconds).toEqual(30);

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

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([
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
    jest.spyOn(clients.environments, 'acquire').mockImplementation(async (_: string, account: string, region: string) => {
      if (region === 'us-east-1') {
        throw new EnvironmentAlreadyAcquiredError(account, region);
      }
      return Promise.resolve();
    });
    jest.spyOn(clients.allocations, 'start').mockImplementation(jest.fn());
    jest.spyOn(clients.scheduler, 'scheduleAllocationTimeout').mockImplementation(jest.fn());

    const response = await _with.env({ [envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: 'arn' }, () => handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent));
    const body = JSON.parse(response.body);

    expect(clients.environments.acquire).toHaveBeenCalledTimes(2);
    expect(response.statusCode).toEqual(200);
    expect(body.id.length).toEqual(36);

  });

  test('will rethrow on unexpected failures when acquiring environment', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'canary',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
    ]));
    jest.spyOn(clients.environments, 'acquire').mockImplementation(async (_: string, account: string, region: string) => {
      if (region === 'us-east-1') {
        throw new Error(`Unexpected failure when acquiring aws://${account}/${region}`);
      }
      return Promise.resolve();
    });
    jest.spyOn(clients.allocations, 'start').mockImplementation(jest.fn());

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(body.message).toEqual('Unexpected failure when acquiring aws://1111/us-east-1');

  });

  test('returns 423 if no environments are available', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([]));

    const response = await handler({ body: JSON.stringify({ pool: 'release', requester: 'user1' }) } as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(423);
    expect(body.message).toEqual('No environments available in pool \'release\'');

  });

});