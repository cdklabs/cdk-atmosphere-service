import { S3Client, S3, ListObjectVersionsCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { BucketCleaner } from '../../../src/cleanup/cleaner.bucket';

describe('BucketCleaner', () => {

  const s3Mock = mockClient(S3Client);
  jest.useFakeTimers();

  beforeEach(() => {
    s3Mock.reset();
  });

  describe('empty', () => {

    test('throws error if timeout expires', async () => {

      const cleaner = new BucketCleaner(new S3());
      const timeoutDate = new Date();

      jest.advanceTimersByTime(1000);

      await expect(cleaner.clean({ bucketName: 'bucket', timeoutDate })).rejects.toThrow(`Operation timed out. Timeout date: ${timeoutDate.toISOString()}`);

    });

    test('isTruncated defaults to false', async () => {

      const cleaner = new BucketCleaner(new S3());
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      s3Mock.on(ListObjectVersionsCommand)
        .resolvesOnce({
          Versions: [{ Key: 'key1', VersionId: 'v1' }],
          DeleteMarkers: [{ Key: 'key2', VersionId: 'v2' }],
        });

      await cleaner.clean({ bucketName: 'bucket', timeoutDate });

      expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1);
      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
        Bucket: 'bucket',
        Delete: {
          Objects: [{ Key: 'key1', VersionId: 'v1' }, { Key: 'key2', VersionId: 'v2' }],
          Quiet: true,
        },
      });

    });

    test('keeps going until no versions and no delete markers', async () => {

      const cleaner = new BucketCleaner(new S3());
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      s3Mock.on(ListObjectVersionsCommand)
        .resolvesOnce({
          Versions: [{ Key: 'key1', VersionId: 'v1' }],
          DeleteMarkers: [{ Key: 'key2', VersionId: 'v2' }],
          IsTruncated: true,
        })
        .resolvesOnce({});

      await cleaner.clean({ bucketName: 'bucket', timeoutDate });

      expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 2);
      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
        Bucket: 'bucket',
        Delete: {
          Objects: [{ Key: 'key1', VersionId: 'v1' }, { Key: 'key2', VersionId: 'v2' }],
          Quiet: true,
        },
      });

    });

    test('returns when no versions and no delete markers exists', async () => {

      const cleaner = new BucketCleaner(new S3());
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      s3Mock.on(ListObjectVersionsCommand).resolves({});

      await cleaner.clean({ bucketName: 'bucket', timeoutDate });

    });

  });
});