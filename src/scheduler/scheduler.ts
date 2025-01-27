import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AllocationTimeoutFunction } from '../allocation-timeout/allocation-timeout-function';
import { CleanupTimeoutFunction } from '../cleanup-timeout/cleanup-timeout-function';
import * as envars from '../envars';
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
    this.allocationTimeoutFunction = new AllocationTimeoutFunction(this, 'AllocationTimeout', {
      deadLetterQueue: this.dlq,
      timeout: Duration.minutes(1),
    });

    props.environments.grantReadWrite(this.cleanupTimeoutFunction);
    props.allocations.grantReadWrite(this.allocationTimeoutFunction);
    props.environments.grantReadWrite(this.allocationTimeoutFunction);

    this.cleanupTimeoutFunction.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);

    this.cleanupTimeoutFunction.grantInvoke(this.role);
    this.allocationTimeoutFunction.grantInvoke(this.role);

    this.dlq.grantSendMessages(this.role);

  }

  public grantSchedule(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    }));
  }

}