import * as assert from 'assert';
import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    let output = await session.allocate({ pool: 'release', requester: 'test' } );
    assert.strictEqual(output.status, 200, 'Expected first allocation to succeed');

    const body = JSON.parse(output.body!);

    // assert database entries
    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);
    const allocation = await session.fetchAllocation(body.id);

    assert.strictEqual(environment.Item!.status.S, 'in-use');
    assert.strictEqual(allocation.Item!.account.S, body.environment.account);
    assert.strictEqual(allocation.Item!.region.S, body.environment.region);

    // assert that we cannot allocate again (we only have 1 environment in this integ test)
    output = await session.allocate({ pool: 'release', requester: 'test' });
    assert.strictEqual(output.status, 423, 'Expected second allocation to fail');
  });

}

// allows running the handler locally with ts-node
if (process.env.CDK_ATMOSPHERE_INTEG !== 'true') {
  void handler({});
}
