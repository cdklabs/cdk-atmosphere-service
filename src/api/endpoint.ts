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
   * Hosted zone that provides DNS resolution for the endpoint custom domain.
   * Domain FQDN will be the same as the hosted zone name.
   *
   * If this not specified, a custom domain will not be created. Note that since
   * the default execute-api endpoint is disabled, this will render the service
   * inaccessible for HTTP calls.
   *
   * @default - no custom domain is created and the service endpoint is not accessible.
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

    const policy = props.allowedPrincipals ? this.allowOnlyPolicy(props.allowedPrincipals) : this.denyAllPolicy();

    // Create the API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      description: 'RESTful endpoint for the Atmosphere service',
      restApiName: 'Atmosphere',
      policy,
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      disableExecuteApiEndpoint: true,
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

  private denyAllPolicy(): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['execute-api:Invoke'],
          principals: [new iam.AnyPrincipal()],
          resources: ['*'],
        }),
      ],
    });
  }

  private allowOnlyPolicy(allowed: iam.ArnPrincipal[]): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-authorization-flow.html#apigateway-authorization-flow-resource-policy-only
        // see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html#apigateway-resource-policies-cross-account-example
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['execute-api:Invoke'],
          principals: allowed,
          resources: ['execute-api:/prod/POST/allocations', 'execute-api:/prod/DELETE/allocations/*'],
        }),
        // explicit deny to block same account access. this allows us to
        // create both an authorized and unauthorized role within the same account
        // and run integration tests more easily.
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['execute-api:Invoke'],
          principals: [new iam.AnyPrincipal()],
          resources: ['*'],
          conditions: {
            'ForAllValues:ArnNotEquals': {
              'aws:PrincipalArn': allowed.map(p => p.arn),
            },
          },
        }),
      ],
    });
  }
}