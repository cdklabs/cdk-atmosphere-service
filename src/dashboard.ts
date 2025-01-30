import { createHash } from 'crypto';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Cleanup } from './cleanup';
import { Configuration } from './config';
import { Deallocate } from './deallocate';
import { UNKNOWN_POOL } from './metrics';
import { Environments } from './storage';

const RED = '#FF0000';
const GREEN = '#4CAF50';
const ORANGE = '#FFA500';
const YELLOW = '#FFD700';
const BROWN = '#5D4037';

export interface DashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly cleanup: Cleanup;
  readonly environments: Environments;
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
      new cloudwatch.GraphWidget({
        title: 'Allocate Response',
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
        title: 'Deallocate Response',
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
        title: 'Allocation Outcome',
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
      new cloudwatch.GraphWidget({
        title: 'Environments Status',
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