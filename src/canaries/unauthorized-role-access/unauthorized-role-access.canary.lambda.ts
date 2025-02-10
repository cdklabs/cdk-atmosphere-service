import * as client from '@cdklabs/cdk-atmosphere-client';
import { ScheduledEvent } from 'aws-lambda';
import * as envars from '../../envars';

export async function handler(event: ScheduledEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  const endpoint = envars.Envars.required(envars.ENDPOINT_URL_ENV);
  const atmo = new client.AtmosphereClient(endpoint);

  await ensureDenined(async () => atmo.acquire({ pool: 'some-pool', requester: 'unauthorized-role-access-canary', timeoutSeconds: 1 }));
  await ensureDenined(async () => atmo.release('some-id', 'success'));
}

async function ensureDenined(call: () => Promise<any>) {

  try {
    await call();
    throw new Error('Expected service call to fail with 403 status');
  } catch (e: any) {
    if (e instanceof client.ServiceError && e.statusCode === 403) {
      return;
    }
    throw new Error(`Expected service call to fail with 403 status, but instead got: ${e.message}`);
  }


}

void handler({} as any);