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
  readonly allowedPrincipals?: iam.ArnPrincipal[];

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

  private readonly _allowedArns: string[] = [];

  constructor(scope: Construct, id: string, props: EndpointProps) {
    super(scope, id);

    props.allowedPrincipals?.forEach(p => this.grantAccess(p));

    // Create the API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      description: 'RESTful endpoint for the Atmosphere service',
      restApiName: 'Atmosphere',
      policy: this.buildPolicy(),
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

  public grantAccess(principal: iam.ArnPrincipal) {
    this._allowedArns.push(principal.arn);
  }

  // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-authorization-flow.html#apigateway-authorization-flow-resource-policy-only
  // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-cross-account-example
  private buildPolicy(): iam.PolicyDocument {
    if (this._allowedArns.length === 0) {
      return new iam.PolicyDocument({
        statements: [
          // deny everyone
          new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            actions: ['execute-api:Invoke'],
            principals: [new iam.AnyPrincipal()],
            resources: ['*'],
          }),
        ],
      });
    }
    return new iam.PolicyDocument({
      statements: [
        // explicitly allow the requested arns. note that this still allows same account
        // access in case the principal has the necessary permissions.
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['execute-api:Invoke'],
          principals: this._allowedArns.map(arn => new iam.ArnPrincipal(arn)),
          resources: [
            'execute-api:/prod/POST/allocations',
            'execute-api:/prod/DELETE/allocations/*',
          ],
        }),
        // explicitly deny all other arns to also deny same account access.
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['execute-api:Invoke'],
          principals: [new iam.AnyPrincipal()],
          resources: ['*'],
          conditions: {
            'ForAllValues:StringNotEquals': {
              'aws:PrincipalArn': this._allowedArns,
            },
          },
        }),
      ],
    });
  }
}