import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DeallocateFunction } from './deallocate-function';
import { Cleanup } from '../cleanup';
import * as envars from '../envars';
import { Scheduler } from '../scheduler';
import { Allocations, Environments } from '../storage';

/**
 * Properties for `Deallocate`.
 */
export interface DeallocateProps {

  /**
   * Allocations storage.
   */
  readonly allocations: Allocations;

  /**
   * Environments storage.
   */
  readonly environments: Environments;

  /**
   * Scheduler.
   */
  readonly scheduler: Scheduler;

  /**
   * Cleanup.
   */
  readonly cleanup: Cleanup;
}

/**
 * Deallocate function.
 */
export class Deallocate extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: DeallocateProps) {
    super(scope, id);

    this.function = new DeallocateFunction(this, 'Function');

    props.allocations.grantReadWrite(this.function);
    props.environments.grantReadWrite(this.function);
    props.scheduler.grantSchedule(this.function);
    props.cleanup.grantRun(this.function);

    // creating the cleanup timeout event requires passing the events role
    props.scheduler.role.grantPassRole(this.function.grantPrincipal);

    props.scheduler.allocationTimeoutFunction.addEnvironment(envars.DEALLOCATE_FUNCTION_NAME_ENV, this.function.functionName);
    this.function.grantInvoke(props.scheduler.allocationTimeoutFunction);

    this.function.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    this.function.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);
    this.function.addEnvironment(envars.SCHEDULER_DLQ_ARN_ENV, props.scheduler.dlq.queueArn);
    this.function.addEnvironment(envars.SCHEDULER_ROLE_ARN_ENV, props.scheduler.role.roleArn);
    this.function.addEnvironment(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV, props.scheduler.cleanupTimeoutFunction.functionArn);
    this.function.addEnvironment(envars.CLEANUP_CLUSTER_ARN_ENV, props.cleanup.cluster.clusterArn);
    this.function.addEnvironment(envars.CLEANUP_TASK_DEFINITION_ARN_ENV, props.cleanup.task.taskDefinitionArn);
    this.function.addEnvironment(envars.CLEANUP_TASK_SUBNET_ID_ENV, props.cleanup.subnetId);
    this.function.addEnvironment(envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV, props.cleanup.securityGroupId);
    this.function.addEnvironment(envars.CLEANUP_TASK_CONTAINER_NAME_ENV, props.cleanup.containerName);

  }
}