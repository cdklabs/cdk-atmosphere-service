// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Environment } from '../config';
import { ConfigurationClient } from '../config/configuration.client';
import { env } from '../consts';
import { AllocationsClient, InvalidInputError } from '../storage/allocations.client';
import { EnvironmentAlreadyAcquiredError, EnvironmentsClient } from '../storage/environments.client';

const allocations = new AllocationsClient(requireEnv(env.ALLOCATIONS_TABLE_NAME_ENV));
const environments = new EnvironmentsClient(requireEnv(env.ENVIRONMENTS_TABLE_NAME_ENV));
const configuration = new ConfigurationClient({
  bucket: requireEnv(env.CONFIGURATION_BUCKET_ENV),
  key: requireEnv(env.CONFIGURATION_KEY_ENV),
});

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

interface AllocationRequest {
  readonly pool: string;
  readonly requester: string;
}

interface AllocationResponse {
  readonly id: string;
  readonly environment: Environment;
  readonly credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  try {

    console.log('Parsing request body');
    const request = parseRequestBody(event.body);

    console.log(`Acquiring environment from pool '${request.pool}'`);
    const environment = await acquireEnvironment(request.pool);

    console.log(`Starting allocation of 'aws://${environment.account}/${environment.region}'`);
    const id = await startAllocation(environment, request.requester);

    console.log(`Allocation '${id}' started successfully`);

    const response: AllocationResponse = {
      id,
      environment,
      credentials: {
        accessKeyId: 'TODO',
        secretAccessKey: 'TODO',
        sessionToken: 'TODO',
      },
    };

    // TODO - create the allocation timeout event

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (e: any) {
    console.error(e);
    return {
      statusCode: e instanceof ProxyError ? e.statusCode : 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function parseRequestBody(body: string | null): AllocationRequest {

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

async function acquireEnvironment(pool: string): Promise<Environment> {

  const candidates = await configuration.listEnvironments({ pool });
  console.log(`Found ${candidates.length} environments in pool '${pool}'`);
  for (const canditate of candidates) {
    try {
      console.log(`Acquiring environment 'aws://${canditate.account}/${canditate.region}'...`);
      await environments.acquire(canditate.account, canditate.region);
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

async function startAllocation(environment: Environment, requester: string): Promise<string> {
  try {
    const id = await allocations.start({
      account: environment.account,
      region: environment.region,
      pool: environment.pool,
      requester,
    });

    return id;
  } catch (e: any) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}