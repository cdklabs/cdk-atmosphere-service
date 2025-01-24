import { MetricsLogger, Unit, Configuration } from 'aws-embedded-metrics';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RuntimeClients } from '../clients';
import * as envars from '../envars';
import { AllocationLogger } from '../logging';
import { METRIC_DIMENSION_VALUE, METRICS_DIMENSION_POOL, RuntimeMetrics } from '../metrics';
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

export const METRICS_NAMESPACE = RuntimeMetrics.namespace('Deallocate');
export const METRIC_NAME_OUTCOME = 'outcome';

const clients = RuntimeClients.getOrCreate();

Configuration.namespace = METRICS_NAMESPACE;

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));

  return RuntimeMetrics.scope((metrics) => async () => {

    const id = event.pathParameters?.id;
    if (!id) {
      return failure(400, 'Missing \'id\' path parameter');
    }

    if (!event.body) {
      return failure(400, 'Request body not found');
    }

    const request = JSON.parse(event.body);
    if (!request.outcome) {
      return failure(400, '\'outcome\' must be provided in the request body');
    }

    try {
      return await doHandler(id, request, metrics);
    } catch (e: any) {
      const statusCode = e instanceof ProxyError ? e.statusCode : 500;
      return failure(statusCode, e.message);
    }

  })();

}

export async function doHandler(allocationId: string, request: DeallocateRequest, metrics: MetricsLogger): Promise<APIGatewayProxyResult> {

  const log = new AllocationLogger({ id: allocationId, component: 'deallocate' });

  try {

    const cleanupDurationSeconds = request.cleanupDurationSeconds ?? MAX_CLEANUP_TIMEOUT_SECONDS;
    if (cleanupDurationSeconds > MAX_CLEANUP_TIMEOUT_SECONDS) {
      throw new ProxyError(400, `Maximum cleanup timeout is ${MAX_CLEANUP_TIMEOUT_SECONDS} seconds`);
    }

    const cleanupTimeoutDate = new Date(Date.now() + 1000 * cleanupDurationSeconds);

    log.info(`Ending allocation with outcome: ${request.outcome}`);
    const allocation = await endAllocation(allocationId, request.outcome);

    metrics.setDimensions(metricDimensionsOutcome(allocation.pool, request.outcome));
    metrics.putMetric(METRIC_NAME_OUTCOME, 1, Unit.Count);

    log.info(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: envars.Envars.required(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
    });

    log.info(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients.environments.cleaning(allocationId, allocation.account, allocation.region);
    const taskInstanceArn = await clients.cleanup.start({ allocation, timeoutSeconds: cleanupDurationSeconds });

    log.info(`Successfully started cleanup task: ${taskInstanceArn}`);

    return success(200, { cleanupDurationSeconds });
  } catch (e: any) {
    if (e instanceof AllocationAlreadyEndedError) {
      // expected because deallocation can be requested either
      // by the timeout event or explicitly by the user.
      log.info(`Returning success because: ${e.message}`);
      return success(200, { cleanupDurationSeconds: -1 });
    }
    log.error(e);
    throw e;
  }
}

export function metricDimensionsOutcome(pool: string, outcome: string) {
  return {
    [METRICS_DIMENSION_POOL]: pool,
    [METRIC_DIMENSION_VALUE]: outcome,
  };
}

function success(statusCode: number, body: any) {
  return { statusCode: statusCode, body: JSON.stringify(body) };
}

function failure(statusCode: number, message: string) {
  return { statusCode: statusCode, body: JSON.stringify({ message }) };
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
