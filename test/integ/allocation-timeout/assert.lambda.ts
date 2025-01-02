import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  // scenario 1
  // deallocate is not called so we expect the allocation timeout event to perform deallocation.
  await Session.assert(async (session: Session) => {
    const durationSeconds = 30;
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test', durationSeconds } );
    const body = JSON.parse(allocateResponse.body!);

    const account = body.environment.account;
    const region = body.environment.region;

    const waitTime = durationSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.

    session.log(`Waiting ${waitTime} seconds for allocation ${body.id} to expire...`);
    await session.waitFor(async () => (await session.fetchAllocation(body.id)).Item!.end?.S !== undefined, waitTime);

    session.log(`Waiting ${waitTime} seconds for environment to be cleaning...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item!.status?.S === 'cleaning', waitTime);

    session.log(`Waiting ${waitTime} seconds for the outcome of allocation '${body.id}' to be 'timeout'`);
    await session.waitFor(async () => (await session.fetchAllocation(body.id)).Item?.outcome?.S === 'timeout', waitTime);

    session.log(`Waiting ${waitTime} seconds for cleanup timeout schedule to be created...`);
    await session.waitFor(async () => (await session.fetchCleanupTimeoutSchedule(body.id)) !== undefined, waitTime);

  }, 'allocation-timeout-triggered-before-deallocate');

  // scenario 2
  // deallocate called so we expect the allocation timeout event to no-op
  await Session.assert(async (session: Session) => {
    const durationSeconds = 30;
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test', durationSeconds } );
    const body = JSON.parse(allocateResponse.body!);

    // explicitly dellocate before the allocation expires (happy path)
    await session.deallocate(body.id, { outcome: 'success' });

    const waitTime = durationSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.

    // wait for the allocation timeout event to be triggered
    session.log(`Waiting ${waitTime} seconds for allocation timeout event to be triggered...`);
    await session.waitFor(async () => (await session.fetchAllocationTimeoutSchedule(body.id)) === undefined, waitTime);

    // make sure the outcome is success and not timeout
    const allocation = await session.fetchAllocation(body.id);
    assert.strictEqual(allocation.Item!.outcome.S, 'success');

  }, 'allocation-timeout-triggered-after-deallocate');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}