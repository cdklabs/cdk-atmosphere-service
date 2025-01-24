import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Configuration } from './config';

const RED = '#FF0000';
const GREEN = '#4CAF50';
const ORANGE = '#FFA500';
const YELLOW = '#FFD700';

export interface DashboardProps {
  readonly config: Configuration;
  readonly allocate: Allocate;
  readonly name: string;
}

export class Dashboard extends Construct {
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard');

    const pools = new Set(props.config.data.environments.map(e => e.pool));

    for (const pool of pools) {
      dashboard.addWidgets(new cloudwatch.TextWidget({
        markdown: `# Allocate Status Codes (Pool: ${pool})`,
        height: 1,
        width: 24,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `200 OK | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 200).with({ color: GREEN })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `423 Locked | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 423).with({ color: ORANGE })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `400 Bad Request | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 400).with({ color: YELLOW })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
      dashboard.addWidgets(new cloudwatch.GraphWidget({
        title: `500 Error | ${pool}`,
        left: [props.allocate.metricStatusCode(pool, 500).with({ color: RED })],
        leftYAxis: { min: 0 },
        height: 6,
        width: 12,
      }));
    }

  }

}