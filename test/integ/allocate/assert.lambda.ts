import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Runner, SUCCESS_PAYLOAD } from '../atmosphere.runner';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Runner.assert('creates-the-right-resources', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    assert.strictEqual(response.status, 200);

    const body = JSON.parse(response.body!);

    const environment = await clients.environments.get(body.environment.account, body.environment.region);
    assert.strictEqual(environment.status, 'in-use');
    assert.strictEqual(environment.allocation, body.id);

    const allocation = await clients.allocations.get(environment.allocation);
    assert.strictEqual(allocation.account, body.environment.account);
    assert.strictEqual(allocation.region, body.environment.region);

    const timeoutSchedule = await session.fetchAllocationTimeoutSchedule(body.id);
    assert.ok(timeoutSchedule);

  });

  await Runner.assert('responds-with-locked-when-no-environments-are-available', async (session: Runner) => {
    await session.runtime.allocate({ pool: 'release', requester: 'test' } );

    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' });
    assert.strictEqual(response.status, 423);

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}
