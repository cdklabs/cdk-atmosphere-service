import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Assert, SUCCESS_PAYLOAD } from '../service.assert';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Assert.run('creates-right-resources', async (session: Assert) => {
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

  });

  await Assert.run('is-idempotent', async (session: Assert) => {
    const allocateResponse = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const allocationResponseBody = JSON.parse(allocateResponse.body!);

    await session.runtime.deallocate(allocationResponseBody.id, { outcome: 'success' });

    const secondDeallocateResponse = await session.runtime.deallocate(allocationResponseBody.id, { outcome: 'success' });
    assert.strictEqual(secondDeallocateResponse.status, 200);

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Assert.isLocal()) {
  void handler({});
}
