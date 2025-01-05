import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [allocateResponse] = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    const account = allocationResponseBody.environment.account;
    const region = allocationResponseBody.environment.region;

    const [deallocateResponse] = await session.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(deallocateResponse.status, 200);

    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item!.status.S, 'cleaning');

    const allocation = await session.fetchAllocation(allocationResponseBody.id);
    assert.ok(allocation.Item!.end?.S);

    const cleanupTimeoutSchedule = await session.fetchCleanupTimeoutSchedule(allocationResponseBody.id);
    assert.ok(cleanupTimeoutSchedule);

  }, 'deallocate-creates-right-resources');

  await Session.assert(async (session: Session) => {
    const [allocateResponse] = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    [] = await session.deallocate(allocationResponseBody.id, { outcome: 'success' });

    // second deallocation should succeed (and do nothing)
    const [secondDeallocateResponse] = await session.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(secondDeallocateResponse.status, 200);

  }, 'deallocate-is-idempotent');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
