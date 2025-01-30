import { Unit } from 'aws-embedded-metrics';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import * as envars from '../envars';
import { AllocationLogger } from '../logging';
import { PoolAwareMetricsLogger, RuntimeMetrics } from '../metrics';
import { Allocation, AllocationAlreadyEndedError, InvalidInputError } from '../storage/allocations.client';

// an hour should plenty to clean one environment
const MAX_CLEANUP_TIMEOUT_SECONDS = 60 * 60;

class ProxyError extends Error {
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export interface DeallocateRequest {
  readonly outcome: string;

  // honestly this is just so that we can easily write timeout
  // integration tests.
  readonly cleanupDurationSeconds?: number;
}

export interface DeallocateResponse {
  /**
   * How many seconds should the cleanup task run before timing out.
   *
   * Negative number means the cleanup will not run because the allocation has already ended.
   */
  readonly cleanupDurationSeconds: number;
}

export const METRIC_NAME = 'deallocate';
export const METRIC_DIMENSION_STATUS_CODE = 'statusCode';
export const METRIC_DIMENSION_OUTCOME = 'outcome';

const clients = RuntimeClients.getOrCreate();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  return RuntimeMetrics.scoped(async (metrics) => {

    try {
      const response = await doHandler(event, metrics);
      metrics.putDimensions({ [METRIC_DIMENSION_STATUS_CODE]: response.statusCode.toString() });
      return response;
    } finally {
      metrics.delegate.putMetric(METRIC_NAME, 1, Unit.Count);
    }

  });

}

export async function doHandler(event: APIGatewayProxyEvent, metrics: PoolAwareMetricsLogger): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));

  const id = (event.pathParameters ?? {}).id;
  if (!id) {
    return failure(400, 'Missing \'id\' path parameter');
  }

  const log = new AllocationLogger({ id, component: 'deallocate' });

  try {

    const request = parseRequestBody(event.body);

    const cleanupDurationSeconds = request.cleanupDurationSeconds ?? MAX_CLEANUP_TIMEOUT_SECONDS;
    if (cleanupDurationSeconds > MAX_CLEANUP_TIMEOUT_SECONDS) {
      throw new ProxyError(400, `Maximum cleanup timeout is ${MAX_CLEANUP_TIMEOUT_SECONDS} seconds`);
    }

    const cleanupTimeoutDate = new Date(Date.now() + 1000 * cleanupDurationSeconds);

    log.info(`Ending allocation with outcome: ${request.outcome}`);
    const allocation = await endAllocation(id, request.outcome);

    log.setPool(allocation.pool);
    metrics.setPool(allocation.pool);
    metrics.putDimensions({ [METRIC_DIMENSION_OUTCOME]: request.outcome });

    log.info(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: envars.Envars.required(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
    });

    log.info(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients.environments.cleaning(id, allocation.account, allocation.region);
    const taskInstanceArn = await clients.cleanup.start({ allocation, timeoutSeconds: cleanupDurationSeconds });

    log.info(`Successfully started cleanup task: ${taskInstanceArn}`);

    return success({ cleanupDurationSeconds });
  } catch (e: any) {
    if (e instanceof AllocationAlreadyEndedError) {
      // expected because deallocation can be requested either
      // by the timeout event or explicitly by the user.
      log.info(`Returning success because: ${e.message}`);
      return success({ cleanupDurationSeconds: -1 });
    }
    log.error(e);
    const statusCode = e instanceof ProxyError ? e.statusCode : 500;
    return failure(statusCode, e.message);
  }
}

function success(body: any) {
  return { statusCode: 200, body: JSON.stringify(body) };
}

function failure(statusCode: number, message: string) {
  return { statusCode: statusCode, body: JSON.stringify({ message }) };
}

function parseRequestBody(body: string | null): DeallocateRequest {

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
