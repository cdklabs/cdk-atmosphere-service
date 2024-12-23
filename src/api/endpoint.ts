import { Aws } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Allocate } from '../allocate';
import { Deallocate } from '../deallocate';

/**
 * Options for `Endpoint`.
 */
export interface EndpointOptions {

  /**
   * List of accounts that are allowed to access the endpoint.
   *
   * @default - only the service account is allowed.
   */
  readonly allowedAccounts?: string[];

}

/**
 * Properties `Endpoint`.
 */
export interface EndpointProps extends EndpointOptions {

  /**
   * Allocate function.
   */
  readonly allocate: Allocate;

  /**
   * Deallocate function.
   */
  readonly deallocate: Deallocate;
}

export class Endpoint extends Construct {

  /**
   * Api Gateway rest api.
   */
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: EndpointProps) {
    super(scope, id);

    // we add the service account so that a resource policy always exists
    // and thus rejecting annonymous access.
    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-authorization-flow.html#apigateway-authorization-flow-resource-policy-only
    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-cross-account-example
    const principals = [Aws.ACCOUNT_ID, ...(props.allowedAccounts ?? [])].map(a => new iam.AccountPrincipal(a));

    // Create the API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      description: 'RESTful endpoint for the Atmosphere service',
      restApiName: 'Atmosphere',
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ['execute-api:Invoke'],
            principals,
            resources: [
              'execute-api:/prod/POST/allocations',
              'execute-api:/prod/DELETE/allocations/{id}',
            ],
          }),
        ],
      }),
    });

    // Create /allocations resource
    const allocations = this.api.root.addResource('allocations');

    // POST /allocations -> Allocation Lambda
    allocations.addMethod('POST', new apigateway.LambdaIntegration(props.allocate.function, {
      proxy: true,
    }));

    // DELETE /allocations/{id} -> Deallocation Lambda
    const allocation = allocations.addResource('{id}');
    allocation.addMethod('DELETE', new apigateway.LambdaIntegration(props.deallocate.function, {
      proxy: true,
    }));

  }
}