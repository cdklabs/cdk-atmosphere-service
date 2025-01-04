// eslint-disable-next-line import/no-extraneous-dependencies
import * as cdk from 'aws-cdk-lib';
import { AtmosphereIntegTest } from '../service.integ';

const dir = 'dev';

const app = new cdk.App();
const stack = new cdk.Stack(app, `atmosphere-integ-${dir}`);

new AtmosphereIntegTest(stack, 'AtmosphereIntegTest', {
  pools: { release: ['eu-central-1'] },
  dir,
});