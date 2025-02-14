import { CloudFormationClient, DeleteStackCommand, DescribeStackResourcesCommand, DescribeStacksCommand, UpdateTerminationProtectionCommand } from '@aws-sdk/client-cloudformation';
import { ECRClient } from '@aws-sdk/client-ecr';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { Cleaner, CleanerError } from '../../../src/cleanup/cleaner';
import 'aws-sdk-client-mock-jest';
import { BucketsCleaner } from '../../../src/cleanup/cleaner.buckets';
import { ReposCleaner } from '../../../src/cleanup/cleaner.repos';
import { Logger } from '../../../src/logging';


describe('Cleaner', () => {

  const s3Mock = mockClient(S3Client);
  const ecrMock = mockClient(ECRClient);
  const cfnMock = mockClient(CloudFormationClient);
  const logger = new Logger({ allocationId: 'id', component: 'cleanup', pool: 'pool' });
  jest.useFakeTimers();

  beforeEach(() => {
    s3Mock.reset();
    ecrMock.reset();
    cfnMock.reset();
    jest.clearAllMocks();
  });

  describe('clean', () => {

    test('does nothing if there are no stacks', async () => {

      cfnMock.on(DescribeStacksCommand).resolves({ Stacks: [] });
      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

    });

    test('does nothing if stacks is not returned', async () => {

      cfnMock.on(DescribeStacksCommand).resolves({});
      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

    });

    test('cleans stack buckets before trying to delete it', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      const mockBucketsClean = jest.fn();

      jest.spyOn(BucketsCleaner.prototype, 'clean').mockImplementation(mockBucketsClean);

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

      expect(mockBucketsClean).toHaveBeenCalledWith({ timeoutDate: new Date(Date.now() + 10000) });

    });

    test('cleans stack ecr repositories before trying to delete it', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::ECR::Repository',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'repoName',
        }],
      });

      const mockReposClean = jest.fn();

      jest.spyOn(ReposCleaner.prototype, 'clean').mockImplementation(mockReposClean);

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

      expect(mockReposClean).toHaveBeenCalledWith();

    });

    test('disables termination protection and deletes a stack if not in DELETE_IN_PROGRESS', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });

      jest.spyOn(BucketsCleaner.prototype, 'clean').mockImplementation(jest.fn());
      jest.spyOn(ReposCleaner.prototype, 'clean').mockImplementation(jest.fn());

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

      expect(cfnMock).toHaveReceivedCommandWith(UpdateTerminationProtectionCommand, {
        EnableTerminationProtection: false,
        StackName: 'stack',
      });
      expect(cfnMock).toHaveReceivedCommandWith(DeleteStackCommand, {
        StackName: 'stack',
        RoleARN: 'adminRole',
      });

    });

    test('just waits for stacks in DELETE_IN_PROGRESS', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_IN_PROGRESS', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });

      jest.spyOn(BucketsCleaner.prototype, 'clean').mockImplementation(jest.fn());
      jest.spyOn(ReposCleaner.prototype, 'clean').mockImplementation(jest.fn());

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

      expect(cfnMock).toHaveReceivedCommandTimes(DeleteStackCommand, 0);

    });

    test('doest not delete nested stacks', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date(), ParentId: 'parent' }] });

      jest.spyOn(BucketsCleaner.prototype, 'clean').mockImplementation(jest.fn());
      jest.spyOn(ReposCleaner.prototype, 'clean').mockImplementation(jest.fn());

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      await cleaner.clean(10);

      expect(cfnMock).toHaveReceivedCommandTimes(DeleteStackCommand, 0);

    });

    test('throws if any stack failed to delete', async () => {

      const error = new Error('Cannot do it');
      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(UpdateTerminationProtectionCommand).rejects(new Error('Cannot do it'));

      jest.spyOn(BucketsCleaner.prototype, 'clean').mockImplementation(jest.fn());
      jest.spyOn(ReposCleaner.prototype, 'clean').mockImplementation(jest.fn());

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', roleArn: 'adminRole', pool: 'release' }, logger);
      try {
        await cleaner.clean(10);
      } catch (e: any) {
        if (e instanceof CleanerError) {
          expect(e.failedStacks).toEqual([{ name: 'stack', error }]);
        } else {
          throw e;
        }
      }

    });

  });
});