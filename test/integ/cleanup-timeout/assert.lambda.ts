import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [, timeout] = await session.deallocate(body.id, { outcome: 'success', cleanupDurationSeconds: 10 });

    session.log(`Waiting for cleanup of allocation ${body.id} to timeout`);
    await timeout;

    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status?.S, 'dirty');

  }, 'cleanup-timeout-triggered-before-cleanup-finished');

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [, timeout] = await session.deallocate(body.id, { outcome: 'success', cleanupDurationSeconds: 30 });

    await session.environments.release(body.id, account, region);

    session.log(`Waiting for cleanup of allocation ${body.id} to timeout`);
    await timeout;

    const environment = await session.fetchEnvironment(account, region);
    assert.ok(!environment.Item);

  }, 'cleanup-timeout-triggered-after-cleanup-finished');

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);

    const account = body.environment.account;
    const region = body.environment.region;
    const allocationId = body.id;

    const [, timeout] = await session.deallocate(allocationId, { outcome: 'success', cleanupDurationSeconds: 60 });

    // in the meantime simulate a quick and successfull cleanup
    await session.environments.release(allocationId, account, region);

    // and now allocate again - acquiring the same environment
    [] = await session.allocate({ pool: 'release', requester: 'test' } );

    session.log(`Waiting for cleanup of allocation ${allocationId} to timeout`);
    await timeout;

    const environment = await session.fetchEnvironment(account, region);
    assert.notStrictEqual(environment.Item?.status?.S, 'dirty');

  }, 'cleanup-timeout-triggered-on-reallocated-environment');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}