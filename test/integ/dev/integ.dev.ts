import { AtmosphereIntegTest } from '../service.integ';

new AtmosphereIntegTest({
  pools: { release: ['eu-central-1'] },
  dir: 'dev',
});