import { Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from '../allocate';
import { Cleanup } from '../cleanup';
import { Configuration } from '../config';
import { Deallocate } from '../deallocate';
import { Scheduler } from '../scheduler';
import { Allocations, Environments } from '../storage';
import { AllocationLogsWidget } from './custom-widgets/allocations-logs/allocation-logs.widget';

const BLUE = '#0073BB';

export interface GlobalDashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly cleanup: Cleanup;
  readonly environments: Environments;
  readonly allocations: Allocations;
  readonly scheduler: Scheduler;
}

export class GlobalDashboard extends Construct {
  constructor(scope: Construct, id: string, props: GlobalDashboardProps) {
    super(scope, id);

    const dashboard = new cloudwatch.Dashboard(this, 'Resource', {
      dashboardName: `${Stack.of(this).stackName}-global`,
    });

    // add all widgets in a single call so they are positioned
    // next to each other (vs stacked)
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Scheduler Dead Letter Queue',
        left: [props.scheduler.metricDlqSize().with({ color: BLUE, label: 'size' })],
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 24,
      }),
      new AllocationLogsWidget(this, 'AllocationLogsWidget', {
        allocate: props.allocate,
        deallocate: props.deallocate,
        scheduler: props.scheduler,
        cleanup: props.cleanup,
        width: 24,
        height: 18,
      }),
    );

  }

}