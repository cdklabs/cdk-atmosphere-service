// eslint-disable-next-line import/no-extraneous-dependencies
import { Unit } from 'aws-embedded-metrics';
import { Context, ScheduledEvent } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import { RuntimeMetrics } from '../metrics';

export const METRIC_NAME_ENVIRONMENTS_REGISTERED = 'environments-registered';
export const METRIC_NAME_ENVIRONMENTS_FREE = 'environments-free';
export const METRIC_NAME_ENVIRONMENTS_IN_USE = 'environments-in-use';
export const METRIC_NAME_ENVIRONMENTS_CLEANING = 'environments-cleaning';
export const METRIC_NAME_ENVIRONMENTS_DIRTY = 'environments-dirty';

const clients = RuntimeClients.getOrCreate();

export async function handler(event: ScheduledEvent, _context: Context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  console.log('Fetching registered environments');
  const registeredEnvironments = await clients.configuration.listEnvironments();

  console.log('Scanning environments table');
  const activeEnvironments = await clients.environments.scan();

  const pools = Array.from(new Set(registeredEnvironments.map(e => e.pool)));
  console.log(`Detected the following pools: ${pools.join(',')}`);

  for (const pool of pools) {

    await RuntimeMetrics.scoped(async (metrics) => {

      metrics.setPool(pool);

      // to force recording a dimension set that only includes the pool
      // since this is the only dimension we have here.
      metrics.putDimensions({});

      const registeredInPool = registeredEnvironments.filter(e => e.pool === pool);
      const activeInPool = activeEnvironments.filter(e => hasEnv(registeredInPool, e));

      const freeCount = registeredInPool.filter(e => !hasEnv(activeInPool, e)).length;
      const registeredCount = registeredInPool.length;
      const inUseCount = activeInPool.filter(e => e.status === 'in-use').length;
      const cleaningCount = activeInPool.filter(e => e.status === 'cleaning').length;
      const dirtyCount = activeInPool.filter(e => e.status === 'dirty').length;

      const toEmit = {
        [METRIC_NAME_ENVIRONMENTS_REGISTERED]: registeredCount,
        [METRIC_NAME_ENVIRONMENTS_FREE]: freeCount,
        [METRIC_NAME_ENVIRONMENTS_IN_USE]: inUseCount,
        [METRIC_NAME_ENVIRONMENTS_CLEANING]: cleaningCount,
        [METRIC_NAME_ENVIRONMENTS_DIRTY]: dirtyCount,
      };

      for (const [metricName, value] of Object.entries(toEmit)) {
        console.log(`Emitting metric: ${metricName} = ${value} | pool: ${pool}`);
        metrics.delegate.putMetric(metricName, value, Unit.Count);
      }

    });

  }

}

function hasEnv(envs: { account: string; region: string }[], env: { account: string; region: string }) {
  return envs.some(e => e.account === env.account && e.region === env.region);
}
