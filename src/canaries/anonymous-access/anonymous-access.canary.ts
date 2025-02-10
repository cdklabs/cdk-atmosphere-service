import { Duration } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { AnonymousAccessCanaryFunction } from './anonymous-access.canary-function';
import { Endpoint } from '../../api';
import * as envars from '../../envars';

export interface AnonymousAccessCanaryProps {
  readonly endpoint: Endpoint;
}

export class AnonymousAccessCanary extends Construct {

  public readonly function: lambda.Function;
  public readonly period = Duration.minutes(1);

  constructor(scope: Construct, id: string, props: AnonymousAccessCanaryProps) {
    super(scope, id);

    this.function = new AnonymousAccessCanaryFunction(this, 'Function', {
      timeout: Duration.seconds(30),
      reservedConcurrentExecutions: 1,
    });

    this.function.addEnvironment(envars.ENDPOINT_URL_ENV, props.endpoint.api.urlForPath());

    new events.Rule(this, 'Schedule', {
      description: `Periodically runs the annonymous canary function (${this.function.node.path})`,
      enabled: true,
      schedule: events.Schedule.rate(this.period),
      targets: [new targets.LambdaFunction(this.function)],
    });

  }
}