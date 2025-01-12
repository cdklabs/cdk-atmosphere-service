// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormation, DeleteStackCommand, paginateDescribeStacks, Stack, UpdateTerminationProtectionCommand, waitUntilStackDeleteComplete } from '@aws-sdk/client-cloudformation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ECR } from '@aws-sdk/client-ecr';
// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsCredentialIdentityProvider } from '@smithy/types';
import type { Environment } from '../config';
import { BucketCleaner } from './cleaner.bucket';
import { EcrCleaner } from './cleaner.ecr';

export interface DeleteStackResult {
  readonly name: string;
  readonly error?: Error;
}

/**
 * Error thrown when the cleanup process did not result in a clean environment.
 */
export class CleanerError extends Error {

  constructor(public readonly failedStacks: DeleteStackResult[]) {
    super('Some stacks failed to delete');
  }
}

export class Cleaner {

  private readonly credentials: AwsCredentialIdentityProvider;
  private readonly cfn: CloudFormation;
  private readonly bucketCleaner: BucketCleaner;
  private readonly ecrCleaner: EcrCleaner;

  constructor(private readonly environment: Environment) {
    this.credentials = fromTemporaryCredentials({
      params: {
        RoleArn: this.environment.adminRoleArn,
        RoleSessionName: `atmosphere.cleanup.${this.environment.account}.${this.environment.region}`,
      },
    });
    this.cfn = new CloudFormation({ credentials: this.credentials, region: this.environment.region });
    this.bucketCleaner = new BucketCleaner(new S3({ credentials: this.credentials, region: this.environment.region }));
    this.ecrCleaner = new EcrCleaner(new ECR({ credentials: this.credentials, region: this.environment.region }));
  }

  public async clean(timeoutSeconds: number) {

    const timeoutDate = new Date(Date.now() + 1000 * timeoutSeconds);

    const stacks = await this.listStacks();
    const promises = stacks.map(async (s) => this.deleteStack(s, timeoutDate));
    const results = await Promise.all(promises);

    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      throw new CleanerError(failed);
    }

  }

  private async listStacks() {

    const stacksPaginator = paginateDescribeStacks({ client: this.cfn, pageSize: 10 }, {});
    const stacks: Stack[] = [];

    for await (const page of stacksPaginator) {
      stacks.push(...page.Stacks ?? []);
    }

    return stacks;

  }

  private async deleteStack(stack: Stack, timeoutDate: Date): Promise<DeleteStackResult> {

    try {

      console.log(`Gathering buckets in stack ${stack.StackName}`);
      const buckets = ((await this.cfn.describeStackResources({ StackName: stack.StackName })).StackResources ?? []).filter(r => r.ResourceType === 'AWS::S3::Bucket').map(r => r.PhysicalResourceId!);

      console.log(`Gathering ECR repositories in stack ${stack.StackName}`);
      const ecrRepos = ((await this.cfn.describeStackResources({ StackName: stack.StackName })).StackResources ?? []).filter(r => r.ResourceType === 'AWS::ECR::Repository').map(r => r.PhysicalResourceId!);

      if (stack.StackStatus !== 'DELETE_IN_PROGRESS') {

        console.log(`Emptying buckets in stack ${stack.StackName}`);
        const bucketCleanup = buckets.map(b => this.bucketCleaner.clean({ bucketName: b, timeoutDate }));
        await Promise.all(bucketCleanup);

        this.log(`Disabling termination protection of stack ${stack.StackName}`);
        await this.cfn.send(new UpdateTerminationProtectionCommand({
          StackName: stack.StackName,
          EnableTerminationProtection: false,
        }));

        this.log(`Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
        await this.cfn.send(new DeleteStackCommand({ StackName: stack.StackName, RoleARN: this.environment.adminRoleArn }));
      }

      const maxWaitSeconds = (timeoutDate.getTime() - Date.now()) / 1000;
      this.log(`Stack ${stack.StackName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
      await waitUntilStackDeleteComplete(
        { client: this.cfn, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
        { StackName: stack.StackName },
      );
      this.log(`Stack ${stack.StackName} deleted.`);

      const bucketsDeletion = buckets.map(b => this.bucketCleaner.delete({ bucketName: b, timeoutDate }));
      await Promise.all(bucketsDeletion);

      const reposDeletion = ecrRepos.map(r => this.ecrCleaner.delete({ repositoryName: r, timeoutDate }));
      await Promise.all(reposDeletion);

      return { name: stack.StackName! };
    } catch (e: any) {
      return { name: stack.StackName!, error: e };
    }
  }

  private log(message: string | Error) {
    console.log(`${new Date().toISOString()} | aws://${this.environment.account}/${this.environment.region} | ${message}`);
  }

}