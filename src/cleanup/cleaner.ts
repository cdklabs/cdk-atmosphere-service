// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormation, DeleteStackCommand, paginateDescribeStacks, Stack, UpdateTerminationProtectionCommand, waitUntilStackDeleteComplete } from '@aws-sdk/client-cloudformation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsCredentialIdentityProvider } from '@smithy/types';
import type { Environment } from '../config';
import { BucketsCleaner } from './cleaner.buckets';
import { ReposCleaner } from './cleaner.repos';
import { AllocationLogger } from '../logging';

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

  constructor(
    private readonly environment: Environment,
    private readonly log: AllocationLogger) {
    this.credentials = fromTemporaryCredentials({
      params: {
        RoleArn: this.environment.adminRoleArn,
        RoleSessionName: `atmosphere.cleanup.${this.environment.account}.${this.environment.region}`,
      },
    });
    this.cfn = new CloudFormation({ credentials: this.credentials, region: this.environment.region });
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

      // most commonly, stacks cannot be deleted because their buckets or ECR repositories
      // contain objects, and must be cleaned before attempting deletion.
      // so instead, we just forcefully remove them and hope it happens before CFN decides to fail
      // stack deletion. if this won't suffice, we can catch a DELETE_FAILED state and retry.

      const bucketsCleaner = new BucketsCleaner(this.credentials, this.environment.region, stack, this.log);
      this.log.info(`Cleaning buckets in stack ${stack.StackName}`);
      await bucketsCleaner.clean({ timeoutDate });

      const reposCleaner = new ReposCleaner(this.credentials, this.environment.region, stack, this.log);
      this.log.info(`Cleaning repositories in stack ${stack.StackName}`);
      // not passing timeout date here because this operation does not need to wait for anything
      await reposCleaner.clean();

      if (stack.ParentId) {
        // for nested stacks, we stop here because deletion
        // itself will be done via the parent stack.
        return { name: stack.StackName! };
      }

      if (stack.StackStatus !== 'DELETE_IN_PROGRESS') {

        this.log.info(`Disabling termination protection of stack ${stack.StackName}`);
        await this.cfn.send(new UpdateTerminationProtectionCommand({
          StackName: stack.StackName,
          EnableTerminationProtection: false,
        }));

        this.log.info(`Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
        await this.cfn.send(new DeleteStackCommand({ StackName: stack.StackName, RoleARN: this.environment.adminRoleArn }));
      }

      const maxWaitSeconds = (timeoutDate.getTime() - Date.now()) / 1000;
      this.log.info(`Stack ${stack.StackName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
      await waitUntilStackDeleteComplete(
        { client: this.cfn, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
        { StackName: stack.StackName },
      );
      this.log.info(`Stack ${stack.StackName} deleted.`);

      return { name: stack.StackName! };
    } catch (e: any) {
      return { name: stack.StackName!, error: e };
    }
  }

}