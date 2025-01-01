import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  // scene 1
  // cleanup timeout event is triggered before cleanup is finished so we expect the environment to be dirty
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deallocate
    const cleanupTimeoutSeconds = 10;
    await session.deallocate(body.id, { outcome: 'success', cleanupTimeoutSeconds });

    const waitTime = cleanupTimeoutSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.
    session.log(`Waiting ${waitTime} seconds for environment 'aws://${account}/${region}' to be marked dirty...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S === 'dirty', waitTime);

  }, 'cleanup-timeout-triggered-before-cleanup-finished');

  // scenario 2
  // cleanup timeout event is triggered after cleanup is finished so we expect the environment to be released
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deallocate
    const cleanupTimeoutSeconds = 30;
    await session.deallocate(body.id, { outcome: 'success', cleanupTimeoutSeconds });

    // simulate a quick and successfull cleanup
    await session.environments.release(body.id, account, region);

    const waitTime = cleanupTimeoutSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.
    session.log(`Asserting for ${waitTime} seconds that environment 'aws://${account}/${region}' is released...`);
    await session.okFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTime);

  }, 'cleanup-timeout-triggered-after-cleanup-finished');

  // scenario 3
  // cleanup timeout event is triggered on an a foreign allocation so we expect it to no-op
  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocateResponsebody = JSON.parse(allocateResponse.body!);

    const account = allocateResponsebody.environment.account;
    const region = allocateResponsebody.environment.region;
    const allocationId = allocateResponsebody.id;

    // deallocate and schedule the cleanup timeout to 60 seconds from now
    const cleanupTimeoutSeconds = 60;
    await session.deallocate(allocationId, { outcome: 'success', cleanupTimeoutSeconds });

    // in the meantime simulate a quick and successfull cleanup
    await session.environments.release(allocationId, account, region);

    // and now allocate again - acquiring the same environment
    await session.allocate({ pool: 'release', requester: 'test' } );

    // make sure the first allocation cleanup timeout doesnt affect the second allocation
    const waitTime = cleanupTimeoutSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.

    session.log(`Asserting for ${waitTime} seconds that environment 'aws://${account}/${region}' is not marked dirty...`);
    await session.okFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S !== 'dirty', waitTime);

  }, 'cleanup-timeout-triggered-on-reallocated-environment');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}