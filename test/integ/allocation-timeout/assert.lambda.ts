import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [response, timeout] = await session.allocate({ pool: 'release', requester: 'test', durationSeconds: 10 } );
    const body = JSON.parse(response.body!);

    await timeout;

    const allocation = await session.fetchAllocation(body.id);
    assert.ok(allocation.Item?.end.S);

  }, 'allocation-timeout-triggered-before-deallocate');

  // await Session.assert(async (session: Session) => {
  //   const [response, timeout] = await session.allocate({ pool: 'release', requester: 'test', durationSeconds: 30 } );
  //   const body = JSON.parse(response.body!);

  //   // explicitly dellocate before the allocation expires (happy path)
  //   [] = await session.deallocate(body.id, { outcome: 'success' });

  //   await timeout;

  //   // make sure the outcome is success and not timeout
  //   const allocation = await session.fetchAllocation(body.id);
  //   assert.strictEqual(allocation.Item!.outcome.S, 'success');

  // }, 'allocation-timeout-triggered-after-deallocate');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}