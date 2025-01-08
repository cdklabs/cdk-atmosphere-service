import { CloudFormationClient, DeleteStackCommand, DescribeStackResourcesCommand, DescribeStacksCommand, UpdateTerminationProtectionCommand } from '@aws-sdk/client-cloudformation';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { Cleaner, CleanerError } from '../../../src/cleanup/cleaner';
import 'aws-sdk-client-mock-jest';


describe('Cleaner', () => {

  const s3Mock = mockClient(S3Client);
  const cfnMock = mockClient(CloudFormationClient);
  jest.useFakeTimers();

  beforeEach(() => {
    s3Mock.reset();
    cfnMock.reset();
  });

  describe('clean', () => {

    test('does nothing if there are no stacks', async () => {

      cfnMock.on(DescribeStacksCommand).resolves({ Stacks: [] });
      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
      await cleaner.clean(10);

    });

    test('does nothing if stacks is not returned', async () => {

      cfnMock.on(DescribeStacksCommand).resolves({});
      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
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

      const mockBucketClean = jest.fn();

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
      (cleaner as any).bucketCleaner.clean = mockBucketClean;

      await cleaner.clean(10);

      expect(mockBucketClean).toHaveBeenCalledWith({
        bucketName: 'bucketName',
        timeoutDate: new Date(Date.now() + 10 * 1000),
      });

    });

    test('disables termination protection', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(DescribeStackResourcesCommand).resolves({});

      const mockBucketClean = jest.fn();

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
      (cleaner as any).bucketCleaner.clean = mockBucketClean;

      await cleaner.clean(10);

      expect(cfnMock).toHaveReceivedCommandWith(UpdateTerminationProtectionCommand, {
        EnableTerminationProtection: false,
        StackName: 'stack',
      });

    });

    test('only waits for stacks in DELETE_IN_PROGRESS', async () => {

      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_IN_PROGRESS', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(DescribeStackResourcesCommand).resolves({ StackResources: [] });

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
      await cleaner.clean(10);

      expect(cfnMock).toHaveReceivedCommandTimes(DeleteStackCommand, 0);

    });

    test('throws if any stack failed to delete', async () => {

      const error = new Error('Cannot do it');
      cfnMock.on(DescribeStacksCommand)
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() }] })
        .resolvesOnce({ Stacks: [{ StackName: 'stack', StackStatus: 'DELETE_COMPLETE', CreationTime: new Date() }] });
      cfnMock.on(DescribeStackResourcesCommand).resolves({ StackResources: [] });
      cfnMock.on(UpdateTerminationProtectionCommand).rejects(new Error('Cannot do it'));

      const cleaner = new Cleaner({ account: '1111', region: 'us-east-1', adminRoleArn: 'adminRole', pool: 'release' });
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