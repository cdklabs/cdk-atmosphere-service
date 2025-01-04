import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    assert.strictEqual(response.status, 200);

    const body = JSON.parse(response.body!);

    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);
    assert.strictEqual(environment.Item!.status.S, 'in-use');

    const allocation = await session.fetchAllocation(body.id);
    assert.strictEqual(allocation.Item!.account.S, body.environment.account);
    assert.strictEqual(allocation.Item!.region.S, body.environment.region);

    const timeoutSchedule = await session.fetchAllocationTimeoutSchedule(body.id);
    assert.ok(timeoutSchedule);

  }, 'allocate-creates-the-right-resources');

  await Session.assert(async (session: Session) => {
    [] = await session.allocate({ pool: 'release', requester: 'test' } );

    const [response] = await session.allocate({ pool: 'release', requester: 'test' });
    assert.strictEqual(response.status, 423);

  }, 'allocate-responds-with-locked');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
