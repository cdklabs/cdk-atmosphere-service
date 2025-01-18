import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    const account = allocationResponseBody.environment.account;
    const region = allocationResponseBody.environment.region;

    const deallocateResponse = await session.runtime.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(deallocateResponse.status, 200);

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'cleaning');

    const allocation = await clients.allocations.get(allocationResponseBody.id);
    assert.ok(allocation.end);

    const cleanupTimeoutSchedule = await session.fetchCleanupTimeoutSchedule(allocationResponseBody.id);
    assert.ok(cleanupTimeoutSchedule);

  }, 'creates-right-resources');

  await Session.assert(async (session: Session) => {
    const allocateResponse = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    await session.runtime.deallocate(allocationResponseBody.id, { outcome: 'success' });

    const secondDeallocateResponse = await session.runtime.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(secondDeallocateResponse.status, 200);

  }, 'is-idempotent');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
