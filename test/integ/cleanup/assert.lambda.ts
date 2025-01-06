import * as assert from 'assert';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [allocateResponse] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);

    const account = body.environment.account;
    const region = body.environment.region;

    await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region });

    [] = await session.deallocate(body.id, { outcome: 'success' });

    const waitTimeSeconds = 120;
    session.log(`Waiting ${waitTimeSeconds} seconds for environment aws://${account}/${region} to be released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTimeSeconds);

    session.log(`Waiting ${waitTimeSeconds} seconds for cleanup task to stop`);
    await session.waitFor(async () => (await session.fetchStoppedCleanupTask(body.id)) !== undefined, waitTimeSeconds);

    const task = await session.fetchStoppedCleanupTask(body.id);
    assert.strictEqual(task!.containers![0].exitCode, 0);

    // TODO assert stack was deleted

  }, 'cleanup-deletes-simple-stack');

  await Session.assert(async (session: Session) => {
    const [allocateResponse] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);

    const account = body.environment.account;
    const region = body.environment.region;

    await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region, terminationProtection: true });

    [] = await session.deallocate(body.id, { outcome: 'success' });

    const waitTimeSeconds = 120;
    session.log(`Waiting ${waitTimeSeconds} seconds for environment aws://${account}/${region} to be released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTimeSeconds);

    session.log(`Waiting ${waitTimeSeconds} seconds for cleanup task to stop`);
    await session.waitFor(async () => (await session.fetchStoppedCleanupTask(body.id)) !== undefined, waitTimeSeconds);

    const task = await session.fetchStoppedCleanupTask(body.id);
    assert.strictEqual(task!.containers![0].exitCode, 0);

  }, 'cleanup-disables-termination-protection');

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deploy a stack that takes 2 minute to delete
    await session.deploy({ templatePath: 'cleanup-timeout/stacks/two-minutes-delete-delay.yaml', region });

    // deallocate and limit the cleanup task duration to 10 seconds.
    // ensuring the timoeout is triggered before the task completes
    const [, timeout] = await session.deallocate(body.id, { outcome: 'success', cleanupDurationSeconds: 10 });

    session.log(`Waiting for cleanup of allocation ${body.id} to timeout`);
    await timeout;

    let environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status?.S, 'dirty');

    // wait for the cleanup task to complete
    await session.waitFor(async () => (await session.fetchStoppedCleanupTask(body.id)) !== undefined, 180);

    // assert it didn't release the environment

  }, 'cleanup-doesnt-release-a-dirty-environment');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
