import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { CloudFormation, CloudFormationServiceException, StackResource, waitUntilStackCreateComplete, waitUntilStackDeleteComplete } from '@aws-sdk/client-cloudformation';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ECS } from '@aws-sdk/client-ecs';
import { S3 } from '@aws-sdk/client-s3';
import { Scheduler } from '@aws-sdk/client-scheduler';
import * as unzipper from 'unzipper';
import * as envars from '../../src/envars';
import * as _with from '../with';
import { Runtime } from './service.runtime';

const dynamo = new DynamoDB();
const cfn = new CloudFormation();
const scheduler = new Scheduler();
const ecs = new ECS();
const s3 = new S3();

export const SUCCESS_PAYLOAD = 'OK';

export interface DeployStackOptions {
  /**
   * Path to the tempalte file. Relative to the 'integ' directory.
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

export interface DestroyStackOptions {
  /**
   * Stack to destroy.
   */
  readonly stackName: string;
  /**
   * Region the stack is deployed to.
   */
  readonly region: string;
}

export interface PutObjectKeyOptions {
  /**
   * Bucket.
   */
  readonly bucketName: string;
  /**
   * Object contents.
   */
  readonly contents: string;
  /**
   * Target key.
   */
  readonly key: string;
}

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
    try {
      session.log(`🎬 Start <> ${name} 🎬`);
      await assertion(session);
      session.log(`✅ Success <> ${name} ✅`);
      return SUCCESS_PAYLOAD;
    } catch (error: any) {
      session.log(`❌ !! Fail <> ${name} !! ❌`);
      throw error;
    }
  }

  private static async unzip(bucket: string, key: string, to: string) {
    const response = await s3.getObject({
      Bucket: bucket,
      Key: key,
    });
    const readableStream = response.Body as Readable;

    await new Promise<void>((resolve, reject) => {
      readableStream
        .pipe(unzipper.Extract({ path: to }))
        .on('close', resolve)
        .on('error', reject);
    });
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

    let stacksBasePath = __dirname;
    const stacksBucket = envars.Envars.optional('CDK_ATMOSPHERE_INTEG_STACKS_BUCKET' as any);
    const stacksKey = envars.Envars.optional('CDK_ATMOSPHERE_INTEG_STACKS_KEY' as any);
    if (stacksBucket && stacksKey) {
      stacksBasePath = '/tmp/stacks';
      await Session.unzip(stacksBucket, stacksKey, stacksBasePath);
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
    }, sessionName, stacksBasePath);
  }

  public readonly runtime: Runtime;

  private constructor(
    private readonly vars: envars.EnvironmentVariables,
    private readonly name: string,
    private readonly stacksBasePath: string) {
    this.runtime = new Runtime(Session.isLocal(), this.vars);
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

  public async fetchStack(name: string, region: string) {
    const cfnRegion = new CloudFormation({ region });
    try {
      const response = await cfnRegion.describeStacks({ StackName: name });
      return response.Stacks?.[0];
    } catch (e: any) {
      if (e instanceof CloudFormationServiceException && e.name === 'ValidationError') {
        // yeap - this means the stack doesn't exist...
        return undefined;
      }
      throw e;
    }
  }

  /**
   * Deploy a stack onto a region and return its name.
   * This will also wait for stack creation to complete.
   */
  public async deployStack(opts: DeployStackOptions): Promise<[string, StackResource[]]> {
    const cfnRegion = new CloudFormation({ region: opts.region });
    const templatePath = this.stacksBasePath === __dirname ? opts.templatePath : path.basename(opts.templatePath);
    const templateBody = fs.readFileSync(path.join(this.stacksBasePath, templatePath), { encoding: 'utf-8' });
    const stackName = `cdk-atmosphere-integ-${this.name}-${path.basename(opts.templatePath).split('.')[0]}`;

    this.log(`Deploying stack '${stackName}' from path '${opts.templatePath}' to region '${opts.region}'`);
    await cfnRegion.createStack({
      StackName: stackName,
      TemplateBody: templateBody,
      EnableTerminationProtection: opts.terminationProtection ?? false,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'],
      OnFailure: 'DO_NOTHING',
      TimeoutInMinutes: opts.timeoutMinutes ?? 10,
    });

    this.log(`Waiting for stack '${stackName}' to be created in region '${opts.region}'`);
    await waitUntilStackCreateComplete(
      { client: cfnRegion, maxWaitTime: 300, minDelay: 5, maxDelay: 5 },
      { StackName: stackName },
    );

    const resources = await cfnRegion.describeStackResources({ StackName: stackName });
    return [stackName, resources.StackResources ?? []];
  }

  public async destroyStack(opts: DestroyStackOptions) {

    const cfnRegion = new CloudFormation({ region: opts.region });

    const stack = ((await cfnRegion.describeStacks({ StackName: opts.stackName })).Stacks ?? [])[0];
    if (stack.StackStatus !== 'DELETE_IN_PROGRESS') {
      const resources = await cfnRegion.describeStackResources({
        StackName: opts.stackName,
      });

      // custom resources deployed as part of test assertion stacks are normally just there
      // for fauly/delay injection. They don't have underlying physical resources, so retaining them
      // doesnt create leakage.
      const retainResources = stack.StackStatus === 'DELETE_FAILED' ? (resources.StackResources ?? [])
        .filter(r =>r.ResourceType === 'AWS::CloudFormation::CustomResource' || r.ResourceStatus?.startsWith('Custom::'))
        .map(r => r.LogicalResourceId!) : undefined;

      this.log(`Destroying stack '${opts.stackName}' in region '${opts.region}'`);
      await cfnRegion.deleteStack({
        StackName: opts.stackName,
        RetainResources: retainResources,
      });
    }

    this.log(`Waiting for stack '${opts.stackName}' to be deleted in region '${opts.region}'`);
    await waitUntilStackDeleteComplete(
      { client: cfnRegion, maxWaitTime: 600, minDelay: 5, maxDelay: 5 },
      { StackName: opts.stackName },
    );
  }

  private async clear() {
    this.log('Clearing state');
    const environments = (await dynamo.scan({ TableName: this.vars[envars.ENVIRONMENTS_TABLE_NAME_ENV] })).Items ?? [];
    for (const environment of environments) {
      this.log(`  » deleting environment aws://${environment.account.S!}/${environment.region.S!}`);
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
      this.log(`  » deleting allocation ${allocation.id.S!}`);
      await dynamo.deleteItem({
        TableName: this.vars[envars.ALLOCATIONS_TABLE_NAME_ENV],
        Key: {
          id: { S: allocation.id.S! },
        },
      });
    }

    const schedules = (await scheduler.listSchedules({})).Schedules ?? [];
    for (const schedule of schedules) {
      this.log(`  » deleting schedule ${schedule.Name!}`);
      await scheduler.deleteSchedule({ Name: schedule.Name! });
    }

  }

  public log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

}

