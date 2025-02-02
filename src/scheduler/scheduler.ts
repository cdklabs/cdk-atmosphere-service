import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AllocationTimeout } from '../allocation-timeout';
import { CleanupTimeout } from '../cleanup-timeout';
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
  public readonly cleanupTimeout: CleanupTimeout;
  public readonly allocationTimeout: AllocationTimeout;

  public constructor(scope: Construct, id: string, props: SchedulerProps) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });

    this.dlq = new sqs.Queue(this, 'DLQ', { encryption: sqs.QueueEncryption.KMS_MANAGED });

    this.cleanupTimeout = new CleanupTimeout(this, 'CleanupTimeout', {
      dlq: this.dlq,
      allocations: props.allocations,
      environments: props.environments,
    });

    this.allocationTimeout = new AllocationTimeout(this, 'AllocationTimeout', {
      dlq: this.dlq,
      allocations: props.allocations,
    });

    this.cleanupTimeout.function.grantInvoke(this.role);
    this.allocationTimeout.function.grantInvoke(this.role);

    this.dlq.grantSendMessages(this.role);

    this.metricDlqSize().createAlarm(this, 'DLQ/NotEmpty', {
      alarmName: `${this.node.path}/DLQ/NotEmpty`,
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: runBookAnchor('TODO'),
    });
  }

  public metricDlqSize() {
    return new cloudwatch.MathExpression({
      expression: 'mVisible + mHidden',
      usingMetrics: {
        mVisible: this.dlq.metricApproximateNumberOfMessagesVisible({ period: Duration.minutes(1) }),
        mHidden: this.dlq.metricApproximateNumberOfMessagesNotVisible({ period: Duration.minutes(1) }),
      },
    });
  }

  public grantSchedule(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    }));
  }


}