// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import { Allocation, AllocationAlreadyEndedError, InvalidInputError } from '../storage/allocations.client';

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

interface DeallocationRequest {
  readonly outcome: string;
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

    console.log(`Ending allocation '${id}' with outcome: ${request.outcome}`);
    const allocation = await endAllocation(id, request.outcome);

    console.log(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients.environments.cleaning(allocation.account, allocation.region);

    // TODO - trigger cleanup task
    // TODO - create cleanup timeout event

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