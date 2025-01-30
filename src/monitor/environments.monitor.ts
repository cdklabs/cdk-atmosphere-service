import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import * as envars from '../envars';
import { METRIC_NAME_ENVIRONMENTS_CLEANING, METRIC_NAME_ENVIRONMENTS_DIRTY, METRIC_NAME_ENVIRONMENTS_FREE, METRIC_NAME_ENVIRONMENTS_IN_USE, METRIC_NAME_ENVIRONMENTS_REGISTERED } from './environments.monitor.lambda';
import { METRIC_DIMENSION_POOL, METRICS_NAMESPACE } from '../metrics';
import { EnvironmentsMonitorFunction } from './environments.monitor-function';
import { Configuration } from '../config';
import { Environments } from '../storage';

export interface EnvironmentsMonitorProps {
  readonly configuration: Configuration;
  readonly environments: Environments;
}

export class EnvironmentsMonitor extends Construct {

  private readonly period = Duration.minutes(5);

  constructor(scope: Construct, id: string, props: EnvironmentsMonitorProps) {
    super(scope, id);

    const func = new EnvironmentsMonitorFunction(this, 'Function', {
      reservedConcurrentExecutions: 1,
      timeout: Duration.minutes(5),
      description: 'Emits metrics about environments status for every pool',
    });

    props.configuration.grantRead(func);
    props.environments.grantRead(func);

    func.addEnvironment(envars.CONFIGURATION_BUCKET_ENV, props.configuration.bucket.bucketName);
    func.addEnvironment(envars.CONFIGURATION_KEY_ENV, props.configuration.key);
    func.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);

    new events.Rule(this, 'Schedule', {
      description: `Periodically runs the environments monitor function (${func.node.path})`,
      enabled: true,
      schedule: events.Schedule.rate(this.period),
      targets: [new targets.LambdaFunction(func)],
    });

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
      period: this.period,
    });
  }

}