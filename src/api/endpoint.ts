import { Aws } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificates from 'aws-cdk-lib/aws-certificatemanager';
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

  /**
   * Allocations sub resource.
   */
  public readonly allocationsResource: apigateway.Resource;

  /**
   * Allocation sub resource.
   */
  public readonly allocationResource: apigateway.Resource;

  constructor(scope: Construct, id: string, props: EndpointProps) {
    super(scope, id);

    // we add the service account so that a resource policy always exists
    // and thus rejecting annonymous access.
    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-authorization-flow.html#apigateway-authorization-flow-resource-policy-only
    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-cross-account-example
    const principals = [Aws.ACCOUNT_ID, ...(props.allowedAccounts ?? [])].map(a => new iam.AccountPrincipal(a));

    const name = 'cdk-atmosphere-service';

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
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    const certificate = new certificates.Certificate(this, 'Certificate', {
      domainName: name,
      region: 'us-east-1', // Required for API Gateway custom domains
    });

    const domainName = new apigateway.DomainName(this, 'DomainName', {
      mapping: this.api,
      domainName: name,
      certificate: 'asd',
      endpointType: apigateway.EndpointType.REGIONAL,

      // will reject TLS 1.0
      securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
    });

    // Create /allocations resource
    this.allocationsResource = this.api.root.addResource('allocations');

    // POST /allocations -> Allocation Lambda
    this.allocationsResource.addMethod('POST', new apigateway.LambdaIntegration(props.allocate.function, {
      proxy: true,
    }), { authorizationType: apigateway.AuthorizationType.IAM });

    // DELETE /allocations/{id} -> Deallocation Lambda
    this.allocationResource = this.allocationsResource.addResource('{id}');
    this.allocationResource.addMethod('DELETE', new apigateway.LambdaIntegration(props.deallocate.function, {
      proxy: true,
    }), { authorizationType: apigateway.AuthorizationType.IAM });

  }
}