import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Allocations, Environments } from '../storage';
import { AllocationTimeout } from './allocation-timeout';
import { CleanupTimeout } from './cleanup-timeout';

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
      environments: props.environments,
      dlq: this.dlq,
    });
    this.allocationTimeout = new AllocationTimeout(this, 'AllocationTimeout', {
      dlq: this.dlq,
    });

    this.cleanupTimeout.grantInvoke(this.role);
    this.allocationTimeout.grantInvoke(this.role);

    this.dlq.grantSendMessages(this.role);

  }

  public grantSchedule(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    }));
  }

}