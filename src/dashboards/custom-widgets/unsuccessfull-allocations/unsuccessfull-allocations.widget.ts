import { Duration, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { UnsuccessfullAllocationsWidgetFunction } from './unsuccessfull-allocations.widget-function';
import { Allocate } from '../../../allocate';
import { Cleanup } from '../../../cleanup';
import { Deallocate } from '../../../deallocate';
import * as envars from '../../../envars';
import { Scheduler } from '../../../scheduler';
import { Allocations } from '../../../storage';

export interface UnsuccessfullAllocationsWidgetProps {
  readonly allocations: Allocations;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly cleanup: Cleanup;
  readonly scheduler: Scheduler;
  readonly pool: string;
  readonly width: number;
  readonly height: number;
}

export class UnsuccessfullAllocationsWidget extends Construct implements cloudwatch.IWidget {

  private readonly _widget: cloudwatch.CustomWidget;

  public constructor(scope: Construct, id: string, props: UnsuccessfullAllocationsWidgetProps) {
    super(scope, id);

    const func = new UnsuccessfullAllocationsWidgetFunction(this, 'Function', {
      timeout: Duration.minutes(5),
    });

    props.allocations.grantRead(func);
    props.allocate.grantQueryLogs(func);
    props.deallocate.grantQueryLogs(func);
    props.scheduler.allocationTimeout.grantQueryLogs(func);
    props.scheduler.cleanupTimeout.grantQueryLogs(func);
    props.cleanup.grantQueryLogs(func);

    func.addEnvironment(envars.ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);
    func.addEnvironment(envars.ALLOCATE_LOG_GROUP_NAME_ENV, props.allocate.function.logGroup.logGroupName);
    func.addEnvironment(envars.DEALLOCATE_LOG_GROUP_NAME_ENV, props.deallocate.function.logGroup.logGroupName);
    func.addEnvironment(envars.ALLOCATION_TIMEOUT_LOG_GROUP_NAME_ENV, props.scheduler.allocationTimeout.function.logGroup.logGroupName);
    func.addEnvironment(envars.CLEANUP_TIMEOUT_LOG_GROUP_NAME_ENV, props.scheduler.cleanupTimeout.function.logGroup.logGroupName);
    func.addEnvironment(envars.CLEANUP_LOG_GROUP_NAME_ENV, props.cleanup.logGroup.logGroupName);

    this._widget = new cloudwatch.CustomWidget({
      width: props.width,
      height: props.height,
      functionArn: func.functionArn,
      title: 'Unsuccessfull Allocations',
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