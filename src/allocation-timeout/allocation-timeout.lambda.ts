// eslint-disable-next-line import/no-extraneous-dependencies
import { Lambda } from '@aws-sdk/client-lambda';
import { Envars, DEALLOCATE_FUNCTION_NAME_ENV } from '../envars';

interface AllocationTimeoutEvent {
  readonly allocationId: string;
}

export async function handler(event: AllocationTimeoutEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const body = JSON.stringify({ outcome: 'timeout' });

  const lambda = new Lambda();

  const payload = JSON.stringify({ pathParameters: { id: event.allocationId }, body });
  const target = Envars.required(DEALLOCATE_FUNCTION_NAME_ENV);

  // so this is kind of silly because we could have just configured
  // the schedule itself to invoke the deallocate function directly.
  // this however gives us a nicer entrypoint in case we need to perform additional
  // operations on an allocation timeout.
  console.log(`Invoking ${target} with payload: ${payload}`);
  await lambda.invoke({ FunctionName: target, InvocationType: 'Event', Payload: payload });
  console.log('Done');

}