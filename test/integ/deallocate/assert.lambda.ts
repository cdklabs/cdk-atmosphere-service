import * as assert from 'assert';
import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const output = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(output.body!);

    const deallocateResponse = await session.deallocate(body.id, { outcome: 'success' });
    assert.strictEqual(deallocateResponse.status, 200);

    // assert database entries
    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);

    assert.strictEqual(environment.Item!.status.S, 'cleaning');
  });

}

// allows running the handler locally with ts-node
if (process.env.CDK_ATMOSPHERE_INTEG !== 'true') {
  void handler({});
}
