import { RemovalPolicy } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { EnvironmentsMonitor } from './environments.monitor';
import { Configuration } from '../config';
import { anchor as runBookAnchor } from '../runbook';
import { METRIC_NAME_ENVIRONMENTS_CLEANING, METRIC_NAME_ENVIRONMENTS_DIRTY, METRIC_NAME_ENVIRONMENTS_FREE, METRIC_NAME_ENVIRONMENTS_IN_USE, METRIC_NAME_ENVIRONMENTS_REGISTERED } from './environments.monitor.lambda';
import { METRIC_DIMENSION_POOL, METRICS_NAMESPACE, UNKNOWN_POOL } from '../metrics';

export interface EnvironmentsProps {
  readonly config: Configuration;
}

/**
 * Environments table.
 */
export class Environments extends Construct {

  public readonly table: dynamodb.Table;

  public readonly monitor: EnvironmentsMonitor;

  constructor(scope: Construct, id: string, props: EnvironmentsProps) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'account', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'region', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // According to the design doc, no secondary indexes are needed
    // because all access is done using the primary key (account + region)

    this.monitor = new EnvironmentsMonitor(this, 'Monitor', {
      configuration: props.config,
      environments: this,
    });

    const pools = new Set(props.config.data.environments.map(e => e.pool));
    pools.add(UNKNOWN_POOL);

    for (const pool of pools) {
      this.metricDirty(pool).createAlarm(this, `Pool/${pool}/Status/Dirty`, {
        alarmName: `${this.node.path}/Pool/${pool}/Status/Dirty`,
        threshold: 1,
        evaluationPeriods: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmDescription: runBookAnchor('TODO'),
      });
    }
  }

  public grantReadWrite(identity: iam.IGrantable) {
    this.table.grantReadWriteData(identity);
  }

  public grantRead(identity: iam.IGrantable) {
    this.table.grantReadData(identity);
  }

  public metricRegistered(pool: string) {
    return this.metric(pool, METRIC_NAME_ENVIRONMENTS_REGISTERED);
  }

  public metricFree(pool: string) {
    return this.metric(pool, METRIC_NAME_ENVIRONMENTS_FREE);
  }

  public metricInUse(pool: string) {
    return this.metric(pool, METRIC_NAME_ENVIRONMENTS_IN_USE);
  }

  public metricCleaning(pool: string) {
    return this.metric(pool, METRIC_NAME_ENVIRONMENTS_CLEANING);
  }

  public metricDirty(pool: string) {
    return this.metric(pool, METRIC_NAME_ENVIRONMENTS_DIRTY);
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