import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);

    await session.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.ok(allocation.end);

  }, 'ends-allocation-if-active');

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test', durationSeconds: 30 } );
    const body = JSON.parse(response.body!);

    await clients.allocations.end({ id: body.id, outcome: 'success' });
    await session.allocationTimeout({ allocationId: body.id });

    const allocation = await clients.allocations.get(body.id);
    assert.strictEqual(allocation.outcome, 'success');

  }, 'no-ops-if-allocation-has-ended');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}