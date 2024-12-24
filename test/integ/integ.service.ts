// eslint-disable-next-line import/no-extraneous-dependencies
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { ConfigurationData, Environment } from '../../src/config/configuration';
import { AtmosphereService } from '../../src/service';

export class DestroyAspect implements cdk.IAspect {

  visit(node: IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }

}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-service-stack');

const adminRole = new iam.Role(stack, 'Admin', {
  assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
});

const environment: Environment = {
  account: cdk.Aws.ACCOUNT_ID,
  region: 'us-west-2',
  pool: 'release',
  adminRoleArn: adminRole.roleArn,
};

const data: ConfigurationData = {
  environments: [environment],
};

const service = new AtmosphereService(stack, 'AtmosphereService', {
  config: data,
});

cdk.Aspects.of(service).add(new DestroyAspect());

const integ = new IntegTest(app, 'integ-service-test', {
  testCases: [stack],
  assertionStack: new cdk.Stack(app, 'integ-service-stack-assertions'),
});

const allocationsResource = service.endpoint.api.root.getResource('allocations')!;
const allocationResource = allocationsResource.getResource('{id}')!;

const allocate = integ.assertions.awsApiCall('@aws-sdk/client-api-gateway', 'TestInvokeMethodCommand', {
  restApiId: service.endpoint.api.restApiId,
  resourceId: allocationsResource.resourceId,
  httpMethod: 'POST',
  pathWithQueryString: '/allocations',
  body: JSON.stringify({ pool: 'release', requester: 'user1' }),
}, ['body']);

// see https://github.com/aws/aws-cdk/issues/32635
allocate.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'apigateway:POST',
  Resource: [`arn:aws:apigateway:${cdk.Aws.REGION}::/restapis/${service.endpoint.api.restApiId}/resources/${allocationsResource.resourceId}/methods/POST`],
});


const deallocate = integ.assertions.awsApiCall('@aws-sdk/client-api-gateway', 'TestInvokeMethodCommand', {
  restApiId: service.endpoint.api.restApiId,
  resourceId: allocationResource.resourceId,
  httpMethod: 'DELETE',
  pathWithQueryString: `/allocations/${allocate.getAttString('body.id')}`,
  body: JSON.stringify({ outcome: 'success' }),
}, ['body']);

// see https://github.com/aws/aws-cdk/issues/32635
deallocate.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'apigateway:POST',
  Resource: [`arn:aws:apigateway:${cdk.Aws.REGION}::/restapis/${service.endpoint.api.restApiId}/resources/${allocationResource.resourceId}/methods/DELETE`],
});
