import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Assert, SUCCESS_PAYLOAD } from '../service.assert';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Assert.run('ends-allocation-if-active', async (session: Assert) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);

    await session.runtime.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.ok(allocation.end);

  });

  await Assert.run('no-ops-if-allocation-has-ended', async (session: Assert) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test', durationSeconds: 30 } );
    const body = JSON.parse(response.body!);

    await clients.allocations.end({ id: body.id, outcome: 'success' });
    await session.runtime.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.strictEqual(allocation.outcome, 'success');

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Assert.isLocal()) {
  void handler({});
}