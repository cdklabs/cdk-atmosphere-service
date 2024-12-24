// eslint-disable-next-line import/no-extraneous-dependencies
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { ConfigurationData } from '../../src/config/configuration';
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

const data: ConfigurationData = {
  environments: [
    {
      account: '1111',
      region: 'us-east-1',
      pool: 'release',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    },
  ],
};

const service = new AtmosphereService(stack, 'AtmosphereService', {
  config: data,
});

cdk.Aspects.of(service).add(new DestroyAspect());

const integ = new IntegTest(app, 'integ-service-test', {
  testCases: [stack],
  assertionStack: new cdk.Stack(app, 'integ-service-stack-assertions'),
});

const object = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: service.config.bucket.bucketName,
  Key: service.config.key,
});

object.expect(ExpectedResult.objectLike({ Body: JSON.stringify(data) }));

integ.assertions.awsApiCall('DynamoDB', 'putItem', {
  TableName: service.environments.table.tableName,
  Item: {
    account: { S: '1111' },
    region: { S: 'us-east-1' },
  },
});

integ.assertions.awsApiCall('DynamoDB', 'putItem', {
  TableName: service.allocations.table.tableName,
  Item: {
    id: { S: 'allocation-id' },
  },
});

const allocationsResource = service.endpoint.api.root.getResource('allocations')!;
const allocationResource = allocationsResource.getResource('{id}')!;

const allocate = integ.assertions.awsApiCall('@aws-sdk/client-api-gateway', 'TestInvokeMethodCommand', {
  restApiId: service.endpoint.api.restApiId,
  resourceId: allocationsResource.resourceId,
  httpMethod: 'POST',
  pathWithQueryString: '/allocations',
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
  pathWithQueryString: '/allocations/dummy',
}, ['body']);

// see https://github.com/aws/aws-cdk/issues/32635
deallocate.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'apigateway:POST',
  Resource: [`arn:aws:apigateway:${cdk.Aws.REGION}::/restapis/${service.endpoint.api.restApiId}/resources/${allocationResource.resourceId}/methods/DELETE`],
});

