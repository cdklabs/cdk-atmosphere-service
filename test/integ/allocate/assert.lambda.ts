import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    assert.strictEqual(response.status, 200);

    const body = JSON.parse(response.body!);

    const environment = await session.environments.get(body.environment.account, body.environment.region);
    assert.strictEqual(environment.status, 'in-use');
    assert.strictEqual(environment.allocation, body.id);

    const allocation = await session.allocations.get(environment.allocation);
    assert.strictEqual(allocation.account, body.environment.account);
    assert.strictEqual(allocation.region, body.environment.region);

    const timeoutSchedule = await session.fetchAllocationTimeoutSchedule(body.id);
    assert.ok(timeoutSchedule);

  }, 'creates-the-right-resources');

  await Session.assert(async (session: Session) => {
    await session.allocate({ pool: 'release', requester: 'test' } );

    const response = await session.allocate({ pool: 'release', requester: 'test' });
    assert.strictEqual(response.status, 423);

  }, 'responds-with-locked-when-no-environments-are-available');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
