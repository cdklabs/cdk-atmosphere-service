import * as cdk from 'aws-cdk-lib';
import { AtmosphereIntegTest } from '../service.integ';

const dir = 'allocation-timeout';

const app = new cdk.App();
const stack = new cdk.Stack(app, `atmosphere-integ-${dir}`);

new AtmosphereIntegTest(stack, 'AtmosphereIntegTest', {
  pools: { release: ['us-west-2'] },
  dir,
});