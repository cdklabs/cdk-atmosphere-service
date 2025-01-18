import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await session.environments.cleaning(body.id, account, region);
    await session.cleanupTimeout({ allocationId: body.id, account, region });

    const environment = await session.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

  }, 'marks-dirty-when-environment-is-still-cleaning');

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await session.environments.release(body.id, account, region);
    await session.cleanupTimeout({ allocationId: body.id, account, region });

    try {
      await session.environments.get(account, region);
    } catch (err: any) {
      assert.strictEqual(err.constructor.name, 'EnvironmentNotFound');
    }

  }, 'no-ops-when-environment-is-already-released');

  await Session.assert(async (session: Session) => {
    const allocateResponse1 = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse1.body!);

    const account = body.environment.account;
    const region = body.environment.region;
    const allocationId = body.id;

    await session.deallocate(allocationId, { outcome: 'success' });
    const allocateResponse2 = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocateResponseBody2 = JSON.parse(allocateResponse2.body!);

    await session.cleanupTimeout({ allocationId: allocateResponseBody2.id, account, region });

    const environment = await session.environments.get(account, region);
    assert.strictEqual(environment.status, 'in-use');

  }, 'no-ops-when-environment-has-been-reallocated');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}