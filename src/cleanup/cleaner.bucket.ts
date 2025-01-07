// eslint-disable-next-line import/no-extraneous-dependencies
import { DeleteObjectsCommand, DeleteObjectsCommandInput, ListObjectVersionsCommandOutput, S3 } from '@aws-sdk/client-s3';

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

  public async empty(opts: EmptyOptions): Promise<void> {
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

      if (!response.Versions && !response.DeleteMarkers) {
        console.log('Bucket is already empty.');
        break;
      }

      const objectsToDelete = [
        ...(response.Versions || []).map((version) => ({
          Key: version.Key!,
          VersionId: version.VersionId,
        })),
        ...(response.DeleteMarkers || []).map((marker) => ({
          Key: marker.Key!,
          VersionId: marker.VersionId,
        })),
      ];

      if (objectsToDelete.length > 0) {
        const deleteCommand: DeleteObjectsCommandInput = {
          Bucket: opts.bucketName,
          Delete: {
            Objects: objectsToDelete,
            Quiet: true,
          },
        };

        await this.s3.send(new DeleteObjectsCommand(deleteCommand));
        console.log(`Deleted ${objectsToDelete.length} objects.`);
      }

      isTruncated = response.IsTruncated || false;
      keyMarker = response.NextKeyMarker;
      versionIdMarker = response.NextVersionIdMarker;
    }

    console.log(`Bucket ${opts.bucketName} has been emptied.`);
  }
}
