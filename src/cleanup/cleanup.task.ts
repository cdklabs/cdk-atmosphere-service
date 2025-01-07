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


  console.log(`Fetching allocation '${req.allocationId}'`);
  const allocation = await clients.allocations.get(req.allocationId);

  const env = `aws://${allocation.account}/${allocation.region}`;

  console.log(`Fetching environment '${env}'`);
  const environment = await clients.configuration.getEnvironment(allocation.account, allocation.region);

  const cleaner = new Cleaner(environment);
  try {
    console.log(`Starting cleanup of '${env}'`);
    await cleaner.clean(req.timeoutSeconds);
    console.log(`Successfully cleaned '${env}'`);

    console.log(`Releasing environment '${env}'`);
    await clients.environments.release(req.allocationId, environment.account, environment.region);
    console.log(`Successfully released environment '${env}'`);

    console.log('Done!');
  } catch (e: any) {

    if (e instanceof EnvironmentAlreadyDirtyError) {
      // unlikely but can happen if the cleanup timeout event already triggered
      // nothing to do here since cleanup was successfull and we don't need to make any
      // db changes.
      return;
    }

    if (e instanceof CleanerError) {
      console.error(`Unable to clean '${env}':`, e.message);
      console.log();
      console.log('>> Failed stacks errors report <<');
      for (const f of e.failedStacks) {
        console.log('');
        console.log(`----- Stack: ${f.name} -----`);
        console.log('');
        console.log(f.error);
      }

      console.log('');
      console.log(`Marking environment '${env}' as 'dirty'`);
      await clients.environments.dirty(req.allocationId, environment.account, environment.region);
      console.log(`Successfully marked environment '${env}' as 'dirty'`);

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
