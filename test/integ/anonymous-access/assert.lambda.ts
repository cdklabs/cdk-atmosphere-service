import * as envars from '../../../src/envars';
import { Runner } from '../atmosphere.runner';

export async function handler(_: any) {

  return Runner.assert('endpoint-access-is-denied', async (session: Runner) => {
    const endpoint = session.vars[envars.ENDPOINT_URL_ENV];

    await ensureDenined(endpoint, 'POST', 'allocations');
    await ensureDenined(endpoint, 'DELETE', 'allocations/some-id');

  });


}

async function ensureDenined(endpoint: string, method: string, path: string) {

  const url = `${endpoint}${path}`;
  console.log(`Executing HTTP request: ${method} ${url}`);
  const response = await fetch(url, { method });

  if (response.status !== 403) {
    throw new Error(`Unexpected status on request ${method} ${url} (expected 403, got ${response.status})`);
  }

  console.log('Receieved exepcted status: 403');

}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}
