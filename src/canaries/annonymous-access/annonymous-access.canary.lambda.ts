// eslint-disable-next-line import/no-extraneous-dependencies
import { ScheduledEvent } from 'aws-lambda';
import * as envars from '../../envars';

export async function hanlder(event: ScheduledEvent) {
  console.log('Event:', JSON.stringify(event, null, 2));

  await ensureUnauthorized('POST', '/allocations');
  await ensureUnauthorized('DELETE', '/allocations/some-id');
}

async function ensureUnauthorized(method: string, path: string) {

  const endpoint = envars.Envars.required(envars.ENDPOINT_URL_ENV);
  const url = `${endpoint}${path}`;
  console.log(`Executing HTTP request: ${method} ${url}`);
  const response = await fetch(url, { method });

  if (response.status !== 403) {
    throw new Error(`Unexpected status on request ${method} ${url} (expected 403, got ${response.status})`);
  }

}