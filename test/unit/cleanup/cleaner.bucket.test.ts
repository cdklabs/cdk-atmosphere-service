import { S3Client, S3, ListObjectVersionsCommandOutput, ListObjectVersionsCommand } from '@aws-sdk/client-s3';
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

      await expect(cleaner.empty({ bucketName: 'bucket', timeoutDate })).rejects.toThrow(`Operation timed out. Timeout date: ${timeoutDate.toISOString()}`);

    });

    test('returns when no versions and no delete markers exists', async () => {

      const cleaner = new BucketCleaner(new S3());
      const timeoutDate = new Date(Date.now() + 10 * 1000);

      s3Mock.on(ListObjectVersionsCommand).resolves({});

      await cleaner.empty({ bucketName: 'bucket', timeoutDate });

    });

  });
});