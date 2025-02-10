import { Duration } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { UnauthorizedRoleAccessCanaryFunction } from './unauthorized-role-access.canary-function';
import { Endpoint } from '../../api';
import * as envars from '../../envars';

export interface UnauthorizedRoleAccessCanaryProps {
  readonly endpoint: Endpoint;
  readonly roleArn: string;
}

export class UnauthorizedRoleAccessCanary extends Construct {

  public readonly function: lambda.Function;
  public readonly period = Duration.minutes(1);

  constructor(scope: Construct, id: string, props: UnauthorizedRoleAccessCanaryProps) {
    super(scope, id);

    this.function = new UnauthorizedRoleAccessCanaryFunction(this, 'Function', {
      timeout: Duration.seconds(30),
      reservedConcurrentExecutions: 1,
    });

    this.function.addEnvironment(envars.ENDPOINT_URL_ENV, props.endpoint.api.urlForPath());
    this.function.addEnvironment('ROLE_ARN', props.roleArn);

    new events.Rule(this, 'Schedule', {
      description: `Periodically runs the annonymous canary function (${this.function.node.path})`,
      enabled: true,
      schedule: events.Schedule.rate(this.period),
      targets: [new targets.LambdaFunction(this.function)],
    });

  }
}