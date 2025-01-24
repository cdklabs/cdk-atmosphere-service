// eslint-disable-next-line import/no-extraneous-dependencies
import { STS } from '@aws-sdk/client-sts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration, Unit } from 'aws-embedded-metrics';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { RuntimeClients } from '../clients';
import type { Environment } from '../config';
import * as envars from '../envars';
import { AllocationLogger } from '../logging';
import { RuntimeMetrics } from '../metrics';
import { InvalidInputError } from '../storage/allocations.client';
import { EnvironmentAlreadyAcquiredError } from '../storage/environments.client';

// this will be the duration of the credentials being passed
// the the caller. currently, it cannot be more than 1 hour because of role chaining.
// TODO - how can we avoid role chaining?
const MAX_ALLOCATION_DURATION_SECONDS = 60 * 60;

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export interface AllocateRequest {
  readonly pool: string;
  readonly requester: string;

  // honestly this is just so that we can easily write timeout
  // integration tests.
  readonly durationSeconds?: number;
}

export interface Credentials {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken: string;
}

export interface AllocateResponse {
  readonly id: string;
  readonly environment: Environment;
  readonly credentials: Credentials;
  readonly durationSeconds: number;
}

export const METRICS_NAMESPACE = RuntimeMetrics.namespace('Allocate');

export function metricName(pool: string, statusCode: number) {
  return `${pool}.${statusCode}`;
}

const clients = RuntimeClients.getOrCreate();

Configuration.namespace = METRICS_NAMESPACE;

export async function handler(event: APIGatewayProxyEvent) {

  return RuntimeMetrics.scope((metrics) => async () => {

    console.log('Event:', JSON.stringify(event, null, 2));

    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Request body not found' }) };
    }

    const request = JSON.parse(event.body);
    if (!request.pool) {
      return { statusCode: 400, body: JSON.stringify({ message: '\'pool\' must be provided in the request body' }) };
    }
    if (!request.requester) {
      return { statusCode: 400, body: JSON.stringify({ message: '\'requester\' must be provided in the request body' }) };
    }

    metrics.setDimensions({});

    try {
      const result = await doHandler(request);
      metrics.putMetric(metricName(request.pool, result.statusCode), 1, Unit.Count);
      return result;
    } catch (e: any) {
      const statusCode = e instanceof ProxyError ? e.statusCode : 500;
      metrics.putMetric(metricName(request.pool, statusCode), 1, Unit.Count);
      return { statusCode, body: JSON.stringify({ message: e.message }) };
    }

  })();

};

async function doHandler(request: AllocateRequest): Promise<APIGatewayProxyResult> {

  const allocationId = uuidv4();
  const log = new AllocationLogger({ id: allocationId, component: 'allocate' });

  try {

    const durationSeconds = request.durationSeconds ?? MAX_ALLOCATION_DURATION_SECONDS;
    if (durationSeconds > MAX_ALLOCATION_DURATION_SECONDS) {
      throw new ProxyError(400, `Maximum allocation duration is ${MAX_ALLOCATION_DURATION_SECONDS} seconds`);
    }

    const timeoutDate = new Date(Date.now() + 1000 * durationSeconds);

    log.info(`Acquiring environment from pool '${request.pool}'`);
    const environment = await acquireEnvironment(allocationId, request.pool);

    log.info(`Starting allocation of 'aws://${environment.account}/${environment.region}'`);
    await startAllocation(allocationId, environment, request.requester);

    log.info(`Grabbing credentials to aws://${environment.account}/${environment.region} using role: ${environment.adminRoleArn}`);
    const credentials = await grabCredentials(allocationId, environment);

    log.info('Allocation started successfully');

    const response: AllocateResponse = { id: allocationId, environment, credentials, durationSeconds };

    log.info(`Scheduling allocation timeout to ${timeoutDate}`);
    await clients.scheduler.scheduleAllocationTimeout({
      allocationId,
      timeoutDate,
      functionArn: envars.Envars.required(envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV),
    });
    log.info('Done');

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (e: any) {
    log.error(e);
    throw e;
  }
}

async function acquireEnvironment(allocaionId: string, pool: string): Promise<Environment> {

  const candidates = await clients.configuration.listEnvironments({ pool });
  console.log(`Found ${candidates.length} environments in pool '${pool}'`);
  for (const canditate of candidates) {
    try {
      console.log(`Acquiring environment 'aws://${canditate.account}/${canditate.region}'...`);
      await clients.environments.acquire(allocaionId, canditate.account, canditate.region);
      return canditate;
    } catch (e: any) {
      if (e instanceof EnvironmentAlreadyAcquiredError) {
        console.log(`Environment 'aws://${canditate.account}/${canditate.region}' already acquired. Trying the next one.`);
        continue;
      }
      throw e;
    }
  }

  throw new ProxyError(423, `No environments available in pool '${pool}'`);
}

async function startAllocation(id: string, environment: Environment, requester: string) {
  try {
    await clients.allocations.start({
      id,
      account: environment.account,
      region: environment.region,
      pool: environment.pool,
      requester,
    });
  } catch (e: any) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}

async function grabCredentials(id: string, environment: Environment): Promise<Credentials> {
  const sts = new STS();
  const assumed = await sts.assumeRole({
    RoleArn: environment.adminRoleArn,
    RoleSessionName: `atmosphere.allocation.${id}`,
  });

  if (!assumed.Credentials) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return credentials`);
  }

  if (!assumed.Credentials.AccessKeyId) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return an access key id`);
  }

  if (!assumed.Credentials.SecretAccessKey) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return a secret access key`);
  }

  if (!assumed.Credentials.SessionToken) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return a session token`);
  }

  return {
    accessKeyId: assumed.Credentials.AccessKeyId,
    secretAccessKey: assumed.Credentials.SecretAccessKey,
    sessionToken: assumed.Credentials.SessionToken,
  };
}
