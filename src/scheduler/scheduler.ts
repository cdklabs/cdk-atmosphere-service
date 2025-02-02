import * as iam from 'aws-cdk-lib/aws-iam';
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
  public readonly cleanupTimeout: CleanupTimeout;
  public readonly allocationTimeout: AllocationTimeout;

  public constructor(scope: Construct, id: string, props: SchedulerProps) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });

    this.cleanupTimeout = new CleanupTimeout(this, 'CleanupTimeout', {
      environments: props.environments,
      allocations: props.allocations,
    });
    this.allocationTimeout = new AllocationTimeout(this, 'AllocationTimeout', {
      allocations: props.allocations,
    });

    this.cleanupTimeout.grantInvoke(this.role);
    this.allocationTimeout.grantInvoke(this.role);

    this.cleanupTimeout.dlq.grantSendMessages(this.role);
    this.allocationTimeout.dlq.grantSendMessages(this.role);

  }

  public grantSchedule(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    }));
  }

}