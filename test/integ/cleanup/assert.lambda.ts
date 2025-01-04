import * as assert from 'assert';
import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);

    const account = body.environment.account;
    const region = body.environment.region;

    await session.deallocate(body.id, { outcome: 'success' });

    const waitTimeSeconds = 120;
    session.log(`Waiting ${waitTimeSeconds} seconds for environment aws://${account}/${region} to be released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTimeSeconds);

    session.log(`Waiting ${waitTimeSeconds} seconds for cleanup task to stop`);
    await session.waitFor(async () => (await session.fetchStoppedCleanupTask(body.id)) !== undefined, waitTimeSeconds);

    const task = await session.fetchStoppedCleanupTask(body.id);
    assert.strictEqual(task!.containers![0].exitCode, 0);

  });

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
