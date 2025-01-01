import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../../src/allocation-timeout/allocation-timeout.lambda';
import * as envars from '../../../src/envars';
import * as _with from '../../with';
import 'aws-sdk-client-mock-jest';

describe('handler', () => {

  const lambdaMock = mockClient(LambdaClient);

  beforeEach(() => {
    lambdaMock.reset();
    jest.clearAllMocks();
  });

  test('invokes the deallocate handler', async () => {

    lambdaMock.on(InvokeCommand).resolves({});

    await _with.env({ [envars.DEALLOCATE_FUNCTION_NAME_ENV]: 'deallocate' }, () => handler({ allocationId: 'allocation-id' }));

    const body = JSON.stringify({ outcome: 'timeout' });
    const payload = JSON.stringify({ pathParameters: { id: 'allocation-id' }, body });

    expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
    expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, {
      FunctionName: 'deallocate',
      InvocationType: 'Event',
      Payload: payload,
    });
  });

});