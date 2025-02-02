// eslint-disable-next-line import/no-extraneous-dependencies
import * as crypto from 'crypto';
import { STS } from '@aws-sdk/client-sts';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuntimeClients } from '../clients';
import type { Environment } from '../config';
import * as envars from '../envars';
import { Logger } from '../logging';
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

const clients = RuntimeClients.getOrCreate();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));

  const allocationId = crypto.randomUUID();

  let request;
  try {
    request = parseRequestBody(event.body);
  } catch (e: any) {
    return failure(e);
  }

  const log = new Logger({ allocationId: allocationId, pool: request.pool, component: 'allocate' });
  return safeDoHandler(allocationId, request, log);

}

async function safeDoHandler(allocationId: string, request: AllocateRequest, log: Logger) {
  try {
    return await doHandler(allocationId, request, log);
  } catch (e: any) {
    log.error(e);
    return failure(e);
  }
}

async function doHandler(allocationId: string, request: AllocateRequest, log: Logger): Promise<APIGatewayProxyResult> {
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
  return success(response);

}

function parseRequestBody(body: string | null): AllocateRequest {

  if (!body) {
    throw new ProxyError(400, 'Request body not found');
  }

  const parsed = JSON.parse(body);
  if (!parsed.pool) {
    throw new ProxyError(400, '\'pool\' must be provided in the request body');
  }
  if (!parsed.requester) {
    throw new ProxyError(400, '\'requester\' must be provided in the request body');
  }

  return parsed;
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

function success(body: any) {
  return { statusCode: 200, body: JSON.stringify(body) };
}

function failure(e: any) {
  const statusCode = e instanceof ProxyError ? e.statusCode : 500;
  return { statusCode: statusCode, body: JSON.stringify({ message: e.message }) };
}