// eslint-disable-next-line import/no-extraneous-dependencies
import { DeleteObjectsCommand, ListObjectVersionsCommandOutput, S3 } from '@aws-sdk/client-s3';

/**
 * Options for `empty`.
 */
export interface EmptyOptions {
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

  public async clean(opts: EmptyOptions): Promise<void> {
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
}
