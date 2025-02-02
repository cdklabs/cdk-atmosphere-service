import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as envars from '../envars';
import { AllocationTimeoutFunction } from './allocation-timeout-function';
import { anchor as runBookAnchor } from '../runbook';
import { Allocations } from '../storage';
import { METRIC_DIMENSION_RESULT, METRIC_NAME } from './allocation-timeout.lambda';
import { METRIC_DIMENSION_POOL, METRICS_NAMESPACE } from '../metrics';

export interface AllocationTimeoutProps {
  readonly allocations: Allocations;
  readonly dlq: sqs.Queue;
}

export class AllocationTimeout extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: AllocationTimeoutProps) {
    super(scope, id);

    this.function = new AllocationTimeoutFunction(this, 'Function', {
      deadLetterQueue: props.dlq,
      timeout: Duration.minutes(1),
    });

    // needed because the function fetches the allocation from storage
    props.allocations.grantRead(this.function);

    this.function.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);

    this.function.metricErrors().createAlarm(this, 'Errors', {
      alarmName: `${this.node.path}/Errors`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('TODO'),
    });
  }

  public grantInvoke(grantee: iam.IGrantable) {
    this.function.grantInvoke(grantee);
  }

  public grantQueryLogs(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'logs:StartQuery',
        'logs:GetQueryResults',
      ],
      resources: [this.function.logGroup.logGroupArn],
    }));
  }

  public metricSuccess(pool: string) {
    return new cloudwatch.Metric({
      metricName: METRIC_NAME,
      dimensionsMap: {
        [METRIC_DIMENSION_POOL]: pool,
        [METRIC_DIMENSION_RESULT]: 'success',
      },
      namespace: METRICS_NAMESPACE,
      statistic: 'sum',
      period: Duration.minutes(5),
    });
  }

  public metricError(pool: string) {
    return new cloudwatch.Metric({
      metricName: METRIC_NAME,
      dimensionsMap: {
        [METRIC_DIMENSION_POOL]: pool,
        [METRIC_DIMENSION_RESULT]: 'error',
      },
      namespace: METRICS_NAMESPACE,
      statistic: 'sum',
      period: Duration.minutes(5),
    });
  }

}