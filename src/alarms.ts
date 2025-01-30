import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Cleanup } from './cleanup';
import { Configuration } from './config';
import { UNKNOWN_POOL } from './metrics';

const RUNBOOK_URL = 'https://github.com/cdklabs/cdk-atmosphere-service/blob/main/docs/operator-runbook.md';

export interface AlarmsProps {
  readonly configuration: Configuration;
  readonly cleanup: Cleanup;
  readonly allocate: Allocate;
}

export class Alarms extends Construct {

  public readonly alarms: cloudwatch.Alarm[] = [];

  constructor(scope: Construct, id: string, props: AlarmsProps) {
    super(scope, id);

    // global alarms
    this.alarms.push(
      props.allocate.function
        .metricErrors()
        .createAlarm(scope, 'Allocate/UnexpectedFailure', {
          alarmName: `${scope.node.path}/Allocate/UnexpectedFailure`,
          threshold: 1,
          evaluationPeriods: 1,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: `${RUNBOOK_URL}#atmosphereallocateunexpectedfailure`,
        }),
    );

    // per pool alarms

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
            alarmDescription: `${RUNBOOK_URL}#atmosphereallocatepoolstatuscode500`,
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
            alarmDescription: `${RUNBOOK_URL}#atmosphereallocatepoolstatuscode500`,
          }));

    }

  }

}
