// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormationClient, CloudFormationServiceException, DeleteStackCommand, DescribeStacksCommand, paginateDescribeStacks, Stack } from '@aws-sdk/client-cloudformation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsCredentialIdentityProvider } from '@smithy/types';
import type { Environment } from '../config';

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
  private readonly cfn: CloudFormationClient;

  constructor(private readonly environment: Environment) {
    this.credentials = fromTemporaryCredentials({
      params: {
        RoleArn: this.environment.adminRoleArn,
        RoleSessionName: `atmosphere.cleanup.${this.environment.account}.${this.environment.region}`,
      },
    });
    this.cfn = new CloudFormationClient({ credentials: this.credentials, region: this.environment.region });
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

    if (!stack.StackName) {
      // how can this be...
      throw new Error('Stack name is undefined');
    }

    try {
      if (stack.StackStatus !== 'DELETE_IN_PROGRESS') {
        this.log(`Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
        await this.cfn.send(new DeleteStackCommand({ StackName: stack.StackName, RoleARN: this.environment.adminRoleArn }));
      }

      this.log(`Stack ${stack.StackName} deleting. Waiting for completion.`);
      await this.waitForStackDeleteComplete(stack.StackName, timeoutDate);
      return { name: stack.StackName };
    } catch (e: any) {
      return { name: stack.StackName!, error: e };
    }
  }

  private async waitForStackDeleteComplete(stackName: string, timeoutDate: Date) {

    while (true) {
      try {
        const response = await this.cfn.send(new DescribeStacksCommand({ StackName: stackName }));
        const stack = response.Stacks?.[0];

        if (!stack) {
          return;
        }

        if (stack.StackStatus?.endsWith('FAILED')) {
          throw new Error(`Stack ${stackName} deletion failed with status ${stack.StackStatus}`);
        }

        if (stack.StackStatus === 'DELETE_COMPLETE') {
          return;
        }

        if (Date.now() > timeoutDate.getTime()) {
          throw new Error(`Timed out waiting for stack ${stackName} to delete [Current Status: ${stack?.StackStatus}]`);
        }

        this.log(`Stack ${stackName} is not yet deleted [Current Status: ${stack.StackStatus}] (will check again in 5 seconds)`);
        await new Promise(resolve => setTimeout(resolve, 5000));

      } catch (error: any) {
        if (error instanceof CloudFormationServiceException && error.name === 'ValidationError') {
          // Stack no longer exists
          return;
        }
        throw error;
      };
    }

  }

  private log(message: string | Error) {
    console.log(`aws://${this.environment.account}/${this.environment.region} | ${message}`);
  }

}