import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AllocationTimeoutFunction } from '../allocation-timeout/allocation-timeout-function';
import { CleanupTimeoutFunction } from '../cleanup-timeout/cleanup-timeout-function';
import * as envars from '../envars';
import { anchor as runBookAnchor } from '../runbook';
import { Allocations, Environments } from '../storage';

/**
 * Properties for `Scheduler`.
 */
export interface SchedulerProps {
  /**
   * Environments storage.
   */
  readonly environments: Environments;

  /**
   * Allocations storage.
   */
  readonly allocations: Allocations;
}

/**
 * Scheduler layer.
 */
export class Scheduler extends Construct {

  public readonly role: iam.Role;
  public readonly dlq: sqs.Queue;
  public readonly cleanupTimeoutFunction: lambda.Function;
  public readonly allocationTimeoutFunction: lambda.Function;

  public constructor(scope: Construct, id: string, props: SchedulerProps) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });

    this.dlq = new sqs.Queue(this, 'DLQ', { encryption: sqs.QueueEncryption.KMS_MANAGED });

    this.cleanupTimeoutFunction = new CleanupTimeoutFunction(this, 'CleanupTimeout', {
      deadLetterQueue: this.dlq,
      timeout: Duration.minutes(1),
    });

    this.cleanupTimeoutFunction.metricErrors().createAlarm(this.cleanupTimeoutFunction, 'Errors', {
      alarmName: `${this.cleanupTimeoutFunction.node.path}/Errors`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('TODO'),
    });

    this.allocationTimeoutFunction = new AllocationTimeoutFunction(this, 'AllocationTimeout', {
      deadLetterQueue: this.dlq,
      timeout: Duration.minutes(1),
    });

    this.cleanupTimeoutFunction.metricErrors().createAlarm(this.allocationTimeoutFunction, 'Errors', {
      alarmName: `${this.allocationTimeoutFunction.node.path}/Errors`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('TODO'),
    });

    // needed because the function changes environment status
    props.environments.grantReadWrite(this.cleanupTimeoutFunction);

    // needed because the function fetches the allocation from storage
    props.allocations.grantRead(this.cleanupTimeoutFunction);

    // needed because the function fetches the allocation from storage
    props.allocations.grantRead(this.allocationTimeoutFunction);

    this.cleanupTimeoutFunction.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    this.cleanupTimeoutFunction.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);
    this.allocationTimeoutFunction.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);

    this.cleanupTimeoutFunction.grantInvoke(this.role);
    this.allocationTimeoutFunction.grantInvoke(this.role);

    this.dlq.grantSendMessages(this.role);

    new cloudwatch.MathExpression({
      expression: 'mVisible + mHidden',
      usingMetrics: {
        mVisible: this.dlq.metricApproximateNumberOfMessagesVisible({ period: Duration.minutes(1) }),
        mHidden: this.dlq.metricApproximateNumberOfMessagesNotVisible({ period: Duration.minutes(1) }),
      },
    }).createAlarm(this, 'DLQ/NotEmpty', {
      alarmName: `${this.node.path}/DLQ/NotEmpty`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('TODO'),
    });


  }

  public grantSchedule(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    }));
  }

}