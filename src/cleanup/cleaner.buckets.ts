// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormation, Stack } from '@aws-sdk/client-cloudformation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeleteObjectsCommand, ListObjectVersionsCommandOutput, NoSuchBucket, S3, waitUntilBucketNotExists } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsCredentialIdentityProvider } from '@smithy/types';
import { Logger } from '../logging';

/**
 * Options for `clean`.
 */
export interface CleanOptions {
  /**
   * Timeout date after which the operation should fail.
   */
  readonly timeoutDate: Date;
}

export class BucketsCleaner {

  private readonly cfn: CloudFormation;
  private readonly s3: S3;

  public constructor(
    credentials: AwsCredentialIdentityProvider,
    region: string,
    private readonly stack: Stack,
    private readonly log: Logger) {
    this.cfn = new CloudFormation({ credentials: credentials, region });
    this.s3 = new S3({ credentials: credentials, region });
  }

  public async clean(opts: CleanOptions): Promise<void> {

    // first collect all buckets in the stack
    const buckets = await this.listBuckets();

    // then empty them
    const emptyBuckets = buckets.map(b => this.emptyBucket(b, opts.timeoutDate));
    await Promise.all(emptyBuckets);

    // then delete then
    const deleteBuckets = buckets.map(b => this.deleteBucket(b, opts.timeoutDate));
    await Promise.all(deleteBuckets);

  }

  private async listBuckets(): Promise<string[]> {
    this.log.info(`Collecting buckets in stack ${this.stack.StackName}`);
    const resources = await this.cfn.describeStackResources({ StackName: this.stack.StackName });
    return (resources.StackResources ?? [])
      .filter(r => r.ResourceType === 'AWS::S3::Bucket').map(r => r.PhysicalResourceId!);
  }

  private async emptyBucket(bucketName: string, timeoutDate: Date) {

    try {

      let isTruncated = true;
      let keyMarker: string | undefined = undefined;
      let versionIdMarker: string | undefined = undefined;

      const checkTimeout = () => {
        if (Date.now() > timeoutDate.getTime()) {
          throw new Error(`Operation timed out. Timeout date: ${timeoutDate.toISOString()}`);
        }
      };

      this.log.info(`Starting to clean bucket: ${bucketName}`);

      while (isTruncated) {

        checkTimeout();

        const response: ListObjectVersionsCommandOutput = await this.s3.listObjectVersions({
          Bucket: bucketName,
          KeyMarker: keyMarker,
          VersionIdMarker: versionIdMarker,
        });

        const versions = response.Versions ?? [];
        const deleteMarkers = response.DeleteMarkers ?? [];

        const objectsToDelete = [
          ...versions.map((version) => ({
            Key: version.Key!,
            VersionId: version.VersionId,
          })),
          ...deleteMarkers.map((marker) => ({
            Key: marker.Key!,
            VersionId: marker.VersionId,
          })),
        ];

        if (objectsToDelete.length === 0) {
          this.log.info('Bucket is already empty.');
          break;
        }

        if (objectsToDelete.length > 0) {
          await this.s3.send(new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
              Objects: objectsToDelete,
              Quiet: true,
            },
          }));
          this.log.info(`Deleted ${objectsToDelete.length} objects.`);
        }

        isTruncated = response.IsTruncated ?? false;
        keyMarker = response.NextKeyMarker;
        versionIdMarker = response.NextVersionIdMarker;
      }

      this.log.info(`Bucket ${bucketName} has been emptied.`);

    } catch (e: any) {
      if (e instanceof NoSuchBucket) {
        // can happen because cleanup may execute when the stack is already deleting
        this.log.info(`Bucket ${bucketName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }

  }

  private async deleteBucket(bucketName: string, timeoutDate: Date) {

    this.log.info(`Deleting bucket: ${bucketName}`);

    try {
      await this.s3.deleteBucket({ Bucket: bucketName });
    } catch (e: any) {
      if (e instanceof NoSuchBucket) {
        this.log.info(`Bucket ${bucketName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }

    const maxWaitSeconds = (timeoutDate.getTime() - Date.now()) / 1000;

    this.log.info(`Bucket ${bucketName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
    await waitUntilBucketNotExists(
      { client: this.s3, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
      { Bucket: bucketName },
    );

  }

}
