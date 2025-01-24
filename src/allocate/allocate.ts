import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { AllocateFunction } from './allocate-function';
import { Configuration } from '../config';
import { METRICS_NAMESPACE, METRICS_DIMENSION_POOL } from './allocate.lambda';
import * as envars from '../envars';
import { Scheduler } from '../scheduler';
import { Allocations, Environments } from '../storage';

/**
 * Properties for `Allocate`.
 */
export interface AllocateProps {

  /**
   * Service configuration.
   */
  readonly configuration: Configuration;

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
}

/**
 * Allocate function.
 */
export class Allocate extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: AllocateProps) {
    super(scope, id);

    this.function = new AllocateFunction(this, 'Function', {
      timeout: Duration.minutes(1),
    });

    props.configuration.grantRead(this.function);
    props.environments.grantReadWrite(this.function);
    props.allocations.grantReadWrite(this.function);
    props.scheduler.grantSchedule(this.function);

    // creating the allocation timeout event requires passing the events role
    props.scheduler.role.grantPassRole(this.function.grantPrincipal);

    this.function.addEnvironment(envars.CONFIGURATION_BUCKET_ENV, props.configuration.bucket.bucketName);
    this.function.addEnvironment(envars.CONFIGURATION_KEY_ENV, props.configuration.key);
    this.function.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    this.function.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);
    this.function.addEnvironment(envars.SCHEDULER_DLQ_ARN_ENV, props.scheduler.dlq.queueArn);
    this.function.addEnvironment(envars.SCHEDULER_ROLE_ARN_ENV, props.scheduler.role.roleArn);
    this.function.addEnvironment(envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV, props.scheduler.allocationTimeoutFunction.functionArn);
    this.function.addEnvironment(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV, props.scheduler.cleanupTimeoutFunction.functionArn);

    // allocation must be able to assume admin roles for all its environments
    // because it passes credentials to clients.
    for (const env of props.configuration.data.environments) {
      const adminRole = iam.Role.fromRoleArn(this, `AdminRole${env.account}${env.region}`, env.adminRoleArn);
      adminRole.grantAssumeRole(this.function.grantPrincipal);
    }

  }

  public metricStatusCode(pool: string, statusCode: number) {
    return new cloudwatch.Metric({
      metricName: `${statusCode}`,
      dimensionsMap: { [METRICS_DIMENSION_POOL]: pool },
      namespace: METRICS_NAMESPACE,
      statistic: 'sum',
      period: Duration.minutes(5),
    });
  }

}