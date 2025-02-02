import { RuntimeClients } from '../../clients';
import { AllocationLogger } from '../../logging';
import { EnvironmentAlreadyReleasedError, EnvironmentAlreadyReallocated, EnvironmentAlreadyDirtyError } from '../../storage/environments.client';

export interface CleanupTimeoutEvent {
  readonly allocationId: string;
  readonly account: string;
  readonly region: string;
}

const clients = RuntimeClients.getOrCreate();

/**
 * Responsible for marking an environment as `dirty` in case the cleanup task (executed separately)
 * has timed out and didn't perform a successfull cleanup. When this happens, a human is notified in
 * order to attend to the environment and perform a manual cleanup. This ensures that the environment
 * doesn't remain in `cleaning` state forever.
 *
 * It is triggered on a fixed schedule via an EventBridge (one-time) schedule that is created upon deallocation.
 * Being a schedule, it may very well be triggered even if a cleanup was already performed successfully, or even
 * if the environment has already been reallocated to another requester; in that case, this function will simply
 * return and do nothing.
 *
 * Implementation
 * --------------
 *
 * 1. Update the `status` attribute in the `environments` table to `dirty`.
 *
 * > Note that we could have also configured the schedule itself to perform DB updates directly.
 * > However, custom exception handling is required in order to implement idempotancy, and
 * > that can only be done with a dedicated function.
 */
export async function handler(event: CleanupTimeoutEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const account = event.account;
  const region = event.region;
  const allocationId = event.allocationId;

  const log = new AllocationLogger({ id: allocationId, component: 'cleanup-timeout' });

  try {
    log.info(`Marking environment 'aws://${account}/${region}' as dirty`);
    await clients.environments.dirty(allocationId, account, region);
    log.info('Done');
  } catch (e: any) {
    if (e instanceof EnvironmentAlreadyReleasedError) {
      // happy path - the cleanup task succeeded and released the environment
      log.info(e.message);
      return;
    }
    if (e instanceof EnvironmentAlreadyDirtyError) {
      // happy path - the cleanup task already marked it as dirty
      log.info(e.message);
      return;
    }
    if (e instanceof EnvironmentAlreadyReallocated) {
      // semi happy path - the environment has already been reallocated by the time
      // this event got triggered. that's fine - it means it was already cleaned.
      log.info(e.message);
      return;
    }

    log.error(e);

    // unhappy path
    throw e;
  }
}