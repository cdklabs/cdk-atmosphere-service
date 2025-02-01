import { Duration } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { Allocations } from '.';
import * as envars from '../envars';
import { AllocationsMonitorFunction } from './allocations.monitor-function';

export interface AllocationsMonitorProps {
  readonly allocations: Allocations;
}

export class AllocationsMonitor extends Construct {

  public readonly period = Duration.minutes(5);

  constructor(scope: Construct, id: string, props: AllocationsMonitorProps) {
    super(scope, id);

    const func = new AllocationsMonitorFunction(this, 'Function', {
      reservedConcurrentExecutions: 1,
      timeout: Duration.minutes(5),
      description: 'Emits metrics about allocations status for every pool',
    });

    props.allocations.grantRead(func);

    func.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);

    new events.Rule(this, 'Schedule', {
      description: `Periodically runs the allocations monitor function (${func.node.path})`,
      enabled: true,
      schedule: events.Schedule.rate(this.period),
      targets: [new targets.LambdaFunction(func)],
    });

  }

}