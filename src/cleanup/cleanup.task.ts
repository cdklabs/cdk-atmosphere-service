import { RuntimeClients } from '../clients';
import { Cleaner, CleanerError } from './cleaner';
import * as envars from '../envars';
import { Logger } from '../logging';
import { Allocation } from '../storage/allocations.client';
import { EnvironmentAlreadyInUseError } from '../storage/environments.client';

const clients = RuntimeClients.getOrCreate();

export interface CleanupRequest {
  readonly allocationId: string;
  readonly timeoutSeconds: number;
}
export async function handler(req: CleanupRequest) {
  const allocation = await clients.allocations.get(req.allocationId);
  const log = new Logger({ allocationId: req.allocationId, pool: allocation.pool, component: 'cleanup' });
  return doHandler(allocation, req.timeoutSeconds, log);
}

async function doHandler(allocation: Allocation, timeoutSeconds: number, log: Logger) {

  const env = `aws://${allocation.account}/${allocation.region}`;

  try {

    log.info(`Fetching environment '${env}'`);
    const environment = await clients.configuration.getEnvironment(allocation.account, allocation.region);

    const cleaner = new Cleaner(environment, log);

    log.info(`Starting cleanup of '${env}'`);
    await cleaner.clean(timeoutSeconds);
    log.info(`Successfully cleaned '${env}'`);

    log.info(`Releasing environment '${env}'`);
    await clients.environments.release(allocation.id, environment.account, environment.region);
    log.info(`Successfully released environment '${env}'`);

    log.info('Done!');
  } catch (e: any) {

    if (e instanceof EnvironmentAlreadyInUseError) {
      // this is an illegal state transition and should never happen.
      // TODO - we should catch this state before cleaning any resources.
      log.error(e, `Failed releasing environment '${env}'`);
      throw e;
    }

    log.error(e);

    log.info(`Marking environment '${env}' as 'dirty'`);
    await clients.environments.dirty(allocation.id, allocation.account, allocation.region);
    log.info(`Successfully marked environment '${env}' as 'dirty'`);

    if (e instanceof CleanerError) {
      log.info();
      log.info('>> Failed stacks errors report <<');
      for (const f of e.failedStacks) {
        log.info('');
        log.info(`----- Stack: ${f.name} -----`);
        log.info('');
        log.error(f.error!);
      }

      return;

    }

    throw e;
  }

}

if (require.main !== module) {
  // do nothing - this file is just being imported
} else {
  const allocationId = envars.Envars.required(envars.CLEANUP_TASK_ALLOCATION_ID as any);
  const timeoutSeconds = Number(envars.Envars.required(envars.CLEANUP_TASK_TIMEOUT_SECONDS as any));
  void handler({ allocationId, timeoutSeconds });
}
