import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Cleanup } from './cleanup';
import { Configuration } from './config';
import { Deallocate } from './deallocate';
import { UNKNOWN_POOL } from './metrics';
import { Monitor } from './monitor';
import { Scheduler } from './scheduler';

const RUNBOOK_URL = 'https://github.com/cdklabs/cdk-atmosphere-service/blob/main/docs/operator-runbook.md';

export interface AlarmsProps {
  readonly configuration: Configuration;
  readonly cleanup: Cleanup;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly monitor: Monitor;
  readonly scheduler: Scheduler;
}

export class Alarms extends Construct {

  public readonly alarms: cloudwatch.Alarm[] = [];

  constructor(scope: Construct, id: string, props: AlarmsProps) {
    super(scope, id);

    this.alarms.push(
      props.allocate.function
        .metricErrors()
        .createAlarm(scope, 'Allocate/UnexpectedFailure', {
          alarmName: `${scope.node.path}/Allocate/UnexpectedFailure`,
          threshold: 1,
          evaluationPeriods: 1,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: runBookAnchor('atmosphereallocateunexpectedfailure'),
        }),
    );

    this.alarms.push(
      props.deallocate.function
        .metricErrors()
        .createAlarm(scope, 'Deallocate/UnexpectedFailure', {
          alarmName: `${scope.node.path}/Deallocate/UnexpectedFailure`,
          threshold: 1,
          evaluationPeriods: 1,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: runBookAnchor('atmospheredeallocateunexpectedfailure'),
        }),
    );

    new cloudwatch.MathExpression({
      expression: 'mVisible + mHidden',
      usingMetrics: {
        mVisible: props.scheduler.dlq.metricApproximateNumberOfMessagesVisible({ period: Duration.minutes(1) }),
        mHidden: props.scheduler.dlq.metricApproximateNumberOfMessagesNotVisible({ period: Duration.minutes(1) }),
      },
    }).createAlarm(this, 'Scheduler/DLQ/NotEmpty', {
      alarmName: `${scope.node.path}/Deallocate/UnexpectedFailure`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('atmospheredeallocateunexpectedfailure'),
    });

    const pools = new Set(props.configuration.data.environments.map(e => e.pool));
    pools.add(UNKNOWN_POOL);

    for (const pool of pools) {

      this.alarms.push(
        props.allocate
          .metricStatusCode(pool, 500)
          .createAlarm(this, `Allocate/${pool}/StatusCode/500`, {
            alarmName: `${scope.node.path}/Allocate/${pool}/StatusCode/500`,
            threshold: 1,
            evaluationPeriods: 1,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: runBookAnchor('atmosphereallocatepoolstatuscode500'),
          }),
      );

      this.alarms.push(
        props.deallocate
          .metricStatusCode(pool, 500)
          .createAlarm(this, `Deallocate/${pool}/StatusCode/500`, {
            alarmName: `${scope.node.path}/Deallocate/${pool}/StatusCode/500`,
            threshold: 1,
            evaluationPeriods: 1,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: runBookAnchor('atmospheredeallocatepoolstatuscode500'),
          }),
      );

      this.alarms.push(
        props.cleanup
          .metricExitCode(pool, 1)
          .createAlarm(this, `Cleanup/${pool}/ExitCode/1`, {
            alarmName: `${scope.node.path}/Cleanup/${pool}/ExitCode/1`,
            threshold: 1,
            evaluationPeriods: 1,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: runBookAnchor('atmospherecleanuppoolexitcode1'),
          }));

      this.alarms.push(
        props.monitor.environments
          .metricDirty(pool)
          .createAlarm(this, `Environments/${pool}/Dirty`, {
            alarmName: `${scope.node.path}/Environments/${pool}/Dirty`,
            threshold: 1,
            evaluationPeriods: 1,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: runBookAnchor('atmosphereenvironmentspooldirty'),
          }));

    }

  }

}

function runBookAnchor(heading: string) {
  return `${RUNBOOK_URL}#${heading}`;
}
