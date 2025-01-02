import * as assert from 'assert';
import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const durationSeconds = 30;
    const firstAllocateResponse = await session.allocate({ pool: 'release', requester: 'test', durationSeconds } );
    assert.strictEqual(firstAllocateResponse.status, 200, 'Expected first allocation to succeed');

    // assert that we cannot allocate again (we only have 1 environment in this integ test)
    const secondAllocateResponse = await session.allocate({ pool: 'release', requester: 'test' });
    assert.strictEqual(secondAllocateResponse.status, 423, 'Expected second allocation to fail');

    const body = JSON.parse(firstAllocateResponse.body!);

    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);
    assert.strictEqual(environment.Item!.status.S, 'in-use');

    const allocation = await session.fetchAllocation(body.id);
    assert.strictEqual(allocation.Item!.account.S, body.environment.account);
    assert.strictEqual(allocation.Item!.region.S, body.environment.region);

    const timeoutSchedule = await session.fetchAllocationTimeoutSchedule(body.id);
    assert.ok(timeoutSchedule);

    const waitTime = durationSeconds + 60; // give a 60 second buffer because the schedule granularity is 1 minute.

    session.log(`Waiting ${waitTime} seconds for allocation timeout schedule to be deleted...`);
    await session.waitFor(async () => (await session.fetchAllocationTimeoutSchedule(body.id)) === undefined, waitTime);
  });

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
