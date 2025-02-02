import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AllocationTimeoutFunction } from './allocation-timeout-function';

export class AllocationTimeout extends Construct {

  public readonly dlq: sqs.Queue;
  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, 'DLQ', { encryption: sqs.QueueEncryption.KMS_MANAGED });

    this.function = new AllocationTimeoutFunction(this, 'Function', {
      deadLetterQueue: this.dlq,
      timeout: Duration.minutes(1),
    });

  }

  public grantInvoke(grantee: iam.IGrantable) {
    this.function.grantInvoke(grantee);
  }

}