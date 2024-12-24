import { APIGatewayProxyEvent } from 'aws-lambda';
import { RuntimeClients } from '../../src/clients';
import { handler } from '../../src/deallocate/deallocate.lambda';
import { AllocationAlreadyEndedError, AllocationsClient, InvalidInputError } from '../../src/storage/allocations.client';
import { EnvironmentsClient } from '../../src/storage/environments.client';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  test('returns 400 if no id path parameter', async () => {

    const response = await handler({} as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 if no request body', async () => {

    const response = await handler({ pathParameters: { id: 'id' } } as any as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 if no outcome in request body', async () => {

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({}),
    } as any as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(400);

  });

  test('returns 400 on invalid input when ending allocation', async () => {

    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'end').mockReturnValue(Promise.reject(new InvalidInputError('invalid')));

    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Invalid input: invalid');


  });

  test('returns 500 on unexpected error', async () => {

    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'end').mockReturnValue(Promise.reject(new Error('unexpected')));

    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(body.message).toEqual('unexpected');


  });

  test('returns 200 on success', async () => {

    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'end').mockReturnValue(Promise.resolve({
      account: '1111',
      region: 'us-east-1',
      pool: 'release',
      start: '0',
      end: '1',
      requester: 'user',
      id: 'id',
      outcome: 'failed',
    }));

    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    expect(response.statusCode).toEqual(200);

  });

  test('returns 200 if allocation has already ended', async () => {

    const environments = new EnvironmentsClient('dummy');
    const allocations = new AllocationsClient('dummy');

    jest.spyOn(environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(allocations, 'end').mockReturnValue(Promise.reject(new AllocationAlreadyEndedError('id')));

    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    expect(response.statusCode).toEqual(200);

  });


});