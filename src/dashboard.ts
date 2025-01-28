import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Cleanup } from './cleanup';
import { Configuration } from './config';
import { Deallocate } from './deallocate';
import { UNKNOWN_POOL } from './metrics';

const RED = '#FF0000';
const GREEN = '#4CAF50';
const ORANGE = '#FFA500';
const YELLOW = '#FFD700';

export interface DashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly cleanup: Cleanup;
  readonly name: string;
}

export class Dashboard extends Construct {
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard');

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

    dashboard.addWidgets(new cloudwatch.GraphWidget({
      title: 'Allocate Response',
      left: [
        props.allocate.metricStatusCode('$pool', 200).with({ color: GREEN, label: '200 OK' }),
        props.allocate.metricStatusCode('$pool', 423).with({ color: ORANGE, label: '423 Locked' }),
        props.allocate.metricStatusCode('$pool', 400).with({ color: YELLOW, label: '400 Bad Request' }),
        props.allocate.metricStatusCode('$pool', 500).with({ color: RED, label: '500 Error' }),
      ],
      leftYAxis: { min: 0, showUnits: false },
      height: 6,
      width: 12,
    }));

    dashboard.addWidgets(new cloudwatch.GraphWidget({
      title: 'Deallocate Response',
      left: [
        props.deallocate.metricStatusCode('$pool', 200).with({ color: GREEN, label: '200 OK' }),
        props.deallocate.metricStatusCode('$pool', 400).with({ color: YELLOW, label: '400 Bad Request' }),
        props.deallocate.metricStatusCode('$pool', 500).with({ color: RED, label: '500 Error' }),
      ],
      leftYAxis: { min: 0, showUnits: false },
      height: 6,
      width: 12,
    }));

    dashboard.addWidgets(new cloudwatch.GraphWidget({
      title: 'Allocation Outcome',
      left: [
        props.deallocate.metricOutcome('$pool', 'success').with({ color: GREEN, label: 'success' }),
        props.deallocate.metricOutcome('$pool', 'failure').with({ color: RED, label: 'failure' }),
        props.deallocate.metricOutcome('$pool', 'timeout').with({ color: YELLOW, label: 'timeout' }),
      ],
      leftYAxis: { min: 0, showUnits: false },
      height: 6,
      width: 12,
    }));

    dashboard.addWidgets(new cloudwatch.GraphWidget({
      title: 'Cleanup Exit Code',
      left: [
        props.cleanup.metricExitCode('$pool', 0).with({ color: GREEN, label: '0' }),
        props.cleanup.metricExitCode('$pool', 1).with({ color: RED, label: '1' }),
      ],
      leftYAxis: { min: 0, showUnits: false },
      height: 6,
      width: 12,
    }));

    dashboard.addWidgets(new cloudwatch.GraphWidget({
      title: 'Cleanup Outcome',
      left: [
        props.cleanup.metricOutcome('$pool', 'clean').with({ color: GREEN, label: 'clean' }),
        props.cleanup.metricOutcome('$pool', 'dirty').with({ color: RED, label: 'dirty' }),
      ],
      leftYAxis: { min: 0, showUnits: false },
      height: 6,
      width: 12,
    }));

  }

}