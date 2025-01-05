import { APIGatewayProxyEvent } from 'aws-lambda';
import { RuntimeClients } from '../../../src/clients';
import { handler } from '../../../src/deallocate/deallocate.lambda';
import * as envars from '../../../src/envars';
import { AllocationAlreadyEndedError, InvalidInputError } from '../../../src/storage/allocations.client';
import * as _with from '../../with';
import { RuntimeClientsMock } from '../clients.mock';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  jest.useFakeTimers();

  beforeEach(() => {
    RuntimeClientsMock.mock();
  });


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

    jest.spyOn(clients.environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'end').mockReturnValue(Promise.reject(new InvalidInputError('invalid')));

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Invalid input: invalid');


  });

  test('returns 400 when cleanup duration exceeds maximum', async () => {
    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed', cleanupDurationSeconds: 2 * 60 * 60 }),
    } as any as APIGatewayProxyEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toEqual('Maximum cleanup timeout is 3600 seconds');

  });

  test('returns 500 on unexpected error', async () => {

    jest.spyOn(clients.environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'end').mockReturnValue(Promise.reject(new Error('unexpected')));

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(body.message).toEqual('unexpected');


  });

  test('returns 200 on success', async () => {

    const now = new Date();

    jest.spyOn(clients.environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'end').mockReturnValue(Promise.resolve({
      account: '1111',
      region: 'us-east-1',
      pool: 'release',
      start: '0',
      end: '1',
      requester: 'user',
      id: 'id',
      outcome: 'failed',
    }));
    jest.spyOn(clients.scheduler, 'scheduleCleanupTimeout').mockImplementation(jest.fn());

    const response = await _with.env({ [envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: 'arn' }, () => handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent));

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.cleanupDurationSeconds).toEqual(3600);
    expect(clients.scheduler.scheduleCleanupTimeout).toHaveBeenCalledWith({
      allocationId: 'id',
      account: '1111',
      region: 'us-east-1',
      functionArn: 'arn',
      timeoutDate: new Date(now.getTime() + 60 * 60 * 1000),
    });

  });

  test('respects cleanup timeout', async () => {

    const now = new Date();

    jest.spyOn(clients.environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'end').mockReturnValue(Promise.resolve({
      account: '1111',
      region: 'us-east-1',
      pool: 'release',
      start: '0',
      end: '1',
      requester: 'user',
      id: 'id',
      outcome: 'failed',
    }));
    jest.spyOn(clients.scheduler, 'scheduleCleanupTimeout').mockImplementation(jest.fn());

    const response = await _with.env({ [envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: 'arn' }, () => handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed', cleanupDurationSeconds: 10 }),
    } as any as APIGatewayProxyEvent));

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.cleanupDurationSeconds).toEqual(10);
    expect(clients.scheduler.scheduleCleanupTimeout).toHaveBeenCalledWith({
      allocationId: 'id',
      account: '1111',
      region: 'us-east-1',
      functionArn: 'arn',
      timeoutDate: new Date(now.getTime() + 10 * 1000),
    });

  });

  test('returns 200 if allocation has already ended', async () => {

    jest.spyOn(clients.environments, 'cleaning').mockImplementation(jest.fn());
    jest.spyOn(clients.allocations, 'end').mockReturnValue(Promise.reject(new AllocationAlreadyEndedError('id')));

    const response = await handler({
      pathParameters: { id: 'id' },
      body: JSON.stringify({ outcome: 'failed' }),
    } as any as APIGatewayProxyEvent);

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body.cleanupDurationSeconds).toEqual(-1);

  });


});