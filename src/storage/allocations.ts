import { RemovalPolicy } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { AllocationsMonitor } from './allocations.monitor';
import { METRIC_NAME_ALLOCATIONS_FAILURE, METRIC_NAME_ALLOCATIONS_IN_PROGRESS, METRIC_NAME_ALLOCATIONS_SUCCESS, METRIC_NAME_ALLOCATIONS_TIMEOUT } from './allocations.monitor.lambda';
import { METRIC_DIMENSION_POOL, METRICS_NAMESPACE } from '../metrics';

/**
 * Allocations table.
 */
export class Allocations extends Construct {

  public readonly table: dynamodb.Table;

  public readonly monitor: AllocationsMonitor;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'ttl',
    });

    this.monitor = new AllocationsMonitor(this, 'Monitor', {
      allocations: this,
    });

    // According to the design doc, secondary indexes are not needed
    // because table scans are not performed and updates always use the primary key
  }

  public grantReadWrite(identity: iam.IGrantable) {
    this.table.grantReadWriteData(identity);
  }

  public grantRead(identity: iam.IGrantable) {
    this.table.grantReadData(identity);
  }

  public metricInProgress(pool: string) {
    return this.metric(pool, METRIC_NAME_ALLOCATIONS_IN_PROGRESS);
  }

  public metricSuccess(pool: string) {
    return this.metric(pool, METRIC_NAME_ALLOCATIONS_SUCCESS);
  }

  public metricFailure(pool: string) {
    return this.metric(pool, METRIC_NAME_ALLOCATIONS_FAILURE);
  }

  public metricTimeout(pool: string) {
    return this.metric(pool, METRIC_NAME_ALLOCATIONS_TIMEOUT);
  }

  private metric(pool: string, name: string) {
    return new cloudwatch.Metric({
      metricName: name,
      dimensionsMap: {
        [METRIC_DIMENSION_POOL]: pool,
      },
      namespace: METRICS_NAMESPACE,
      statistic: cloudwatch.Stats.AVERAGE,
      period: this.monitor.period,
    });
  }

}