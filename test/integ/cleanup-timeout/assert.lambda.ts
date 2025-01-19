import * as assert from 'assert';
import { RuntimeClients } from '../../../src/clients';
import { Runner, SUCCESS_PAYLOAD } from '../atmosphere.runner';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Runner.assert('marks-dirty-when-environment-is-still-cleaning', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await clients.environments.cleaning(body.id, account, region);
    await session.runtime.cleanupTimeout({ allocationId: body.id, account, region });

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

  });

  await Runner.assert('no-ops-when-environment-is-already-released', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await clients.environments.cleaning(body.id, account, region);
    await clients.environments.release(body.id, account, region);
    await session.runtime.cleanupTimeout({ allocationId: body.id, account, region });

    try {
      await clients.environments.get(account, region);
      assert.fail('expected environment to be deleted');
    } catch (err: any) {
      assert.strictEqual(err.constructor.name, 'EnvironmentNotFound');
    }

  });

  await Runner.assert('no-ops-when-environment-has-been-reallocated', async (session: Runner) => {
    const allocateResponse1 = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse1.body!);

    const account = body.environment.account;
    const region = body.environment.region;
    const allocationId = body.id;

    await clients.environments.cleaning(allocationId, account, region);
    await clients.environments.release(allocationId, account, region);
    const allocateResponse2 = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const allocateResponseBody2 = JSON.parse(allocateResponse2.body!);

    await session.runtime.cleanupTimeout({ allocationId, account, region });

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'in-use');
    assert.strictEqual(environment.allocation, allocateResponseBody2.id);

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}