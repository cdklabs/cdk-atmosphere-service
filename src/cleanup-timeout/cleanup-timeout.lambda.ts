import { RuntimeClients } from '../clients';
import { EnvironmentAlreadyReleasedError, EnvironmentAlreadyReallocated } from '../storage/environments.client';

interface CleanupTimeoutEvent {
  readonly allocationId: string;
  readonly account: string;
  readonly region: string;
}

const clients = RuntimeClients.getOrCreate();

export async function handler(event: CleanupTimeoutEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const account = event.account;
  const region = event.region;
  const allocationId = event.allocationId;

  try {
    console.log(`Marking environment 'aws://${account}/${region}' as dirty`);
    await clients.environments.dirty(allocationId, account, region);
    console.log('Done');
  } catch (e: any) {
    if (e instanceof EnvironmentAlreadyReleasedError) {
      // happy path - the cleanup task succeeded and released the environment
      console.log(e.message);
      return;
    }
    if (e instanceof EnvironmentAlreadyReallocated) {
      // semi happy path - the environment has already been reallocated by the time
      // this event got triggered. that's fine - it means it was already cleaned.
      console.log(e.message);
      return;
    }

    // unhappy path
    throw e;
  }
}