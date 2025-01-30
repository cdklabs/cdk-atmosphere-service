import { Duration } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { Environments } from '.';
import * as envars from '../envars';
import { EnvironmentsMonitorFunction } from './environments.monitor-function';
import { Configuration } from '../config';

export interface EnvironmentsMonitorProps {
  readonly configuration: Configuration;
  readonly environments: Environments;
}

export class EnvironmentsMonitor extends Construct {

  public readonly period = Duration.minutes(5);

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

}