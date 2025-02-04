import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificates from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as r53targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { Allocate } from '../allocate';
import { Deallocate } from '../deallocate';

/**
 * Options for `Endpoint`.
 */
export interface EndpointOptions {

  /**
   * List of principals that are allowed to access the endpoint.
   *
   * @default - endpoint is not accessible by anyone.
   */
  readonly allowedPrincipals?: iam.IPrincipal[];

  /**
   * Providing a hosted zone will create a custom domain for the API endpoint.
   * The FQDN will be the same as the domain name of the hosted zone.
   *
   * Sub domains are not currently supported.
   *
   * @default - no custom domain is created.
   */
  readonly hostedZone?: r53.IHostedZone;

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

    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-authorization-flow.html#apigateway-authorization-flow-resource-policy-only
    // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-cross-account-example
    const principals = props.allowedPrincipals ?? [new iam.AnyPrincipal()];
    const effect = props.allowedPrincipals ? iam.Effect.ALLOW: iam.Effect.DENY;
    const resources = props.allowedPrincipals ? [
      'execute-api:/prod/POST/allocations',
      'execute-api:/prod/DELETE/allocations/*',
    ] : ['*'];

    // Create the API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      description: 'RESTful endpoint for the Atmosphere service',
      restApiName: 'Atmosphere',
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect,
            actions: ['execute-api:Invoke'],
            principals,
            resources,
          }),
        ],
      }),
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      disableExecuteApiEndpoint: props.hostedZone ? true : false,
    });

    if (props.hostedZone) {
      const certificate = new certificates.Certificate(this, 'Certificate', {
        domainName: props.hostedZone.zoneName,
        validation: certificates.CertificateValidation.fromDns(props.hostedZone),
      });

      const domainName = this.api.addDomainName('DomainName', {
        domainName: props.hostedZone.zoneName,
        certificate,
        endpointType: apigateway.EndpointType.REGIONAL,

        // will reject TLS 1.0
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
      });

      new r53.ARecord(this, 'ARecord', {
        zone: props.hostedZone,
        target: r53.RecordTarget.fromAlias(
          new r53targets.ApiGatewayDomain(domainName),
        ),
      });
    }

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