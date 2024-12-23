import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { AtmosphereService } from '../src/service';

export class DestroyAspect implements cdk.IAspect {

  visit(node: IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }

}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-service-stack');

const service = new AtmosphereService(stack, 'AtmosphereService', {
  config: {
    environments: [
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'release',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
    ],
  },
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

const getEnvStatus = integ.assertions.awsApiCall('DynamoDB', 'getItem', {
  TableName: service.environments.table.tableName,
  Key: {
    account: { S: '1111' },
    region: { S: 'us-east-1' },
  },
});

// first allocate, then check env status
getEnvStatus.node.addDependency(allocate);
getEnvStatus.assertAtPath('Item.status.S', ExpectedResult.stringLikeRegexp('in-use'));

const getAllocation = integ.assertions.awsApiCall('DynamoDB', 'getItem', {
  TableName: service.allocations.table.tableName,
  Key: {
    id: { S: allocate.getAttString('body.id') },
  },
});

// first allocate, then check allocation
getAllocation.node.addDependency(allocate);
getAllocation.assertAtPath('Item.account.S', ExpectedResult.stringLikeRegexp('1111'));
getAllocation.assertAtPath('Item.region.S', ExpectedResult.stringLikeRegexp('us-east-1'));
getAllocation.assertAtPath('Item.requester.S', ExpectedResult.stringLikeRegexp('user1'));
getAllocation.assertAtPath('Item.pool.S', ExpectedResult.stringLikeRegexp('release'));

const deallocate = integ.assertions.awsApiCall('@aws-sdk/client-api-gateway', 'TestInvokeMethodCommand', {
  restApiId: service.endpoint.api.restApiId,
  resourceId: allocationResource.resourceId,
  httpMethod: 'DELETE',
  pathWithQueryString: '/allocations/dummy',
}, ['body']);

// see https://github.com/aws/aws-cdk/issues/32635
deallocate.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'apigateway:POST',
  Resource: [`arn:aws:apigateway:${cdk.Aws.REGION}::/restapis/${service.endpoint.api.restApiId}/resources/${allocationResource.resourceId}/methods/DELETE`],
});
