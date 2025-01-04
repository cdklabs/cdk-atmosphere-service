import { RuntimeClients } from '../clients';
import { Cleaner, CleanerError } from './cleaner';
import * as envars from '../envars';

const clients = RuntimeClients.getOrCreate();

export async function handler() {

  const allocationId = envars.Envars.required(envars.CLEANUP_TASK_ALLOCATION_ID as any);
  const timeoutSeconds = Number(envars.Envars.required(envars.CLEANUP_TASK_TIMEOUT_SECONDS as any));

  console.log(`Fetching allocation '${allocationId}'`);
  const allocation = await clients.allocations.get(allocationId);

  const env = `aws://${allocation.account}/${allocation.region}`;

  console.log(`Fetching environment '${env}'`);
  const environment = await clients.configuration.getEnvironment(allocation.account, allocation.region);

  const cleaner = new Cleaner(environment);
  try {
    console.log(`Starting cleanup of '${env}'`);
    await cleaner.clean(timeoutSeconds);
    console.log(`Successfully cleaned '${env}'`);

    console.log(`Releasing environment '${env}'`);
    await clients.environments.release(allocationId, environment.account, environment.region);
    console.log(`Successfully released environment '${env}'`);

    console.log('Done!');
  } catch (e: any) {
    console.error(`Failed cleaning '${env}}'`, e.message);
    if (e instanceof CleanerError) {
      for (const f of e.failedStacks) {
        console.log('');
        console.log(`----- ${f.name} -----`);
        console.log(f.error);
      }
    }

    console.log(`Marking environment '${env}' as 'dirty'`);
    await clients.environments.dirty(allocationId, environment.account, environment.region);
    console.log(`Successfully marked environment '${env}' as 'dirty'`);

    throw e;
  }

}

void handler();