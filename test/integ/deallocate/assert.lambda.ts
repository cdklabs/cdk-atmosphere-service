import * as assert from 'assert';
import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    const account = allocationResponseBody.environment.account;
    const region = allocationResponseBody.environment.region;

    const cleanupDurationSeconds = 30;
    const firstDeallocateResponse = await session.deallocate(allocationResponseBody.id, { outcome: 'success', cleanupDurationSeconds });
    assert.strictEqual(firstDeallocateResponse.status, 200);

    // second deallocation should succeed (and do nothing)
    const secondDeallocateResponse = await session.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(secondDeallocateResponse.status, 200);

    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item!.status.S, 'cleaning');

    const allocation = await session.fetchAllocation(allocationResponseBody.id);
    assert.ok(allocation.Item!.end?.S);

    const cleanupTimeoutSchedule = await session.fetchCleanupTimeoutSchedule(allocationResponseBody.id);
    assert.ok(cleanupTimeoutSchedule);

    const waitTime = cleanupDurationSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.

    session.log(`Waiting ${waitTime} seconds for cleanup timeout schedule to be deleted...`);
    await session.waitFor(async () => {
      return (await session.fetchCleanupTimeoutSchedule(allocationResponseBody.id)) === undefined;
    }, waitTime);

  });

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
