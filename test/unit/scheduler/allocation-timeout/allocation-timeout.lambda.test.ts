import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { Uint8ArrayBlobAdapter } from '@smithy/util-stream';
import { mockClient } from 'aws-sdk-client-mock';
import { RuntimeClients } from '../../../../src/clients';
import * as envars from '../../../../src/envars';
import { handler } from '../../../../src/scheduler/allocation-timeout/allocation-timeout.lambda';
import * as _with from '../../../with';
import 'aws-sdk-client-mock-jest';
import { RuntimeClientsMock } from '../../clients.mock';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  const lambdaMock = mockClient(LambdaClient);

  beforeEach(() => {
    lambdaMock.reset();
    jest.clearAllMocks();

    RuntimeClientsMock.mock();

    // needed because we query allocations to configure the pool of the logger.
    jest.spyOn(clients.allocations, 'get').mockReturnValue(Promise.resolve({ pool: 'pool' } as any));
  });

  test('invokes the deallocate function', async () => {

    lambdaMock.on(InvokeCommand).resolves({
      Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify({
        statusCode: 200,
        body: '{}',
      })),
    });

    await _with.env({ [envars.DEALLOCATE_FUNCTION_NAME_ENV]: 'deallocate' }, () => handler({ allocationId: 'allocation-id' }));

    const body = JSON.stringify({ outcome: 'timeout' });
    const payload = JSON.stringify({ pathParameters: { id: 'allocation-id' }, body });

    expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
    expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, {
      FunctionName: 'deallocate',
      InvocationType: 'RequestResponse',
      Payload: payload,
    });
  });

  test('throws if deallocate function returns 500', async () => {

    lambdaMock.on(InvokeCommand).resolves({
      Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify({
        statusCode: 500,
        body: JSON.stringify({ message: 'error' }),
      })),
    });

    await expect(_with.env({
      [envars.DEALLOCATE_FUNCTION_NAME_ENV]: 'deallocate',
    }, () => handler({ allocationId: 'allocation-id' }))).rejects.toThrow('error');

  });

  test('throws if deallocate doest return a payload', async () => {

    lambdaMock.on(InvokeCommand).resolves({});

    await expect(_with.env({
      [envars.DEALLOCATE_FUNCTION_NAME_ENV]: 'deallocate',
    }, () => handler({ allocationId: 'allocation-id' }))).rejects.toThrow('Unexpected response status code undefined: undefined');

  });

});