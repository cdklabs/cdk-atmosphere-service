import { Duration, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { DirtyEnvironmentsWidgetFunction } from './dirty-environments.widget-function';
import { Cleanup } from '../../../cleanup';
import { Configuration } from '../../../config';
import * as envars from '../../../envars';
import { Allocations, Environments } from '../../../storage';

export interface DirtyEnvironmentsWidgetProps {
  readonly environments: Environments;
  readonly allocations: Allocations;
  readonly configuration: Configuration;
  readonly cleanup: Cleanup;
  readonly pool: string;
  readonly width: number;
  readonly height: number;
}

export class DirtyEnvironmentsWidget extends Construct implements cloudwatch.IWidget {

  private readonly _widget: cloudwatch.CustomWidget;

  public constructor(scope: Construct, id: string, props: DirtyEnvironmentsWidgetProps) {
    super(scope, id);

    const func = new DirtyEnvironmentsWidgetFunction(this, 'Function', {
      timeout: Duration.minutes(5),
    });

    props.environments.grantRead(func);
    props.allocations.grantRead(func);
    props.configuration.grantRead(func);
    props.cleanup.grantRun(func);
    props.cleanup.grantQueryLogs(func);

    func.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    func.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);
    func.addEnvironment(envars.CONFIGURATION_BUCKET_ENV, props.configuration.bucket.bucketName);
    func.addEnvironment(envars.CONFIGURATION_KEY_ENV, props.configuration.key);
    func.addEnvironment(envars.CLEANUP_CLUSTER_ARN_ENV, props.cleanup.cluster.clusterArn);
    func.addEnvironment(envars.CLEANUP_CLUSTER_NAME_ENV, props.cleanup.cluster.clusterName);
    func.addEnvironment(envars.CLEANUP_LOG_GROUP_NAME_ENV, props.cleanup.logGroup.logGroupName);
    func.addEnvironment(envars.CLEANUP_TASK_DEFINITION_ARN_ENV, props.cleanup.task.taskDefinitionArn);
    func.addEnvironment(envars.CLEANUP_TASK_SUBNET_ID_ENV, props.cleanup.subnetId);
    func.addEnvironment(envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV, props.cleanup.securityGroupId);
    func.addEnvironment(envars.CLEANUP_TASK_CONTAINER_NAME_ENV, props.cleanup.containerName);

    this._widget = new cloudwatch.CustomWidget({
      width: props.width,
      height: props.height,
      functionArn: func.functionArn,
      title: 'Dirty Environments',
      params: {
        pool: props.pool,
        serviceRegion: Stack.of(this).region,
      },
      updateOnRefresh: true,
      updateOnTimeRangeChange: true,
    });
  }

  public get width(): number {
    return this._widget.width;
  }

  public get height(): number {
    return this._widget.height;
  }

  position(x: number, y: number): void {
    this._widget.position(x, y);
  }

  toJson(): any[] {
    return this._widget.toJson();
  }

}