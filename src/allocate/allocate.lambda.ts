// eslint-disable-next-line import/no-extraneous-dependencies
import { STS } from '@aws-sdk/client-sts';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { RuntimeClients } from '../clients';
import type { Environment } from '../config';
import { InvalidInputError } from '../storage/allocations.client';
import { EnvironmentAlreadyAcquiredError } from '../storage/environments.client';

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export interface AllocationRequest {
  readonly pool: string;
  readonly requester: string;
}

interface Credentials {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken: string;
}

interface AllocationResponse {
  readonly id: string;
  readonly environment: Environment;
  readonly credentials: Credentials;
}

const clients = RuntimeClients.getOrCreate();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  try {

    console.log('Parsing request body');
    const request = parseRequestBody(event.body);

    const allocationId = uuidv4();

    console.log(`Acquiring environment from pool '${request.pool}'`);
    const environment = await acquireEnvironment(allocationId, request.pool);

    console.log(`Starting allocation of 'aws://${environment.account}/${environment.region}'`);
    await startAllocation(allocationId, environment, request.requester);

    console.log(`Grabbing credentials to aws://${environment.account}/${environment.region} using role: ${environment.adminRoleArn}`);
    const credentials = await grabCredentials(allocationId, environment);

    console.log(`Allocation '${allocationId}' started successfully`);

    const response: AllocationResponse = { id: allocationId, environment, credentials };

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
