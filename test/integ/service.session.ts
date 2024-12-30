import { APIGateway, TestInvokeMethodCommandOutput } from '@aws-sdk/client-api-gateway';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import type { AllocationRequest } from '../../src/allocate/allocate.lambda';
import type { DeallocationRequest } from '../../src/deallocate/deallocate.lambda';

const apigw = new APIGateway();
const dynamo = new DynamoDB();

export const SUCCESS_PAYLOAD = 'OK';

/**
 * Helper class for integration tests that creates a fresh state
 * and exposes methods to invoke various service components.
 */
export class Session {

  /**
   * Run an assertion function in a fresh service state.
   */
  public static async run(assert: (session: Session) => Promise<void>): Promise<string> {
    const session = await this.create();
    await session.clear();
    try {
      await assert(session);
      return SUCCESS_PAYLOAD;
    } finally {
      await session.clear();
    }
  }

  private static async create(): Promise<Session> {
    return new Session(
      await discoverRestApi(),
      await discoverEnvironmentsTable(),
      await discoverAllocationsTable());
  }

  private constructor(
    private readonly api: AtmosphereRestApi,
    private readonly environmentsTableName: string,
    private readonly allocationsTableName: string) {
  }

  public async allocate(body: AllocationRequest): Promise<TestInvokeMethodCommandOutput> {
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationsResourceId,
      httpMethod: 'POST',
      pathWithQueryString: '/allocations',
      body: JSON.stringify(body),
    });
  }

  public async deallocate(id: string, body: DeallocationRequest): Promise<TestInvokeMethodCommandOutput> {
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationResourceId,
      httpMethod: 'DELETE',
      pathWithQueryString: `/allocations/${id}`,
      body: JSON.stringify(body),
    });
  }

  public async fetchEnvironment(account: string, region: string) {
    return dynamo.getItem({
      TableName: this.environmentsTableName,
      Key: {
        account: { S: account },
        region: { S: region },
      },
    });
  }

  public async fetchAllocation(id: string) {
    return dynamo.getItem({
      TableName: this.allocationsTableName,
      Key: { id: { S: id } },
    });
  }

  private async clear() {
    const environments = (await dynamo.scan({ TableName: this.environmentsTableName })).Items ?? [];
    for (const environment of environments) {
      console.log(`Deleting environment aws://${environment.account.S!}/${environment.region.S!}`);
      await dynamo.deleteItem({
        TableName: this.environmentsTableName,
        Key: {
          account: { S: environment.account.S! },
          region: { S: environment.region.S! },
        },
      });
    }

    const allocations = (await dynamo.scan({ TableName: this.allocationsTableName })).Items ?? [];
    for (const allocation of allocations) {
      console.log(`Deleting allocation ${allocation.id.S!}`);
      await dynamo.deleteItem({
        TableName: this.allocationsTableName,
        Key: {
          id: { S: allocation.id.S! },
        },
      });
    }

  }

}


/**
 * Discover our Rest API based on its name.
 */
export async function discoverRestApi(): Promise<AtmosphereRestApi> {

  const api = ((await apigw.getRestApis()).items ?? []).filter(a => a.name === 'Atmosphere')[0];
  if (!api) {
    throw new Error('Unable to discover Atmosphere Rest API. Is it deployed?');
  }

  const resources = (await apigw.getResources({ restApiId: api.id })).items ?? [];
  const allocations = resources.filter(r => r.path === '/allocations')[0];
  const allocation = resources.filter(r => r.path === '/allocations/{id}')[0];

  if (!allocations) {
    throw new Error('Unable to find /allocations resource');
  }

  if (!allocation) {
    throw new Error('Unable to find /allocations/{id} resource');
  }

  return {
    id: api.id!,
    allocationsResourceId: allocations.id!,
    allocationResourceId: allocation.id!,
  };

}

/**
 * Discover the allocations table based on its expected name pattern.
 */
export async function discoverAllocationsTable(): Promise<string> {

  const table = ((await dynamo.listTables({})).TableNames ?? []).filter(t => t.includes('AllocationsTable'))[0];
  if (!table) {
    throw new Error('Unable to discover Atmosphere Allocations table. Is it deployed?');
  }
  return table;
}

/**
 * Discover the environments table based on its expected name pattern.
 */
export async function discoverEnvironmentsTable(): Promise<string> {

  const table = ((await dynamo.listTables({})).TableNames ?? []).filter(t => t.includes('EnvironmentsTable'))[0];
  if (!table) {
    throw new Error('Unable to discover Atmosphere Allocations table. Is it deployed?');
  }
  return table;
}

export interface AtmosphereRestApi {
  readonly id: string;
  readonly allocationsResourceId: string;
  readonly allocationResourceId: string;
}
