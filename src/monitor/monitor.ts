import { Construct } from 'constructs';
import { EnvironmentsMonitor } from './environments.monitor';
import { Configuration } from '../config';
import { Environments } from '../storage';

export interface MonitorProps {
  readonly configuration: Configuration;
  readonly environments: Environments;
}

export class Monitor extends Construct {

  public readonly environments: EnvironmentsMonitor;

  constructor(scope: Construct, id: string, props: MonitorProps) {
    super(scope, id);

    this.environments = new EnvironmentsMonitor(this, 'Environments', {
      configuration: props.configuration,
      environments: props.environments,
    });
  }
}