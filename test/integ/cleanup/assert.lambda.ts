import * as assert from 'assert';
import { S3 } from '@aws-sdk/client-s3';
import { RuntimeClients } from '../../../src/clients';
import { Runner, SUCCESS_PAYLOAD } from '../atmosphere.runner';

const clients = RuntimeClients.getOrCreate();

export async function handler(_: any) {

  await Runner.assert('deletes-stack-and-releases-environment', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deployStack({ templatePath: 'cleanup/stacks/simple.yaml', region });

    await clients.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    try {
      await clients.environments.get(account, region);
      assert.fail('expected environment to be deleted');
    } catch (err: any) {
      assert.strictEqual(err.constructor.name, 'EnvironmentNotFound');
    }

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  });

  await Runner.assert('empties-and-deletes-buckets', async (session: Runner) => {

    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName, resources] = await session.deployStack({ templatePath: 'cleanup/stacks/versioned-bucket.yaml', region });

    const bucketName = resources.filter(r => r.ResourceType === 'AWS::S3::Bucket').map(r => r.PhysicalResourceId!)[0]!;

    const s3 = new S3({ region });

    await s3.putObject({ Bucket: bucketName, Key: 'one.txt', Body: 'one' });
    await s3.putObject({ Bucket: bucketName, Key: 'two.txt', Body: 'two' });
    await s3.deleteObject({ Bucket: bucketName, Key: 'two.txt' });

    await clients.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 60 });

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

    try {
      await s3.headBucket({ Bucket: bucketName });
    } catch (err: any) {
      assert.strictEqual(err.name, 'NotFound');
    }

  });

  await Runner.assert('disables-termination-protection', async (session: Runner) => {
    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deployStack({ templatePath: 'cleanup/stacks/simple.yaml', region, terminationProtection: true });

    await clients.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    const stack = await session.fetchStack(stackName, region);
    assert.ok(!stack);

  });

  await Runner.assert('can-release-a-dirty-environment', async (session: Runner) => {

    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    await clients.allocations.end({ id: body.id, outcome: 'success' });
    await clients.environments.dirty(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    try {
      await clients.environments.get(account, region);
      assert.fail('expected environment to be released');
    } catch (err: any) {
      assert.strictEqual(err.constructor.name, 'EnvironmentNotFound');
    }

  });

  await Runner.assert('marks-environment-dirty-if-fail', async (session: Runner) => {

    const response = await session.runtime.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(response.body!);
    const account = body.environment.account;
    const region = body.environment.region;

    const [stackName] = await session.deployStack({ templatePath: 'cleanup/stacks/cannot-delete.yaml', region });

    await clients.environments.cleaning(body.id, account, region);
    await session.runtime.cleanup({ allocationId: body.id, timeoutSeconds: 30 });

    const environment = await clients.environments.get(account, region);
    assert.strictEqual(environment.status, 'dirty');

    await session.destroyStack({ stackName, region });

  });

  return SUCCESS_PAYLOAD;

}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}
