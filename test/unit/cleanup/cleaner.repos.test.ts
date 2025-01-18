import { CloudFormationClient, DescribeStackResourcesCommand } from '@aws-sdk/client-cloudformation';
import { DeleteRepositoryCommand, ECRClient, RepositoryNotFoundException } from '@aws-sdk/client-ecr';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { mockClient } from 'aws-sdk-client-mock';
import { ReposCleaner } from '../../../src/cleanup/cleaner.repos';
import 'aws-sdk-client-mock-jest';

describe('ReposCleaner', () => {

  const ecrMock = mockClient(ECRClient);
  const cfnMock = mockClient(CloudFormationClient);

  beforeEach(() => {
    ecrMock.reset();
    cfnMock.reset();
  });

  describe('clean', () => {

    test('delete a repo', async () => {

      const cleaner = new ReposCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' });

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::ECR::Repository',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'repoName',
        }],
      });

      await cleaner.clean();

      expect(ecrMock).toHaveReceivedCommandWith(DeleteRepositoryCommand, {
        repositoryName: 'repoName',
        force: true,
      });

    });

    test('survives a disappearing repo', async () => {

      const cleaner = new ReposCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' });

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::ECR::Repository',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'repoName',
        }],
      });

      ecrMock.on(DeleteRepositoryCommand).rejects(new RepositoryNotFoundException({ message: 'Not found', $metadata: {} }));

      await cleaner.clean();

    });

    test('rethrows on unexpected error when deleting the repo', async () => {

      const cleaner = new ReposCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' });

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::ECR::Repository',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'repoName',
        }],
      });

      ecrMock.on(DeleteRepositoryCommand).rejects(new Error('unexpected'));

      await expect(cleaner.clean()).rejects.toThrow('unexpected');

    });

  });

});