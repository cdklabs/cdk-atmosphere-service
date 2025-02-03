import { APIGateway, TestInvokeMethodCommandOutput } from '@aws-sdk/client-api-gateway';
import { ECS, waitUntilTasksStopped } from '@aws-sdk/client-ecs';
import { Lambda } from '@aws-sdk/client-lambda';
import { AtmosphereClient } from '@cdklabs/cdk-atmosphere-client';
import * as allocate from '../../src/allocate/allocate.lambda';
import * as cleanup from '../../src/cleanup/cleanup.task';
import { RuntimeClients } from '../../src/clients';
import * as deallocate from '../../src/deallocate/deallocate.lambda';
import * as envars from '../../src/envars';
import * as allocationTimeout from '../../src/scheduler/allocation-timeout/allocation-timeout.lambda';
import * as cleanupTimeout from '../../src/scheduler/cleanup-timeout/cleanup-timeout.lambda';
import * as _with from '../with';

export type APIGatewayResponse = Pick<TestInvokeMethodCommandOutput, 'body' | 'status'>;

/**
 * Determines if runtime components are invoked locally or remotely.
 *
 * - When running `yarn integ:test/* tasks it is set to `false`.
 * - When running `yarn integ:test/*:assert` tasks it defaults to `true`.
 */
export const CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME_ENV = 'CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME';

const clients = RuntimeClients.getOrCreate();

export class Runtime {

  public static isLocal() {
    const value = process.env[CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME_ENV];
    if (value === 'false' || value === '0') return false;
    return true;
  }

  private readonly apigw = new APIGateway();
  private readonly lambda = new Lambda();
  private readonly ecs = new ECS();

  public constructor(private readonly vars: envars.EnvironmentVariables) {}

  public async allocate(body: allocate.AllocateRequest): Promise<APIGatewayResponse> {
    const json = JSON.stringify(body);
    const response = Runtime.isLocal() ? await this.allocateLocal(json) : await this.allocateRemote(json);
    return response;
  }

  public async deallocate(id: string, body: deallocate.DeallocateRequest): Promise<APIGatewayResponse> {
    const json = JSON.stringify(body);
    const response = Runtime.isLocal() ? await this.deallocateLocal(id, json) : await this.deallocateRemote(id, json);
    return response;
  }

  public async cleanupTimeout(event: cleanupTimeout.CleanupTimeoutEvent) {
    Runtime.isLocal() ? await this.cleanupTimeoutLocal(event) : await this.cleanupTimeoutRemote(event);
  }

  public async allocationTimeout(event: allocationTimeout.AllocationTimeoutEvent) {
    Runtime.isLocal() ? await this.allocationTimeoutLocal(event) : await this.allocationTimeoutRemote(event);
  }

  /**
   * Perform a cleanup for a specific allocation. When running locally, this will
   * invoke the cleanup task in-process, when running remotely, this will trigger the ECS task.
   */
  public async cleanup(req: cleanup.CleanupRequest) {
    return Runtime.isLocal() ? this.cleanupLocal(req) : this.cleanupRemote(req);
  }

  private async allocationTimeoutLocal(event: allocationTimeout.AllocationTimeoutEvent) {
    const payload = JSON.stringify(event);
    this.log(`Invoking local allocation timeout handler with event: ${payload}`);
    console.log('');
    await _with.env(this.vars, async () => allocationTimeout.handler(event));
    console.log('');
  }

  private async allocationTimeoutRemote(event: allocationTimeout.AllocationTimeoutEvent) {
    const payload = JSON.stringify(event);
    this.log(`Invoking allocation timeout lambda with event: ${payload}`);
    await this.lambda.invoke({
      Payload: payload,
      FunctionName: this.vars[envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV],
      InvocationType: 'RequestResponse',
    });
  }

  private async cleanupTimeoutLocal(event: cleanupTimeout.CleanupTimeoutEvent) {
    const payload = JSON.stringify(event);
    this.log(`Invoking local cleanup timeout handler with event: ${payload}`);
    console.log('');
    await _with.env(this.vars, async () => cleanupTimeout.handler(event));
    console.log('');
  }

  private async cleanupTimeoutRemote(event: cleanupTimeout.CleanupTimeoutEvent) {
    const payload = JSON.stringify(event);
    this.log(`Invoking cleanup timeout lambda with event: ${payload}`);
    await this.lambda.invoke({
      Payload: payload,
      FunctionName: this.vars[envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV],
      InvocationType: 'RequestResponse',
    });
  }

  private async cleanupLocal(req: cleanup.CleanupRequest) {
    this.log(`Invoking local cleanup task handler with body: ${JSON.stringify(req)}`);
    console.log();
    await cleanup.handler(req);
    console.log();
  }

  private async cleanupRemote(req: cleanup.CleanupRequest) {
    this.log(`Starting ECS cleanup task with body: ${JSON.stringify(req)}`);
    const allocation = await clients.allocations.get(req.allocationId);
    const taskInstanceArn = await clients.cleanup.start({
      allocation,
      timeoutSeconds: req.timeoutSeconds,
    });

    this.log(`Waiting for cleanup task '${taskInstanceArn}' to stop`);
    await waitUntilTasksStopped(
      { client: this.ecs, maxWaitTime: 300, minDelay: 1, maxDelay: 1 },
      { cluster: this.vars[envars.CLEANUP_CLUSTER_ARN_ENV], tasks: [taskInstanceArn!] });

  }

  private async deallocateLocal(id: string, jsonBody: string) {

    this.log(`Invoking local deallocate handler for allocation '${id}' with body: ${jsonBody}`);
    console.log();
    const response = await _with.env(this.vars, async () => {
      return deallocate.handler({ body: jsonBody, pathParameters: { id } } as any);
    });
    console.log();
    return { status: response.statusCode, body: response.body };

  }

  private async deallocateRemote(id: string, jsonBody: string) {

    this.log(`Sending deallocation request for allocation '${id}' with body: ${jsonBody}`);
    return this.apigw.testInvokeMethod({
      restApiId: this.vars[envars.REST_API_ID_ENV],
      resourceId: this.vars[envars.ALLOCATION_RESOURCE_ID_ENV],
      httpMethod: 'DELETE',
      pathWithQueryString: `/allocations/${id}`,
      body: jsonBody,
    });

  }

  private async allocateLocal(jsonBody: string) {
    this.log(`Invoking local allocate handler with body: ${jsonBody}`);
    console.log();
    const response = await _with.env(this.vars, async () => {
      return allocate.handler({ body: jsonBody } as any);
    });
    console.log();
    return { status: response.statusCode, body: response.body };
  }

  private async allocateRemote(jsonBody: string) {

    this.log(`Sending allocation request with body: ${jsonBody}`);
    const client = new AtmosphereClient(this.vars[envars.ENDPOINT_URL_ENV]);
    try {
      const allocation = await client.acquire(JSON.parse(jsonBody));
      return { status: 200, body: JSON.stringify(allocation) };
    } catch (e: any) {
      if (e.statusCode) {
        return { status: e.statusCode, body: JSON.stringify({ message: e.message }) };
      }
      throw e;
    }
    // return this.apigw.testInvokeMethod({
    //   restApiId: this.vars[envars.REST_API_ID_ENV],
    //   resourceId: this.vars[envars.ALLOCATIONS_RESOURCE_ID_ENV],
    //   httpMethod: 'POST',
    //   pathWithQueryString: '/allocations',
    //   body: jsonBody,
    // });

  }

  private log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

}