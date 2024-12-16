import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { AtmosphereService } from '../src/service';
import { ConfigurationData } from '../src/config/config';

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

const integ = new IntegTest(app, 'integ-service-test', {
  testCases: [stack],
  assertionStack: new cdk.Stack(app, 'integ-service-stack-assertions')
});

const object = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: service.config.bucket.bucketName,
  Key: service.config.key
});

object.expect(ExpectedResult.objectLike({'Body': JSON.stringify(data)}))