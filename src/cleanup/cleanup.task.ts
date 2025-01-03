import { RuntimeClients } from '../clients';
import { Environment } from '../config';
import { Cleaner, CleanerError } from './cleaner';

const TIMEOUT_SECONDS = 60 * 60;

export interface CleanupTaskOptions {
  readonly allocationId: string;
  readonly environment: Environment;
}

const clients = RuntimeClients.getOrCreate();

export async function handler(opts: CleanupTaskOptions) {

  const env = `aws://${opts.environment.account}/${opts.environment.region}`;
  const cleaner = new Cleaner(opts.environment);
  try {
    console.log(`Starting cleanup of '${env}'`);
    await cleaner.clean(TIMEOUT_SECONDS);
    console.log(`Successfully cleaned '${env}'`);
  } catch (e: any) {
    console.error(`Failed cleaning 'aws:' ${e.message}`);
    if (e instanceof CleanerError) {
      for (const f of e.failedStacks) {
        console.log('');
        console.log(`----- ${f.name} -----`);
        console.log(f.error);
      }
    }

    console.log(`Marking environment '${env} as 'dirty'`);
    await clients.environments.dirty(opts.allocationId, opts.environment.account, opts.environment.region);

    throw e;
  }

}