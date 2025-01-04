import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  // scene 1
  // cleanup timeout event is triggered before cleanup is finished so we expect the environment to be dirty
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deploy a stack that takes 2 minute to delete
    await session.deploy({ templatePath: 'cleanup-timeout/two-minutes-delete-delay.yaml', region });

    // now deallocate and schedule the clenaup timeout for 10 seconds.
    // this ensures the timeout is triggered before the cleanup is done.
    const cleanupTimeoutSeconds = 10;
    await session.deallocate(body.id, { outcome: 'success', cleanupDurationSeconds: cleanupTimeoutSeconds });

    const waitTime = cleanupTimeoutSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.
    session.log(`Waiting ${waitTime} seconds for environment 'aws://${account}/${region}' to be marked dirty...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S === 'dirty', waitTime);

    session.log(`Waiting ${waitTime} seconds for cleanup task to stop`);
    await session.waitFor(async () => (await session.fetchStoppedCleanupTask(body.id)) !== undefined, waitTime);

    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status?.S, 'dirty');

  }, 'cleanup-timeout-triggered-before-cleanup-finished');

  // scenario 2
  // cleanup timeout event is triggered after cleanup is finished so we expect the environment to be released
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deallocate and schedule cleanup timeout for 2 minutes
    // this ensures the timeout is triggered after cleanup because
    const cleanupTimeoutSeconds = 2 * 60;
    await session.deallocate(body.id, { outcome: 'success', cleanupDurationSeconds: cleanupTimeoutSeconds });

    const waitTime = cleanupTimeoutSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.
    session.log(`Waiting for ${waitTime} seconds that environment 'aws://${account}/${region}' is released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTime);

  }, 'cleanup-timeout-triggered-after-cleanup-finished');

  // scenario 3
  // cleanup timeout event is triggered on an a foreign allocation so we expect it to no-op
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocateResponsebody = JSON.parse(allocateResponse.body!);

    const account = allocateResponsebody.environment.account;
    const region = allocateResponsebody.environment.region;
    const allocationId = allocateResponsebody.id;

    // deallocate
    const cleanupTimeoutSeconds = 3 * 60;
    await session.deallocate(allocationId, { outcome: 'success', cleanupDurationSeconds: cleanupTimeoutSeconds });

    let waitTime = 60; // 1 minute should be enough time for cleanup to succeed
    session.log(`Waiting for ${waitTime} seconds for environment 'aws://${account}/${region}' to be released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTime);

    // and now allocate again - acquiring the same environment
    await session.allocate({ pool: 'release', requester: 'test' } );

    // wait for the first allocation cleanup timeout event to be triggered
    waitTime = cleanupTimeoutSeconds + 60;
    await session.waitFor(async () => (await session.fetchCleanupTimeoutSchedule(allocationId)) === undefined, waitTime);

    // make sure the first allocation cleanup timeout doesnt affect the second allocation
    waitTime = 20;
    session.log(`Asserting for ${waitTime} seconds that environment 'aws://${account}/${region}' is not marked dirty...`);
    await session.okFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S !== 'dirty', waitTime);

  }, 'cleanup-timeout-triggered-on-reallocated-environment');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}