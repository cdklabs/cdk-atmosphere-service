// eslint-disable-next-line import/no-extraneous-dependencies
import { Unit } from 'aws-embedded-metrics';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context, ScheduledEvent } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import { RuntimeMetrics } from '../metrics';

export const METRIC_NAME_ALLOCATIONS_SUCCESS = 'allocations-success';
export const METRIC_NAME_ALLOCATIONS_FAILURE = 'allocations-failure';
export const METRIC_NAME_ALLOCATIONS_TIMEOUT = 'allocations-timeout';
export const METRIC_NAME_ALLOCATIONS_IN_PROGRESS = 'allocations-in-progress';

const clients = RuntimeClients.getOrCreate();

// monitor allocations from the last 7 days.
const DAYS_AGO = 7;

export async function handler(event: ScheduledEvent, _context: Context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  const from = new Date();
  from.setDate(from.getDate() - DAYS_AGO);

  console.log(`Fetching allocations from the last ${DAYS_AGO} days`);
  const allocations = await clients.allocations.scan(from);

  const pools = Array.from(new Set(allocations.map(a => a.pool)));
  console.log(`Detected the following pools: ${pools.join(',')}`);

  for (const pool of pools) {

    await RuntimeMetrics.scoped(async (metrics) => {

      metrics.setPool(pool);

      // to force recording a dimension set that only includes the pool
      // since this is the only dimension we have here.
      metrics.putDimensions({});

      const inProgressCount = allocations.filter(a => a.end === undefined).length;
      const successCount = allocations.filter(a => a.outcome === 'success').length;
      const failureCount = allocations.filter(a => a.outcome === 'failure').length;
      const timeoutCount = allocations.filter(a => a.outcome === 'timeout').length;

      const toEmit = {
        [METRIC_NAME_ALLOCATIONS_SUCCESS]: successCount,
        [METRIC_NAME_ALLOCATIONS_FAILURE]: failureCount,
        [METRIC_NAME_ALLOCATIONS_TIMEOUT]: timeoutCount,
        [METRIC_NAME_ALLOCATIONS_IN_PROGRESS]: inProgressCount,
      };

      for (const [metricName, value] of Object.entries(toEmit)) {
        console.log(`Emitting metric: ${metricName} = ${value} | pool: ${pool}`);
        metrics.delegate.putMetric(metricName, value, Unit.Count);
      }

    });

  }

}
