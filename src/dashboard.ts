import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Configuration } from './config';
import { Deallocate } from './deallocate';

const RED = '#FF0000';
const GREEN = '#4CAF50';
const ORANGE = '#FFA500';
const YELLOW = '#FFD700';

export interface DashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly deallocate: Deallocate;
  readonly name: string;
}

export class Dashboard extends Construct {
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard');

    const pools = new Set(props.config.data.environments.map(e => e.pool));

    for (const pool of pools) {

      dashboard.addWidgets(new cloudwatch.TextWidget({
        markdown: [
          `# Allocate <> Status Code | Pool: ${pool}`,
          '',
          `Tracks the rate of environment allocation requests from the '${pool}' pool.`,
          'Each series represents different requested capabilities.',
        ].join('\n'),
        height: 2,
        width: 24,
      }));

      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `200 OK | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 200).with({ color: GREEN, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `423 Locked | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 423).with({ color: ORANGE, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `400 Bad Request | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 400).with({ color: YELLOW, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `500 Error | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 500).with({ color: RED, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));

      dashboard.addWidgets(new cloudwatch.TextWidget({
        markdown: `# Deallocate <> Outcome | Pool: ${pool}`,
        height: 1,
        width: 24,
      }));

      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `Success | ${pool}`,
        left: [props.deallocate.metricOutcome(pool, 'success').with({ color: GREEN, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `Failure | ${pool}`,
        left: [props.deallocate.metricOutcome(pool, 'failure').with({ color: RED, label: 'any' })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));

    }

  }

}