import * as assert from 'assert';
import { S3 } from '@aws-sdk/client-s3';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region });

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // invoke cleanup task
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    // assert environment is released
    const environment = await session.fetchEnvironment(account, region);
    assert.ok(!environment.Item);

    // assert stack is deleted
    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  }, 'cleanup-deletes-stack-and-releases-environment');

  await Session.assert(async (session: Session) => {

    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // deploy a stack with a bucket
    const [stackName, resources] = await session.deploy({ templatePath: 'cleanup/stacks/versioned-bucket.yaml', region });

    const bucketName = resources.filter(r => r.ResourceType === 'AWS::S3::Bucket').map(r => r.PhysicalResourceId!)[0]!;

    const s3 = new S3({ region });

    // write and delete some files
    await s3.putObject({ Bucket: bucketName, Key: 'one.txt', Body: 'one' });
    await s3.putObject({ Bucket: bucketName, Key: 'two.txt', Body: 'two' });
    await s3.deleteObject({ Bucket: bucketName, Key: 'two.txt' });

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // invoke cleanup task
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 60 });

    // assert stack is deleted
    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  }, 'cleanup-empties-buckets');

  await Session.assert(async (session: Session) => {
    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region, terminationProtection: true });

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // invoke cleanup task
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    // assert stack is deleted
    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  }, 'cleanup-disables-termination-protection');

  await Session.assert(async (session: Session) => {

    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // simulates a cleanup timeout
    await session.environments.dirty(body.id, account, region);

    // invoke cleanup task
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    // assert stack remains dirty
    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status.S, 'dirty');

  }, 'cleanup-doesnt-release-a-dirty-environment');

  await Session.assert(async (session: Session) => {

    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/cannot-delete.yaml', region });

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // invoke cleanup task
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    // assert environment is dirty
    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status.S, 'dirty');

    await session.destroy({ stackName, region });

  }, 'cleanup-marks-environment-dirty-if-fails-to-delete-stack');

  await Session.assert(async (session: Session) => {

    const [response] = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/thiry-seconds-delete-delay.yaml', region });

    // simulate a deallocation
    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.cleaning(body.id, account, region);

    // invoke cleanup task with a short timeout so it fails on timeout
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 10 });

    // assert environment is dirty
    const environment = await session.fetchEnvironment(account, region);
    assert.strictEqual(environment.Item?.status.S, 'dirty');

    await session.destroy({ stackName, region });

  }, 'cleanup-marks-environment-dirty-if-fails-on-timeout');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
