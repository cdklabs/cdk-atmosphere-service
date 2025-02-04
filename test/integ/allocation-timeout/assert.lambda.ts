import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Runner, SUCCESS_PAYLOAD } from '../atmosphere.runner';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Runner.assert('ends-allocation-if-active', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);

    await session.runtime.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.ok(allocation.end);

  });

  await Runner.assert('no-ops-if-allocation-has-ended', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);

    await clients.allocations.end({ id: body.id, outcome: 'success' });
    await session.runtime.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.strictEqual(allocation.outcome, 'success');

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}