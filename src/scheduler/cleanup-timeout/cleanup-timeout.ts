import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { CleanupTimeoutFunction } from './cleanup-timeout-function';
import * as envars from '../../envars';
import { Environments } from '../../storage';

export interface CleanupTimeoutProps {
  readonly environments: Environments;
}

export class CleanupTimeout extends Construct {

  public readonly dlq: sqs.Queue;
  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: CleanupTimeoutProps) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, 'DLQ', { encryption: sqs.QueueEncryption.KMS_MANAGED });

    this.function = new CleanupTimeoutFunction(this, 'Function', {
      deadLetterQueue: this.dlq,
      timeout: Duration.minutes(1),
    });

    props.environments.grantReadWrite(this.function);

    this.function.addEnvironment(envars.ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);

  }

  public grantInvoke(grantee: iam.IGrantable) {
    this.function.grantInvoke(grantee);
  }

}