import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await clients.environments.cleaning(body.id, account, region);
    await session.cleanupTimeout({ allocationId: body.id, account, region });

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

  }, 'marks-dirty-when-environment-is-still-cleaning');

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await clients.environments.cleaning(body.id, account, region);
    await clients.environments.release(body.id, account, region);
    await session.cleanupTimeout({ allocationId: body.id, account, region });

    try {
      await clients.environments.get(account, region);
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

    await clients.environments.cleaning(allocationId, account, region);
    await clients.environments.release(allocationId, account, region);
    const allocateResponse2 = await session.allocate({ pool: 'release', requester: 'test' } );
    const allocateResponseBody2 = JSON.parse(allocateResponse2.body!);

    await session.cleanupTimeout({ allocationId, account, region });

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'in-use');
    assert.strictEqual(environment.allocation, allocateResponseBody2.id);

  }, 'no-ops-when-environment-has-been-reallocated');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}