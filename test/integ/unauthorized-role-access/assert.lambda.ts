import * as client from '@cdklabs/cdk-atmosphere-client';
import * as envars from '../../../src/envars';
import { Runner } from '../atmosphere.runner';

export async function handler(_: any) {

  return Runner.assert('endpoint-access-is-denied', async (session: Runner) => {
    const endpoint = session.vars[envars.ENDPOINT_URL_ENV];
    const atmo = new client.AtmosphereClient(endpoint);

    await ensureDenined(async () => atmo.acquire({ pool: 'some-pool', requester: 'unauthorized-role-access-canary', timeoutSeconds: 1 }));
    await ensureDenined(async () => atmo.release('some-id', 'success'));

  });


}

async function ensureDenined(call: () => Promise<any>) {

  try {
    await call();
    throw new Error('Expected service call to fail with 403 status');
  } catch (e: any) {
    if (e instanceof client.ServiceError && e.statusCode === 403) {
      console.log('Receieved exepcted status: 403');
      return;
    }
    throw new Error(`Expected service call to fail with 403 status, but instead got: ${e.message}`);
  }


}

if (Runner.isLocal()) {
  // we don't throw here to allow for a successfull `yarn integ:assert` execution.
  // correctness of this functionality is verified during normal `yarn integ` execution, which runs
  // the assertion remotely.
  console.log(`assertion of test '${__dirname}' cannot be executed locally because it requires running with a specific role. skipping.`);
}

