import * as cdk from 'aws-cdk-lib';
import { AtmosphereService, Environment } from '../src';
import { DestroyAspect } from './integ/service.integ';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Atmosphere');

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-south-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
];
const adminRoles = [
  { account: '897395725265', adminRole: 'arn:aws:iam::897395725265:role/CDKAtmosphereAdmin' },
  { account: '480359821526', adminRole: 'arn:aws:iam::480359821526:role/CDKAtmosphereAdmin' },
];

const environments: Environment[] = [];

for (const role of adminRoles) {
  for (const region of regions) {
    environments.push({
      account: role.account,
      region,
      adminRoleArn: role.adminRole,
      pool: 'pool-1',
    });
  }
}

new AtmosphereService(stack, 'Service', {
  config: { environments },
});

cdk.Aspects.of(stack).add(new DestroyAspect());