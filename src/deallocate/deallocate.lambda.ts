import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import * as envars from '../envars';
import { Allocation, AllocationAlreadyEndedError, InvalidInputError } from '../storage/allocations.client';

// an hour should plenty to clean one environment
const MAX_CLEANUP_TIMEOUT_SECONDS = 60 * 60;

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export interface DeallocationRequest {
  readonly outcome: string;

  // honestly this is just so that we can easily write timeout
  // integration tests.
  readonly cleanupDurationSeconds?: number;
}

const clients = RuntimeClients.getOrCreate();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  try {

    const id = (event.pathParameters ?? {}).id;
    if (!id) {
      throw new ProxyError(400, 'Missing \'id\' path parameter');
    }
    console.log(`Extracted allocation id from path: ${id}`);

    console.log('Parsing request body');
    const request = parseRequestBody(event.body);

    const cleanupDurationSeconds = request.cleanupDurationSeconds ?? MAX_CLEANUP_TIMEOUT_SECONDS;
    if (cleanupDurationSeconds > MAX_CLEANUP_TIMEOUT_SECONDS) {
      throw new ProxyError(400, `Maximum cleanup timeout is ${MAX_CLEANUP_TIMEOUT_SECONDS} seconds`);
    }

    const cleanupTimeoutDate = new Date(Date.now() + 1000 * cleanupDurationSeconds);

    console.log(`Ending allocation '${id}' with outcome: ${request.outcome}`);
    const allocation = await endAllocation(id, request.outcome);

    console.log(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}' for allocation '${id}'`);
    await clients.environments.cleaning(id, allocation.account, allocation.region);

    console.log(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: envars.Envars.required(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
    });

    console.log(`Starting cleanup process for environment 'aws://${allocation.account}/${allocation.region}`);
    const taskInstanceArn = await clients.cleanup.start({ allocation, timeoutSeconds: cleanupDurationSeconds });
    console.log(`Cleanup process started successfully. Task instance arn: ${taskInstanceArn}`);

    return success();
  } catch (e: any) {

    if (e instanceof AllocationAlreadyEndedError) {
      // expected because deallocation can be requested either
      // by the timeout event or explicitly by the user.
      console.log(`Returning success because: ${e.message}`);
      return success();
    }

    console.error(e);

    return {
      statusCode: e instanceof ProxyError ? e.statusCode : 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
}

function parseRequestBody(body: string | null): DeallocationRequest {

  if (!body) {
    throw new ProxyError(400, 'Request body not found');
  }

  const parsed = JSON.parse(body);
  if (!parsed.outcome) {
    throw new ProxyError(400, '\'outcome\' must be provided in the request body');
  }

  return parsed;
}

async function endAllocation(id: string, outcome: string): Promise<Allocation> {
  try {
    return await clients.allocations.end({ id, outcome });
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