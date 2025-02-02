// eslint-disable-next-line import/no-extraneous-dependencies
import { Lambda } from '@aws-sdk/client-lambda';
import { Unit } from 'aws-embedded-metrics';
import { RuntimeClients } from '../clients';
import { Envars, DEALLOCATE_FUNCTION_NAME_ENV } from '../envars';
import { AllocationLogger } from '../logging';
import { PoolAwareMetricsLogger, RuntimeMetrics } from '../metrics';

export interface AllocationTimeoutEvent {
  readonly allocationId: string;
}

export const METRIC_NAME = 'allocation-timeout';
export const METRIC_DIMENSION_RESULT = 'result';

const clients = RuntimeClients.getOrCreate();

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

  return RuntimeMetrics.scoped(async (metrics) => {

    try {
      await doHandler(event, metrics);
      metrics.putDimensions({ [METRIC_DIMENSION_RESULT]: 'success' });
    } catch (e: any) {
      metrics.putDimensions({ [METRIC_DIMENSION_RESULT]: 'error' });
      throw e;
    } finally {
      metrics.delegate.putMetric(METRIC_NAME, 1, Unit.Count);
    }

  });

}

async function doHandler(event: AllocationTimeoutEvent, metrics: PoolAwareMetricsLogger) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const log = new AllocationLogger({ id: event.allocationId, component: 'allocation-timeout' });

  try {

    log.info('Fetching allocation');
    const allocation = await clients.allocations.get(event.allocationId);
    log.info('Successfully fetched allocation');

    log.setPool(allocation.pool);
    metrics.setPool(allocation.pool);

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
