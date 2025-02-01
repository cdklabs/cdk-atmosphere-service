// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for AllocationLogsWidgetFunction
 */
export interface AllocationLogsWidgetFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/allocation-logs.widget.
 */
export class AllocationLogsWidgetFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: AllocationLogsWidgetFunctionProps) {
    super(scope, id, {
      description: 'src/allocation-logs.widget.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../assets/allocation-logs.widget.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}