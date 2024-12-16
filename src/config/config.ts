import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { RegisteredEnvironment } from '../types';
import { RemovalPolicy } from 'aws-cdk-lib';

/**
 * Configuration Data.
 */
export interface ConfigurationData {

  /**
   * List of registered environments, configured by the service operator.
   */
  readonly environments: RegisteredEnvironment[];

}

/**
 * Properties of `Configuration`.
 */
export interface ConfigurationProps {

  /**
   * Data of the configuration file.
   */
  readonly data: ConfigurationData;
}

/**
 * Service configuration construct.
 *
 * Configuration data will be written to a JSON file and stored in a dedicated s3 bucket. 
 * Logical components that needs access should use the `grantRead` method and then
 * download the file whenever they need to.
 */
export class Configuration extends Construct {

  /**
   * S3 Object key of configuration file.
   */
  public readonly key = 'configuration.json';

  /**
   * S3 Bucket where the configuration file is stored.
   */
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: ConfigurationProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', { 
      // makes it easier in integ test cycles.
      // the bucket doesn't store state so its
      // ok to delete its data.
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new s3Deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3Deploy.Source.jsonData(this.key, props.data)],
      destinationBucket: this.bucket,
    });

  }

  /**
   * Allow the given identity to download the configuration file(s).
   */
  public grantRead(identity: iam.IGrantable) {
    this.bucket.grantRead(identity, this.key);
  }


}