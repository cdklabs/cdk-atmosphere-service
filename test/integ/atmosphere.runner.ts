import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { CloudFormation, CloudFormationServiceException, StackResource, waitUntilStackCreateComplete, waitUntilStackDeleteComplete } from '@aws-sdk/client-cloudformation';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import { Scheduler } from '@aws-sdk/client-scheduler';
import * as unzipper from 'unzipper';
import * as envars from '../../src/envars';
import * as _with from '../with';
import { Runtime } from './atmosphere.runtime';

export const SUCCESS_PAYLOAD = 'OK';
export const CDK_ATMOSPHERE_INTEG_STACKS_BUCKET_ENV = 'CDK_ATMOSPHERE_INTEG_STACKS_BUCKET';
export const CDK_ATMOSPHERE_INTEG_STACKS_KEY_ENV = 'CDK_ATMOSPHERE_INTEG_STACKS_KEY';

/**
 * Determines if the assertion is invoked locally or remotely via lambda.
 *
 * - When running `yarn integ:test/* tasks it is set to `false`.
 * - When running `yarn integ:test/*:assert` tasks it defaults to `true`.
 */
export const CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT_ENV = 'CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT';

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

const dynamo = new DynamoDB();
const cfn = new CloudFormation();
const scheduler = new Scheduler();
const s3 = new S3();

/**
 * Helper class for integration tests that creates a fresh state
 * and exposes methods to invoke various service components.
 */
export class Runner {

  /**
   * Run an assertion function in a fresh service state.
   */
  public static async assert(testCase: string, assertion: (runner: Runner) => Promise<void>): Promise<string> {

    if (!Runner.shouldRun(testCase)) {
      return SUCCESS_PAYLOAD;
    }

    const test = await Runner.create(testCase);
    await test.clear();
    try {
      test.log(`🎬 Start <> ${testCase} 🎬`);
      await _with.env(test.vars, async () => assertion(test));
      test.log(`✅ Success <> ${testCase} ✅`);
      return SUCCESS_PAYLOAD;
    } catch (error: any) {
      test.log(`❌ !! Fail <> ${testCase} !! ❌`);
      throw error;
    }
  }

  public static isLocal() {
    const value = process.env[CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT_ENV];
    if (value === 'false' || value === '0') return false;
    return true;
  }

  private static shouldRun(testCase: string) {
    const selection = process.env.CDK_ATMOSPHERE_INTEG_TEST_CASE_SELECTION;
    if (!selection) return true;
    return testCase === selection;
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

  private static async create(testCase: string): Promise<Runner> {

    let envValue: (name: string) => string;

    if (Runner.isLocal()) {

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

    return new Runner({
      [envars.ENDPOINT_URL_ENV]: envValue(envars.ENDPOINT_URL_ENV),
      [envars.ALLOCATIONS_TABLE_NAME_ENV]: envValue(envars.ALLOCATIONS_TABLE_NAME_ENV),
      [envars.ENVIRONMENTS_TABLE_NAME_ENV]: envValue(envars.ENVIRONMENTS_TABLE_NAME_ENV),
      [envars.CONFIGURATION_BUCKET_ENV]: envValue(envars.CONFIGURATION_BUCKET_ENV),
      [envars.CONFIGURATION_KEY_ENV]: envValue(envars.CONFIGURATION_KEY_ENV),
      [envars.ALLOCATION_TIMEOUT_DLQ_ARN_ENV]: envValue(envars.ALLOCATION_TIMEOUT_DLQ_ARN_ENV),
      [envars.CLEANUP_TIMEOUT_DLQ_ARN_ENV]: envValue(envars.CLEANUP_TIMEOUT_DLQ_ARN_ENV),
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
    }, testCase);
  }

  public readonly runtime: Runtime;

  private constructor(
    public readonly vars: envars.EnvironmentVariables,
    private readonly name: string) {
    this.runtime = new Runtime(this.vars);
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
    const templatePath = await this.resolveTemplatePath(opts.templatePath);

    const templateBody = fs.readFileSync(templatePath, { encoding: 'utf-8' });
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

  private async resolveTemplatePath(templatePath: string) {

    const stacksBucket = process.env[CDK_ATMOSPHERE_INTEG_STACKS_BUCKET_ENV];
    const stacksKey = process.env[CDK_ATMOSPHERE_INTEG_STACKS_KEY_ENV];

    if (stacksBucket && stacksKey) {
      // we are running inside a lambda function so need to download and unzip
      // the stack files to a writable lambda location.
      const to = '/tmp/integ-stacks';
      await Runner.unzip(stacksBucket, stacksKey, to);

      // stack files don't preverse their directory structure when uploaded as an asset.
      // so we just use the basename to find the file.
      return path.join(to, path.basename(templatePath));
    }

    // running locally, template path is relative to this directory.
    return path.join(__dirname, templatePath);

  }

  public log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

}

