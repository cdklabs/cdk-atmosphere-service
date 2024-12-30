import * as assert from 'assert';
import { APIGateway, TestInvokeMethodCommandOutput } from '@aws-sdk/client-api-gateway';
import { CloudFormation } from '@aws-sdk/client-cloudformation';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import type { AllocationRequest } from '../../src/allocate/allocate.lambda';
import type { DeallocationRequest } from '../../src/deallocate/deallocate.lambda';
import * as envars from '../../src/envars';

const apigw = new APIGateway();
const dynamo = new DynamoDB();
const cfn = new CloudFormation();

export const SUCCESS_PAYLOAD = 'OK';

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
  public static async assert(assertion: (session: Session) => Promise<void>): Promise<string> {
    const session = await this.create();
    await session.clear();
    let failed = false;
    try {
      session.sessionLog('🎬 Start 🎬');
      await assertion(session);
      session.sessionLog('✅ Success ✅');
      return SUCCESS_PAYLOAD;
    } catch (error: any) {
      session.sessionLog('❌ !! Fail !! ❌');
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

  private static async create(): Promise<Session> {

    let envValue: (name: string) => string;

    if (Session.isLocal()) {

      // locally we use dev stack outputs
      const devStack = ((await cfn.describeStacks({ StackName: 'atmosphere-integ-dev' })).Stacks ?? [])[0];
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
      [envars.REST_API_ID_ENV]: envValue(envars.REST_API_ID_ENV),
      [envars.ALLOCATIONS_RESOURCE_ID_ENV]: envValue(envars.ALLOCATIONS_RESOURCE_ID_ENV),
      [envars.ALLOCATION_RESOURCE_ID_ENV]: envValue(envars.ALLOCATION_RESOURCE_ID_ENV),
    });
  }

  private constructor(private readonly vars: envars.EnvironmentVariables) {
    this.sessionLog('Created session with variables:');
    console.log(JSON.stringify(this.vars, null, 2));
  }

  public async allocate(body: AllocationRequest): Promise<TestInvokeMethodCommandOutput> {
    const json = JSON.stringify(body);
    this.log(`Sending allocation request with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[envars.REST_API_ID_ENV],
      resourceId: this.vars[envars.ALLOCATIONS_RESOURCE_ID_ENV],
      httpMethod: 'POST',
      pathWithQueryString: '/allocations',
      body: json,
    });
  }

  public async deallocate(id: string, body: DeallocationRequest): Promise<TestInvokeMethodCommandOutput> {
    const json = JSON.stringify(body);
    this.log(`Sending deallocation request for allocation '${id}' with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[envars.REST_API_ID_ENV],
      resourceId: this.vars[envars.ALLOCATION_RESOURCE_ID_ENV],
      httpMethod: 'DELETE',
      pathWithQueryString: `/allocations/${id}`,
      body: json,
    });
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

  }

  public log(message: string) {
    console.log(`[${new Date().toISOString()}] [assertion] ${message}`);
  }

  private sessionLog(message: string) {
    console.log(`[${new Date().toISOString()}] [session] ${message}`);
  }

}

