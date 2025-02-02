// eslint-disable-next-line import/no-extraneous-dependencies
import { Lambda } from '@aws-sdk/client-lambda';
import { Envars, DEALLOCATE_FUNCTION_NAME_ENV } from '../../envars';
import { AllocationLogger } from '../../logging';

export interface AllocationTimeoutEvent {
  readonly allocationId: string;
}

/**
 * Responsible for forcefully releasing an environment in case its allocation period has
 * expired before the requester explicitly released it (for example if the requester process crashed).
 * This ensures a requester cannot hold an environment forever.
 *
 * It is triggered on a fixed schedule via an EventBridge (one-time) schedule that is created upon allocation.
 * Being a schedule, it may very well be triggered even if the allocation was already explicitly ended by the
 * requester; in that case, this function will simply return and do nothing.
 *
 * Implementation
 * --------------
 *
 * 1. Synchronously invoke the deallocate function with an outcome of `timeout`.
 *
 * > Note that we could have also configured the schedule itself to do so.
 * > However, this function gives us a place to perform additional perations
 * > on an allocation timeout.
*/
export async function handler(event: AllocationTimeoutEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const log = new AllocationLogger({ id: event.allocationId, component: 'allocation-timeout' });

  try {
    const body = JSON.stringify({ outcome: 'timeout' });
    const lambda = new Lambda();

    const payload = JSON.stringify({ pathParameters: { id: event.allocationId }, body });
    const target = Envars.required(DEALLOCATE_FUNCTION_NAME_ENV);

    log.info(`Invoking ${target} with payload: ${payload}`);
    const response = await lambda.invoke({ FunctionName: target, InvocationType: 'RequestResponse', Payload: payload });
    const responsePayload = JSON.parse(response.Payload?.transformToString('utf-8') ?? '{}');
    if (responsePayload.statusCode !== 200) {
      throw new Error(`Unexpected response status code ${responsePayload.statusCode}: ${responsePayload.body}`);
    }
    log.info('Done');
  } catch (e: any) {
    log.error(e);
    throw e;
  }

}
