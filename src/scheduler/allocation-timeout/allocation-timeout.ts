import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AllocationTimeoutFunction } from './allocation-timeout-function';

export interface AllocationTimeoutProps {
  readonly dlq: sqs.Queue;
}

export class AllocationTimeout extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: AllocationTimeoutProps) {
    super(scope, id);

    this.function = new AllocationTimeoutFunction(this, 'Function', {
      deadLetterQueue: props.dlq,
      timeout: Duration.minutes(1),
    });

  }

  public grantInvoke(grantee: iam.IGrantable) {
    this.function.grantInvoke(grantee);
  }

}