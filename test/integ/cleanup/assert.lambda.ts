import * as assert from 'assert';
import { S3 } from '@aws-sdk/client-s3';
import { Session, SUCCESS_PAYLOAD } from '../service.session';

export async function handler(_: any) {

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region });

    await session.environments.cleaning(body.id, account, region);
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    try {
      await session.environments.get(account, region);
    } catch (err: any) {
      assert.strictEqual(err.constructor.name, 'EnvironmentNotFound');
    }

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  }, 'deletes-stack-and-releases-environment');

  await Session.assert(async (session: Session) => {

    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName, resources] = await session.deploy({ templatePath: 'cleanup/stacks/versioned-bucket.yaml', region });

    const bucketName = resources.filter(r => r.ResourceType === 'AWS::S3::Bucket').map(r => r.PhysicalResourceId!)[0]!;

    const s3 = new S3({ region });

    await s3.putObject({ Bucket: bucketName, Key: 'one.txt', Body: 'one' });
    await s3.putObject({ Bucket: bucketName, Key: 'two.txt', Body: 'two' });
    await s3.deleteObject({ Bucket: bucketName, Key: 'two.txt' });

    await session.environments.cleaning(body.id, account, region);
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 60 });

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

    try {
      await s3.headBucket({ Bucket: bucketName });
    } catch (err: any) {
      assert.strictEqual(err.name, 'NotFound');
    }

  }, 'empties-and-deletes-buckets');

  await Session.assert(async (session: Session) => {
    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/simple.yaml', region, terminationProtection: true });

    await session.environments.cleaning(body.id, account, region);
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  }, 'disables-termination-protection');

  await Session.assert(async (session: Session) => {

    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await session.allocations.end({ id: body.id, outcome: 'success' });
    await session.environments.dirty(body.id, account, region);
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    const environment = await session.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

  }, 'doesnt-release-a-dirty-environment');

  await Session.assert(async (session: Session) => {

    const response = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deploy({ templatePath: 'cleanup/stacks/cannot-delete.yaml', region });

    await session.environments.cleaning(body.id, account, region);
    await session.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    const environment = await session.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

    await session.destroy({ stackName, region });

  }, 'marks-environment-dirty-if-fail');

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
