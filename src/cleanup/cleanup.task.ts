import { RuntimeClients } from '../clients';
import { Cleaner, CleanerError } from './cleaner';
import * as envars from '../envars';
import { EnvironmentAlreadyDirtyError } from '../storage/environments.client';

const clients = RuntimeClients.getOrCreate();

export interface CleanupRequest {
  readonly allocationId: string;
  readonly timeoutSeconds: number;
}

export async function handler(req: CleanupRequest) {

  log(`Fetching allocation '${req.allocationId}'`);
  const allocation = await clients.allocations.get(req.allocationId);

  const env = `aws://${allocation.account}/${allocation.region}`;

  log(`Fetching environment '${env}'`);
  const environment = await clients.configuration.getEnvironment(allocation.account, allocation.region);

  const cleaner = new Cleaner(environment);
  try {
    log(`Starting cleanup of '${env}'`);
    await cleaner.clean(req.timeoutSeconds);
    log(`Successfully cleaned '${env}'`);

    log(`Releasing environment '${env}'`);
    await clients.environments.release(req.allocationId, environment.account, environment.region);
    log(`Successfully released environment '${env}'`);

    log('Done!');
  } catch (e: any) {

    if (e instanceof EnvironmentAlreadyDirtyError) {
      // unlikely but can happen if the cleanup timeout event already triggered.
      // even though we successfully cleaned the environment, we still keep it marked as
      // dirty because it took too long, and needs investigation.
      console.log(`Environment ${env} was cleaned successfully, but it took too long to complete.`);
      return;
    }

    log(`Unable to clean '${env}': ${e.message}`);
    log(`Marking environment '${env}' as 'dirty'`);
    await clients.environments.dirty(req.allocationId, environment.account, environment.region);
    log(`Successfully marked environment '${env}' as 'dirty'`);

    if (e instanceof CleanerError) {
      console.log();
      console.log('>> Failed stacks errors report <<');
      for (const f of e.failedStacks) {
        console.log('');
        console.log(`----- Stack: ${f.name} -----`);
        console.log('');
        console.log(f.error);
      }

      return;

    }

    throw e;
  }

}

function log(message: string) {
  console.log(`${new Date().toISOString()} | ${message}`);
}

if (require.main !== module) {
  // do nothing - this file is just being imported
} else {
  const allocationId = envars.Envars.required(envars.CLEANUP_TASK_ALLOCATION_ID as any);
  const timeoutSeconds = Number(envars.Envars.required(envars.CLEANUP_TASK_TIMEOUT_SECONDS as any));
  void handler({ allocationId, timeoutSeconds });
}
