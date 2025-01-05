import { AtmosphereIntegTest } from '../service.integ';

const dir = 'cleanup-timeout';

new AtmosphereIntegTest({
  pools: { release: ['eu-central-1'] },
  dir: 'cleanup-timeout',
});