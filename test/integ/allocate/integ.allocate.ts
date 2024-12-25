// eslint-disable-next-line import/no-extraneous-dependencies
import * as cdk from 'aws-cdk-lib';
import { AtmosphereIntegTest } from '../test';

const dir = 'allocate';

const app = new cdk.App();
const stack = new cdk.Stack(app, `atmosphere-integ-${dir}-stack`);

new AtmosphereIntegTest(stack, 'AtmosphereAllocate', {
  pools: { release: ['us-west-2'] },
  dir,
});
