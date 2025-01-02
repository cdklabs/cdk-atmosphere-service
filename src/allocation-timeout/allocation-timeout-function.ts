// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for AllocationTimeoutFunction
 */
export interface AllocationTimeoutFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/allocation-timeout/allocation-timeout.
 */
export class AllocationTimeoutFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: AllocationTimeoutFunctionProps) {
    super(scope, id, {
      description: 'src/allocation-timeout/allocation-timeout.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/allocation-timeout/allocation-timeout.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}