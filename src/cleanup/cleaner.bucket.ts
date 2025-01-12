// eslint-disable-next-line import/no-extraneous-dependencies
import { DeleteObjectsCommand, ListObjectVersionsCommandOutput, NoSuchBucket, S3, waitUntilBucketNotExists } from '@aws-sdk/client-s3';

/**
 * Options for `clean`.
 */
export interface CleanOptions {
  /**
   * Bucket name.
   */
  readonly bucketName: string;
  /**
   * Timeout date after which the operation should fail.
   */
  readonly timeoutDate: Date;
}

/**
 * Options for `delete`.
 */
export interface DeleteOptions {
  /**
   * Bucket name.
   */
  readonly bucketName: string;

  /**
   * Timeout date after which the operation should fail.
   */
  readonly timeoutDate: Date;
}

export class BucketCleaner {

  constructor(private readonly s3: S3) {}

  public async clean(opts: CleanOptions): Promise<void> {
    let isTruncated = true;
    let keyMarker: string | undefined = undefined;
    let versionIdMarker: string | undefined = undefined;

    const checkTimeout = () => {
      if (Date.now() > opts.timeoutDate.getTime()) {
        throw new Error(`Operation timed out. Timeout date: ${opts.timeoutDate.toISOString()}`);
      }
    };

    console.log(`Starting to clean bucket: ${opts.bucketName}`);

    while (isTruncated) {

      checkTimeout();

      const response: ListObjectVersionsCommandOutput = await this.s3.listObjectVersions({
        Bucket: opts.bucketName,
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
        console.log('Bucket is already empty.');
        break;
      }

      if (objectsToDelete.length > 0) {
        await this.s3.send(new DeleteObjectsCommand({
          Bucket: opts.bucketName,
          Delete: {
            Objects: objectsToDelete,
            Quiet: true,
          },
        }));
        console.log(`Deleted ${objectsToDelete.length} objects.`);
      }

      isTruncated = response.IsTruncated ?? false;
      keyMarker = response.NextKeyMarker;
      versionIdMarker = response.NextVersionIdMarker;
    }

    console.log(`Bucket ${opts.bucketName} has been emptied.`);
  }

  public async delete(opts: DeleteOptions) {

    console.log(`Deleting bucket: ${opts.bucketName}`);

    try {
      await this.s3.deleteBucket({ Bucket: opts.bucketName });
    } catch (e: any) {
      if (e instanceof NoSuchBucket) {
        console.log(`Bucket ${opts.bucketName} does not exist. Skipping.`);
        return;
      }
      throw e;
    }

    const maxWaitSeconds = (opts.timeoutDate.getTime() - Date.now()) / 1000;

    console.log(`Bucket ${opts.bucketName} deleting. Waiting ${maxWaitSeconds} seconds for completion`);
    await waitUntilBucketNotExists(
      { client: this.s3, maxWaitTime: maxWaitSeconds, minDelay: 5, maxDelay: 5 },
      { Bucket: opts.bucketName },
    );
  }
}
