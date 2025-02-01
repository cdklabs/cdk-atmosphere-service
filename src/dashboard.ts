import { createHash } from 'crypto';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { AllocationLogsWidget } from './allocation-logs.widget';
import { Cleanup } from './cleanup';
import { Configuration } from './config';
import { Deallocate } from './deallocate';
import { DirtyEnvironmentsWidget } from './dirty-environments.widget';
import { UNKNOWN_POOL } from './metrics';
import { Scheduler } from './scheduler';
import { Allocations, Environments } from './storage';

const RED = '#FF0000';
const GREEN = '#4CAF50';
const ORANGE = '#FFA500';
const YELLOW = '#FFD700';
const BROWN = '#5D4037';
const BLUE= '#0073BB';

export interface DashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly cleanup: Cleanup;
  readonly environments: Environments;
  readonly allocations: Allocations;
  readonly scheduler: Scheduler;
  readonly name: string;
}

export class Dashboard extends Construct {
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', { dashboardName: props.name });

    const pools = Array.from(new Set(props.config.data.environments.map(e => e.pool)));

    // we also want to see operations that were unable to determine
    // which pool they belong to.
    pools.push(UNKNOWN_POOL);

    dashboard.addVariable(new cloudwatch.DashboardVariable({
      id: 'pool',
      label: 'pool',
      value: 'pool',
      type: cloudwatch.VariableType.PROPERTY,
      inputType: cloudwatch.VariableInputType.SELECT,
      values: cloudwatch.Values.fromValues(...pools.map(p => ({ value: p }))),
      defaultValue: cloudwatch.DefaultValue.value(pools[0]),
    }));

    // add all widgets in a single call so they are positioned
    // next to each other (vs stacked)
    dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: [
          '# Requests Rate',
          '',
          'Widgets in this section display the rate of requests serviced by system components, segmented by various dimensions.',
        ].join('\n'),
        height: 2,
        width: 24,
      }),
      new cloudwatch.GraphWidget({
        title: 'Allocate Status Code',
        left: [
          props.allocate.metricStatusCode('$pool', 200).with({ color: GREEN, label: '200 OK' }),
          props.allocate.metricStatusCode('$pool', 423).with({ color: ORANGE, label: '423 Locked' }),
          props.allocate.metricStatusCode('$pool', 400).with({ color: YELLOW, label: '400 Bad Request' }),
          props.allocate.metricStatusCode('$pool', 500).with({ color: RED, label: '500 Error' }),
        ].map((m) => this.fill(m, '0')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Deallocate Status Code',
        left: [
          props.deallocate.metricStatusCode('$pool', 200).with({ color: GREEN, label: '200 OK' }),
          props.deallocate.metricStatusCode('$pool', 400).with({ color: YELLOW, label: '400 Bad Request' }),
          props.deallocate.metricStatusCode('$pool', 500).with({ color: RED, label: '500 Error' }),
        ].map((m) => this.fill(m, '0')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Deallocate Outcome',
        left: [
          props.deallocate.metricOutcome('$pool', 'success').with({ color: GREEN, label: 'success' }),
          props.deallocate.metricOutcome('$pool', 'failure').with({ color: RED, label: 'failure' }),
          props.deallocate.metricOutcome('$pool', 'timeout').with({ color: YELLOW, label: 'timeout' }),
        ].map((m) => this.fill(m, '0')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Cleanup Exit Code',
        left: [
          props.cleanup.metricExitCode('$pool', 0).with({ color: GREEN, label: '0' }),
          props.cleanup.metricExitCode('$pool', 1).with({ color: RED, label: '1' }),
        ].map((m) => this.fill(m, '0')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Cleanup Outcome',
        left: [
          props.cleanup.metricOutcome('$pool', 'clean').with({ color: GREEN, label: 'clean' }),
          props.cleanup.metricOutcome('$pool', 'dirty').with({ color: RED, label: 'dirty' }),
        ].map((m) => this.fill(m, '0')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.TextWidget({
        markdown: [
          '# Entities Count',
          '',
          'Widgets in this section display the current count of entities in the system, segmented by their status.',
        ].join('\n'),
        height: 2,
        width: 24,
      }),
      new cloudwatch.GraphWidget({
        title: 'Environments',
        left: [
          props.environments.metricFree('$pool').with({ color: GREEN, label: 'free' }),
          props.environments.metricRegistered('$pool').with({ color: BROWN, label: 'registered' }),
          props.environments.metricCleaning('$pool').with({ color: YELLOW, label: 'cleaning' }),
          props.environments.metricInUse('$pool').with({ color: ORANGE, label: 'in-use' }),
          props.environments.metricDirty('$pool').with({ color: RED, label: 'dirty' }),
        ].map((m) => this.fill(m, 'REPEAT')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Allocations',
        left: [
          props.allocations.metricSuccess('$pool').with({ color: GREEN, label: 'success' }),
          props.allocations.metricInProgress('$pool').with({ color: BLUE, label: 'in-progress' }),
          props.allocations.metricFailure('$pool').with({ color: RED, label: 'failure' }),
          props.allocations.metricTimeout('$pool').with({ color: YELLOW, label: 'timeout' }),
        ].map((m) => this.fill(m, 'REPEAT')),
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
      new cloudwatch.TextWidget({
        markdown: [
          '# Reports',
          '',
          'Widgets in this section display a detailed account of noteworthy system entities.',
        ].join('\n'),
        height: 2,
        width: 24,
      }),
      new DirtyEnvironmentsWidget(this, 'DirtyEnvironmentsWidget', {
        environments: props.environments,
        allocations: props.allocations,
        configuration: props.config,
        cleanup: props.cleanup,
        pool: '${pool}',
        width: 12,
        height: 6,
      }),
      new AllocationLogsWidget(this, 'AllocationLogsWidget', {
        allocate: props.allocate,
        deallocate: props.deallocate,
        scheduler: props.scheduler,
        cleanup: props.cleanup,
        width: 24,
        height: 18,
      }),
      new cloudwatch.GraphWidget({
        title: 'Scheduler Dead Letter Queue (All Pools)',
        left: [props.scheduler.metricDlqSize().with({ color: BLUE, label: 'size' })],
        leftYAxis: { min: 0, showUnits: false },
        height: 6,
        width: 12,
      }),
    );

  }

  private fill(metric: cloudwatch.Metric, fill: string) {

    const h = createHash('sha256')
      .update(metric.namespace)
      .update('\0')
      .update(metric.metricName);

    for (const [dk, dv] of Object.entries(metric.dimensions ?? {})) {
      h.update('\0').update(`${dk}:${dv}`);
    }

    const metricName = `m${h.digest('hex')}`;

    return new cloudwatch.MathExpression({
      expression: `FILL(${metricName}, ${fill})`,
      label: metric.label,
      color: metric.color,
      usingMetrics: { [metricName]: metric },
    });

  }

}