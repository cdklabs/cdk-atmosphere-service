import { AtmosphereIntegTest } from '../atmosphere.integ';

new AtmosphereIntegTest({
  pools: { release: ['eu-central-1'] },
  dir: 'unauthorized-role-access',
  allowAccess: false,
});
