import { RuntimeClients } from '../clients';
import { Cleaner, CleanerError } from './cleaner';
import * as envars from '../envars';
import { AllocationLogger } from '../logging';
import type { Allocation } from '../storage/allocations.client';
import { EnvironmentAlreadyDirtyError } from '../storage/environments.client';

const clients = RuntimeClients.getOrCreate();

export interface CleanupRequest {
  readonly allocationId: string;
  readonly timeoutSeconds: number;
}

export async function handler(req: CleanupRequest) {

  const log = new AllocationLogger({ id: req.allocationId, component: 'cleanup' });

  log.info('Fetching allocation');
  const allocation = await fetchAllocation(req.allocationId, log);

  const env = `aws://${allocation.account}/${allocation.region}`;

  try {

    log.info(`Fetching environment '${env}'`);
    const environment = await clients.configuration.getEnvironment(allocation.account, allocation.region);

    const cleaner = new Cleaner(environment, log);

    log.info(`Starting cleanup of '${env}'`);
    await cleaner.clean(req.timeoutSeconds);
    log.info(`Successfully cleaned '${env}'`);

    log.info(`Releasing environment '${env}'`);
    await clients.environments.release(req.allocationId, environment.account, environment.region);
    log.info(`Successfully released environment '${env}'`);

    log.info('Done!');
  } catch (e: any) {

    if (e instanceof EnvironmentAlreadyDirtyError) {
      // unlikely but can happen if the cleanup timeout event already triggered.
      // even though we successfully cleaned the environment, we still keep it marked as
      // dirty because it took too long, and needs investigation.
      log.info(`Environment ${env} was cleaned successfully, but it took too long to complete.`);
      return;
    }

    log.error(e);

    log.info(`Marking environment '${env}' as 'dirty'`);
    await clients.environments.dirty(req.allocationId, allocation.account, allocation.region);
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

      // we don't fail the task here because
      return;

    }

    throw new Error(`Failed cleaning '${env}'`);
  }

}

async function fetchAllocation(id: string, log: AllocationLogger): Promise<Allocation> {
  try {
    return await clients.allocations.get(id);
  } catch (e: any) {
    // to make sure error logging is done with the allocation logger.
    // otherwise ecs will log it but we loose the context.
    log.error(e);
    throw new Error('Failed fetching allocation from database');
  }
}

if (require.main !== module) {
  // do nothing - this file is just being imported
} else {
  const allocationId = envars.Envars.required(envars.CLEANUP_TASK_ALLOCATION_ID as any);
  const timeoutSeconds = Number(envars.Envars.required(envars.CLEANUP_TASK_TIMEOUT_SECONDS as any));
  void handler({ allocationId, timeoutSeconds });
}
