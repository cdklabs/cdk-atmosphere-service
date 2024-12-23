// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { env } from '../consts';
import { Allocation, AllocationAlreadyEndedError, AllocationsClient, InvalidInputError } from '../storage/allocations.client';
import { EnvironmentsClient } from '../storage/environments.client';

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

interface DeallocationRequest {
  readonly id: string;
  readonly outcome: string;
}

const allocations = new AllocationsClient(requireEnv(env.ALLOCATIONS_TABLE_NAME_ENV));
const environments = new EnvironmentsClient(requireEnv(env.ENVIRONMENTS_TABLE_NAME_ENV));

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  try {
    console.log('Parsing request body');
    const request = parseRequestBody(event.body);

    console.log(`Ending allocation '${request.id}' with outcome: ${request.outcome}`);
    const allocation = await endAllocation(request.id, request.outcome);

    console.log(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await environments.cleaning(allocation.account, allocation.region);

    // TODO - trigger cleanup task
    // TODO - create cleanup timeout event

    return success();
  } catch (e: any) {
    console.error(e);

    if (e instanceof AllocationAlreadyEndedError) {
      // expected because deallocation can be requested either
      // by the timeout event or explicitly by the user.
      return success();
    }
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

function parseRequestBody(body: string | null): DeallocationRequest {

  if (!body) {
    throw new ProxyError(400, 'Request body not found');
  }

  const parsed = JSON.parse(body);
  if (!parsed.id) {
    throw new ProxyError(400, '\'id\' must be provided in the request body');
  }
  if (!parsed.outcome) {
    throw new ProxyError(400, '\'outcome\' must be provided in the request body');
  }

  return parsed;
}

async function endAllocation(id: string, outcome: string): Promise<Allocation> {
  try {
    return await allocations.end({ id, outcome });
  } catch (e: any) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}

function success() {
  return {
    statusCode: 200,
    // we currently don't need a response body for a
    // succesfull dellocation
    body: JSON.stringify({}),
  };
}