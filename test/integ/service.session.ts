import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { APIGateway, TestInvokeMethodCommandOutput } from '@aws-sdk/client-api-gateway';
import { CloudFormation, paginateDescribeStacks, Stack, waitUntilStackCreateComplete } from '@aws-sdk/client-cloudformation';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ECS } from '@aws-sdk/client-ecs';
import { Scheduler } from '@aws-sdk/client-scheduler';
import type { AllocateRequest } from '../../src/allocate/allocate.lambda';
import * as allocate from '../../src/allocate/allocate.lambda';
import * as deallocate from '../../src/deallocate/deallocate.lambda';
import type { DeallocateRequest } from '../../src/deallocate/deallocate.lambda';
import * as envars from '../../src/envars';
import { EnvironmentsClient } from '../../src/storage/environments.client';
import * as _with from '../with';

const apigw = new APIGateway();
const dynamo = new DynamoDB();
const cfn = new CloudFormation();
const scheduler = new Scheduler();
const ecs = new ECS();

export const SUCCESS_PAYLOAD = 'OK';

export interface DeployOptions {
  /**
   * Path to the tempalte file.
   */
  readonly templatePath: string;
  /**
   * Region to deploy the stack in.
   */
  readonly region: string;
  /**
   * Enable termination protection.
   *
   * @default false
   */
  readonly terminationProtection?: boolean;
  /**
   * How many minutes should CloudFormation wait for the stack to complete creation.
   * If the timeout passes, the stack is placed in `CREATE_FAILED`.
   */
  readonly timeoutMinutes?: number;
}
export type APIGatewayResponse = Pick<TestInvokeMethodCommandOutput, 'body' | 'status'>;

export interface WaitForOptions {
  /**
   * Message to print before starting the waiting loop.
   */
  readonly message?: string;
}

/**
 * Helper class for integration tests that creates a fresh state
 * and exposes methods to invoke various service components.
 */
export class Session {

  /**
   * Running locally or in lambda as part of integ.
   */
  public static isLocal() {
    return process.env.CDK_ATMOSPHERE_INTEG !== 'true';
  }

  /**
   * Run an assertion function in a fresh service state.
   */
  public static async assert(assertion: (session: Session) => Promise<void>, name: string = 'default'): Promise<string> {
    const session = await this.create(name);
    await session.clear();
    let failed = false;
    try {
      session.log('🎬 Start 🎬');
      await assertion(session);
      session.log('✅ Success ✅');
      return SUCCESS_PAYLOAD;
    } catch (error: any) {
      session.log('❌ !! Fail !! ❌');
      failed = true;
      throw error;
    } finally {
      if (failed && Session.isLocal()) {
        session.sessionLog('Not clearing state to help troubleshoot the error');
      } else {
        await session.clear();
      }
    }
  }

  private static async create(sessionName: string): Promise<Session> {

    let envValue: (name: string) => string;

    if (Session.isLocal()) {

      // locally we use dev stack outputs
      const devStack = ((await cfn.describeStacks({ StackName: 'atmosphere-integ-dev-assertions' })).Stacks ?? [])[0];
      assert.ok(devStack, 'Missing dev stack. Deploy by running: \'yarn integ:dev\'');
      envValue = (name: string) => {
        const value = (devStack.Outputs ?? []).find((o: any) => o.OutputKey === name.replace(/_/g, '0'))?.OutputValue;
        assert.ok(value, `Missing output '${name}' from dev stack`);
        return value;
      };

    } else {

      // when deployed we expect it to be in the environment because we add
      // it to the assertion function in our test wrapper.
      envValue = (name: string) => envars.Envars.required(name as any);

    }

    return new Session({
      [envars.ALLOCATIONS_TABLE_NAME_ENV]: envValue(envars.ALLOCATIONS_TABLE_NAME_ENV),
      [envars.ENVIRONMENTS_TABLE_NAME_ENV]: envValue(envars.ENVIRONMENTS_TABLE_NAME_ENV),
      [envars.CONFIGURATION_BUCKET_ENV]: envValue(envars.CONFIGURATION_BUCKET_ENV),
      [envars.CONFIGURATION_KEY_ENV]: envValue(envars.CONFIGURATION_KEY_ENV),
      [envars.SCHEDULER_DLQ_ARN_ENV]: envValue(envars.SCHEDULER_DLQ_ARN_ENV),
      [envars.SCHEDULER_ROLE_ARN_ENV]: envValue(envars.SCHEDULER_ROLE_ARN_ENV),
      [envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: envValue(envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
      [envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: envValue(envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV),
      [envars.REST_API_ID_ENV]: envValue(envars.REST_API_ID_ENV),
      [envars.ALLOCATIONS_RESOURCE_ID_ENV]: envValue(envars.ALLOCATIONS_RESOURCE_ID_ENV),
      [envars.ALLOCATION_RESOURCE_ID_ENV]: envValue(envars.ALLOCATION_RESOURCE_ID_ENV),
      [envars.DEALLOCATE_FUNCTION_NAME_ENV]: envValue(envars.DEALLOCATE_FUNCTION_NAME_ENV),
      [envars.CLEANUP_CLUSTER_ARN_ENV]: envValue(envars.CLEANUP_CLUSTER_ARN_ENV),
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: envValue(envars.CLEANUP_TASK_DEFINITION_ARN_ENV),
      [envars.CLEANUP_TASK_SUBNET_ID_ENV]: envValue(envars.CLEANUP_TASK_SUBNET_ID_ENV),
      [envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: envValue(envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV),
      [envars.CLEANUP_TASK_CONTAINER_NAME_ENV]: envValue(envars.CLEANUP_TASK_CONTAINER_NAME_ENV),
    }, sessionName);
  }

  public readonly environments: EnvironmentsClient;

  private constructor(private readonly vars: envars.EnvironmentVariables, private readonly name: string) {
    this.sessionLog(`Created session with variables: ${JSON.stringify(this.vars, null, 2)}`);
    this.environments = new EnvironmentsClient(this.vars[envars.ENVIRONMENTS_TABLE_NAME_ENV]);
  }

  public async allocate(body: AllocateRequest): Promise<[APIGatewayResponse, Promise<void>]> {
    const json = JSON.stringify(body);
    const response = Session.isLocal() ? await this.allocateLocal(json) : await this.allocateRemote(json);

    if (response.status !== 200) {
      return [response, Promise.resolve()];
    }

    const responseBody = JSON.parse(response.body!);
    const region = responseBody.environment.region;
    if (region) {
      // lets not run tests on dirty environments.
      await this.assertCleanRegion(region);
    }

    return [response, this.waitForAllocationTimeout(responseBody)];
  }

  public async deallocate(id: string, body: DeallocateRequest): Promise<[APIGatewayResponse, Promise<void>]> {
    const json = JSON.stringify(body);

    const response = Session.isLocal() ? await this.deallocateLocal(id, json) : await this.deallocateRemote(id, json);

    if (response.status !== 200) {
      return [response, Promise.resolve()];
    }

    const responseBody = JSON.parse(response.body!);
    return [response, this.waitForCleanupTimeout(id, responseBody)];

  }

  public async fetchEnvironment(account: string, region: string) {
    return dynamo.getItem({
      TableName: this.vars[envars.ENVIRONMENTS_TABLE_NAME_ENV],
      Key: {
        account: { S: account },
        region: { S: region },
      },
    });
  }

  public async fetchAllocation(id: string) {
    return dynamo.getItem({
      TableName: this.vars[envars.ALLOCATIONS_TABLE_NAME_ENV],
      Key: { id: { S: id } },
    });
  }

  public async fetchAllocationTimeoutSchedule(allocationId: string) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.aloc_${allocationId}`,
    });
    return response.Schedules?.[0];
  }

  public async fetchCleanupTimeoutSchedule(allocationId: string) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.clean_${allocationId}`,
    });
    return response.Schedules?.[0];
  }

  public async fetchStoppedCleanupTask(allocationId: string) {
    const response = await ecs.listTasks({
      cluster: this.vars[envars.CLEANUP_CLUSTER_ARN_ENV],
      startedBy: allocationId,
      desiredStatus: 'STOPPED',
    });

    const taskArns = response.taskArns ?? [];

    if (taskArns.length === 0) {
      return undefined;
    }

    const tasks = await ecs.describeTasks({
      cluster: this.vars[envars.CLEANUP_CLUSTER_ARN_ENV],
      tasks: taskArns,
    });
    return tasks.tasks![0];
  }

  public async waitFor(condition: () => Promise<Boolean>, timeoutSeconds: number, opts: WaitForOptions = {}) {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    while (true) {
      const finish = await condition();
      if (finish) {
        return;
      }
      const elapsed = Date.now() - startTime;
      assert.ok(elapsed < timeoutMs, `Timeout after ${timeoutSeconds} seconds waiting for ${opts.message}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  public async okFor(condition: () => Promise<Boolean>, timeoutSeconds: number) {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    while (true) {
      const result = await condition();
      assert.ok(result);

      const elapsed = Date.now() - startTime;
      if (elapsed >= timeoutMs) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  public async deploy(opts: DeployOptions) {
    const cfnRegion = new CloudFormation({ region: opts.region });
    const templateBody = fs.readFileSync(path.join(__dirname, opts.templatePath), { encoding: 'utf-8' });
    const stackName = path.basename(opts.templatePath).split('.')[0];

    this.log(`Deploying stack '${stackName}' from path '${opts.templatePath}' to region '${opts.region}'`);
    await cfnRegion.createStack({
      StackName: stackName,
      TemplateBody: templateBody,
      EnableTerminationProtection: opts.terminationProtection ?? false,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'],
      OnFailure: 'DO_NOTHING',
      TimeoutInMinutes: opts.timeoutMinutes ?? 5,
    });

    this.log(`Waiting for stack '${stackName}' to be created in region '${opts.region}'`);
    await waitUntilStackCreateComplete(
      { client: cfnRegion, maxWaitTime: 300 },
      { StackName: stackName },
    );
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
    return apigw.testInvokeMethod({
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
    return apigw.testInvokeMethod({
      restApiId: this.vars[envars.REST_API_ID_ENV],
      resourceId: this.vars[envars.ALLOCATIONS_RESOURCE_ID_ENV],
      httpMethod: 'POST',
      pathWithQueryString: '/allocations',
      body: jsonBody,
    });

  }

  private async assertCleanRegion(region: string) {
    this.sessionLog(`Scanning stacks in region ${region}`);
    const stacksPaginator = paginateDescribeStacks({ client: new CloudFormation({ region }), pageSize: 10 }, {});
    const stacks: Stack[] = [];

    for await (const page of stacksPaginator) {
      for (const stack of page.Stacks ?? []) {
        this.sessionLog(`  » found stack ${stack.StackName}`);
        stacks.push(stack);
      }
    }

    if (stacks.length === 0) {
      this.sessionLog(`Region '${region}' is clean. Proceeding.`);
      return;
    }

    // we don't delete because it may contain resources the developer cares about.
    // so we just fail and ask for a manual cleanup
    assert.fail(`Region '${region}' it not clean. Please either delete all stacks or remove '${region}' from environment pools.`);

  }

  private async clear() {
    this.sessionLog('Clearing state');
    const environments = (await dynamo.scan({ TableName: this.vars[envars.ENVIRONMENTS_TABLE_NAME_ENV] })).Items ?? [];
    for (const environment of environments) {
      this.sessionLog(`  » deleting environment aws://${environment.account.S!}/${environment.region.S!}`);
      await dynamo.deleteItem({
        TableName: this.vars[envars.ENVIRONMENTS_TABLE_NAME_ENV],
        Key: {
          account: { S: environment.account.S! },
          region: { S: environment.region.S! },
        },
      });
    }

    const allocations = (await dynamo.scan({ TableName: this.vars[envars.ALLOCATIONS_TABLE_NAME_ENV] })).Items ?? [];
    for (const allocation of allocations) {
      this.sessionLog(`  » deleting allocation ${allocation.id.S!}`);
      await dynamo.deleteItem({
        TableName: this.vars[envars.ALLOCATIONS_TABLE_NAME_ENV],
        Key: {
          id: { S: allocation.id.S! },
        },
      });
    }

    const schedules = (await scheduler.listSchedules({})).Schedules ?? [];
    for (const schedule of schedules) {
      this.sessionLog(`  » deleting schedule ${schedule.Name!}`);
      await scheduler.deleteSchedule({ Name: schedule.Name! });
    }

  }

  private async waitForAllocationTimeout(response: allocate.AllocateResponse): Promise<void> {

    // give a 1 minute spair because event bridge schedules have a 1 minute granularity
    const waitTimeSeconds = response.durationSeconds + 60;

    // wait for the schedule to trigger
    await this.waitFor(async () => (await this.fetchAllocationTimeoutSchedule(response.id)) === undefined, waitTimeSeconds, {
      message: `allocation ${response.id} to timeout`,
    });

    // wait another 5 seconds for the schedule target to actually do its thing
    return new Promise(resolve => setTimeout(resolve, 5000));

  }

  private async waitForCleanupTimeout(id: string, response: deallocate.DeallocateResponse): Promise<void> {

    // give a 1 minute spair because event bridge schedules have a 1 minute granularity
    const waitTimeSeconds = response.cleanupDurationSeconds + 60;

    // wait for the schedule to trigger
    await this.waitFor(async () => (await this.fetchCleanupTimeoutSchedule(id)) === undefined, waitTimeSeconds, {
      message: `cleanup of allocation ${id} to timeout`,
    });

    // wait another 5 seconds for the schedule target to actually do its thing
    return new Promise(resolve => setTimeout(resolve, 5000));

  }

  public log(message: string) {
    console.log(`[${new Date().toISOString()}] [assertion] [${this.name}] ${message}`);
  }

  private sessionLog(message: string) {
    console.log(`[${new Date().toISOString()}] [session] [${this.name}] ${message}`);
  }

}

