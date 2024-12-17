import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { ConfigurationData } from '../src/config/config';
import { AtmosphereService } from '../src/service';
import { IConstruct } from 'constructs';

export class DestroyAspect implements cdk.IAspect {

  visit(node: IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)
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
})

integ.assertions.awsApiCall('DynamoDB', 'putItem', {
  TableName: service.allocations.table.tableName,
  Item: {
    id: { S: 'allocation-id' },
  },
})
