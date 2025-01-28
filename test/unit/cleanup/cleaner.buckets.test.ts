import { CloudFormationClient, DescribeStackResourcesCommand } from '@aws-sdk/client-cloudformation';
import { DeleteBucketCommand, DeleteObjectsCommand, HeadBucketCommand, ListObjectVersionsCommand, NoSuchBucket, S3Client } from '@aws-sdk/client-s3';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { BucketsCleaner } from '../../../src/cleanup/cleaner.buckets';
import { AllocationLogger } from '../../../src/logging';

describe('BucketCleaner', () => {

  const s3Mock = mockClient(S3Client);
  const cfnMock = mockClient(CloudFormationClient);
  jest.useFakeTimers();

  beforeEach(() => {
    s3Mock.reset();
    cfnMock.reset();
  });

  describe('clean', () => {

    test('throws error if timeout expires', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date();

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      jest.advanceTimersByTime(1000);

      await expect(cleaner.clean({ timeoutDate })).rejects.toThrow(`Operation timed out. Timeout date: ${timeoutDate.toISOString()}`);

    });

    test('empties a bucket', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand)
        .resolvesOnce({
          Versions: [{ Key: 'key1', VersionId: 'v1' }],
          DeleteMarkers: [{ Key: 'key2', VersionId: 'v2' }],
        });

      s3Mock.on(DeleteBucketCommand).rejects(new NoSuchBucket({ message: 'No buck', $metadata: {} }));

      await cleaner.clean({ timeoutDate });

      expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1);
      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
        Bucket: 'bucketName',
        Delete: {
          Objects: [{ Key: 'key1', VersionId: 'v1' }, { Key: 'key2', VersionId: 'v2' }],
          Quiet: true,
        },
      });
    });

    test('empties all versions and delete markers', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand)
        .resolvesOnce({
          Versions: [{ Key: 'key1', VersionId: 'v1' }],
          DeleteMarkers: [{ Key: 'key2', VersionId: 'v2' }],
          IsTruncated: true,
        })
        .resolvesOnce({
          Versions: [{ Key: 'key3', VersionId: 'v3' }],
          DeleteMarkers: [{ Key: 'key4', VersionId: 'v4' }],
          IsTruncated: true,
        })
        .resolvesOnce({});

      s3Mock.on(DeleteBucketCommand).rejects(new NoSuchBucket({ message: 'No buck', $metadata: {} }));

      await cleaner.clean({ timeoutDate });

      expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 3);
      expect(s3Mock).toHaveReceivedCommandTimes(DeleteObjectsCommand, 2);
      expect(s3Mock).toHaveReceivedNthCommandWith(2, DeleteObjectsCommand, {
        Bucket: 'bucketName',
        Delete: {
          Objects: [{ Key: 'key1', VersionId: 'v1' }, { Key: 'key2', VersionId: 'v2' }],
          Quiet: true,
        },
      });
      expect(s3Mock).toHaveReceivedNthCommandWith(4, DeleteObjectsCommand, {
        Bucket: 'bucketName',
        Delete: {
          Objects: [{ Key: 'key3', VersionId: 'v3' }, { Key: 'key4', VersionId: 'v4' }],
          Quiet: true,
        },
      });

    });

    test('can survive a disappearing bucket while emptying objects', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand).rejects(new NoSuchBucket({ message: 'No buck', $metadata: {} }));
      s3Mock.on(DeleteBucketCommand).rejects(new NoSuchBucket({ message: 'No buck', $metadata: {} }));

      await cleaner.clean({ timeoutDate });

    });

    test('rethrows when an unexpected error happens while emptying objects', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand).rejects(new Error('unexpected'));

      await expect(cleaner.clean({ timeoutDate })).rejects.toThrow('unexpected');

    });

    test('deletes the bucket', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand).resolves({});
      // see https://github.com/aws/aws-sdk-js-v3/blob/main/clients/client-s3/src/waiters/waitForBucketNotExists.ts#L14
      const headError = new Error();
      headError.name = 'NotFound';
      s3Mock.on(HeadBucketCommand).rejects(headError);

      await cleaner.clean({ timeoutDate });

      expect(s3Mock).toHaveReceivedCommandWith(DeleteBucketCommand, { Bucket: 'bucketName' });
      expect(s3Mock).toHaveReceivedCommandTimes(HeadBucketCommand, 1);

    });

    test('rethrowes when an unexpected error happens while deleting the bucket', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand).resolves({});
      s3Mock.on(DeleteBucketCommand).rejects(new Error('unexpected'));

      await expect(cleaner.clean({ timeoutDate })).rejects.toThrow('unexpected');

    });

    test('can survive a disappearing bucket while deleting the bucket', async () => {

      const cleaner = new BucketsCleaner(fromTemporaryCredentials({
        params: {
          RoleArn: 'adminRole',
          RoleSessionName: 'session',
        },
      }), 'us-east-1', { StackName: 'stack', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }, new AllocationLogger({ id: 'id', component: 'cleanup' }));
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      cfnMock.on(DescribeStackResourcesCommand).resolves({
        StackResources: [{
          ResourceType: 'AWS::S3::Bucket',
          LogicalResourceId: 'Logical',
          Timestamp: new Date(),
          ResourceStatus: 'CREATE_COMPLETE',
          PhysicalResourceId: 'bucketName',
        }],
      });

      s3Mock.on(ListObjectVersionsCommand).resolves({});
      s3Mock.on(DeleteBucketCommand).rejects(new NoSuchBucket({ message: 'No buck', $metadata: {} }));

      await cleaner.clean({ timeoutDate });

    });

  });
});