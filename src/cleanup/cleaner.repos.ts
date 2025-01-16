// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormation, Stack } from '@aws-sdk/client-cloudformation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ECR, RepositoryNotFoundException } from '@aws-sdk/client-ecr';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsCredentialIdentityProvider } from '@smithy/types';


export class ReposCleaner {

  private readonly cfn: CloudFormation;
  private readonly ecr: ECR;

  public constructor(
    credentials: AwsCredentialIdentityProvider,
    region: string,
    private readonly stack: Stack) {
    this.cfn = new CloudFormation({ credentials: credentials, region });
    this.ecr = new ECR({ credentials: credentials, region });
  }

  public async clean() {

    // first collect all repositories in the stack
    const repos = await this.listRepos();

    // then force delete them (including images inside)
    for (const repo of repos) {
      await this.deleteRepo(repo);
    }

  }

  private async listRepos(): Promise<string[]> {
    console.log(`Collecting ECR repositories in stack ${this.stack.StackName}`);
    return ((await this.cfn.describeStackResources({ StackName: this.stack.StackName })).StackResources ?? [])
      .filter(r => r.ResourceType === 'AWS::ECR::Repository').map(r => r.PhysicalResourceId!);
  }

  private async deleteRepo(repositoryName: string) {
    console.log(`Deleting repository: ${repositoryName}`);

    try {
      await this.ecr.deleteRepository({ repositoryName: repositoryName, force: true });
    } catch (e: any) {
      if (e instanceof RepositoryNotFoundException) {
        console.log(`Repository ${repositoryName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }
  }

}