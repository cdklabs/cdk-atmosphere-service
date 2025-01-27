import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Configuration } from '../config';
import * as envars from '../envars';
import { Allocations, Environments } from '../storage';
import { METRIC_DIMENSION_EXIT_CODE, METRIC_DIMENSION_OUTCOME, METRIC_NAME } from './cleanup.task';
import { METRIC_DIMENSION_POOL, METRICS_NAMESPACE } from '../metrics';

/**
 * Properties for `Cleanup`.
 */
export interface CleanupProps {
  /**
   * Service configuration.
   */
  readonly configuration: Configuration;
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
 * Provides a cleanup task.
 */
export class Cleanup extends Construct {

  public readonly cluster: ecs.Cluster;
  public readonly task: ecs.FargateTaskDefinition;
  public readonly subnetId: string;
  public readonly securityGroupId: string;
  public readonly containerName: string = 'main';

  constructor(scope: Construct, id: string, props: CleanupProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [{
        subnetType: ec2.SubnetType.PUBLIC,
        name: 'Public',
      }],
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup');
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc, allowAllOutbound: true });

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      containerInsights: true,
      enableFargateCapacityProviders: true,
      vpc,
    });

    const subnets = this.cluster.vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC });
    this.subnetId = subnets.subnetIds[0];
    this.securityGroupId = securityGroup.securityGroupId;

    this.task = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    this.task.addContainer(this.containerName, {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, 'image'), { platform: Platform.LINUX_ARM64 }),
      logging: ecs.LogDriver.awsLogs({
        logGroup,
        streamPrefix: 'cleanup',
      }),
      environment: {
        [envars.ENVIRONMENTS_TABLE_NAME_ENV]: props.environments.table.tableName,
        [envars.ALLOCATIONS_TABLE_NAME_ENV]: props.allocations.table.tableName,
        [envars.CONFIGURATION_BUCKET_ENV]: props.configuration.bucket.bucketName,
        [envars.CONFIGURATION_KEY_ENV]: props.configuration.key,
        AWS_EMF_ENVIRONMENT: 'Local',
      },
    });

    // cleanup must be able to assume admin roles for all its environments
    // because it performs operations in those environments.
    for (const env of props.configuration.data.environments) {
      const adminRole = iam.Role.fromRoleArn(this, `AdminRole${env.account}${env.region}`, env.adminRoleArn);
      adminRole.grantAssumeRole(this.task.taskRole);
    }

    props.configuration.grantRead(this.task.taskRole);
    props.allocations.grantReadWrite(this.task.taskRole);
    props.environments.grantReadWrite(this.task.taskRole);

  }

  public grantRun(grantee: iam.IGrantable) {
    this.task.grantRun(grantee);
  }

  public metricExitCode(pool: string, exitCode: number) {
    return new cloudwatch.Metric({
      metricName: METRIC_NAME,
      dimensionsMap: {
        [METRIC_DIMENSION_POOL]: pool,
        [METRIC_DIMENSION_EXIT_CODE]: exitCode.toString(),
      },
      namespace: METRICS_NAMESPACE,
      statistic: 'sum',
      period: Duration.minutes(5),
    });
  }

  public metricOutcome(pool: string, outcome: string) {
    return new cloudwatch.Metric({
      metricName: METRIC_NAME,
      dimensionsMap: {
        [METRIC_DIMENSION_POOL]: pool,
        [METRIC_DIMENSION_OUTCOME]: outcome,
      },
      namespace: METRICS_NAMESPACE,
      statistic: 'sum',
      period: Duration.minutes(5),
    });
  }

}