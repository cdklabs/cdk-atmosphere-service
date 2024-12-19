// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';

// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';

/**
 * Error thrown if the allocation is already ended.
 */
export class AllocationAlreadyEndedError extends Error {
  constructor(id: string) {
    super(`Allocation ${id} is already ended`);
  }
}

/**
 * Options for `start`.
 */
export interface AllocationsStartOptions {

  /**
   * Account of the environment to be allocated.
   */
  readonly account: string;

  /**
   * Region of the environment to be allocated.
   */
  readonly region: string;

  /**
   * Identifier for the requester.
   */
  readonly requester: string;
}

/**
 * Options for `end`.
 */
export interface AllocationsEndOptions {

  /**
   * Allocation id.
   */
  readonly id: string;

  /**
   * Allocation outcome.
   */
  readonly outcome: string;
}

/**
 * Allocation data after it has ended.
 */
export interface Allocation {

  /**
   * Account of the environment to be allocated.
   */
  readonly account: string;

  /**
   * Region of the environment to be allocated.
   */
  readonly region: string;

  /**
   * Start date of the allocation.
   */
  readonly start: string;

  /**
   * End date of the allocation.
   */
  readonly end: string;

  /**
   * Identifier for the requester.
   */
  readonly requester: string;

  /**
   * Allocation id.
   */
  readonly id: string;

  /**
   * Allocation outcome.
   */
  readonly outcome: string;

}

/**
 * Client for accessing the allocations table at runtime.
 */
export class AllocationsClient {

  private readonly ddbClient: ddb.DynamoDB;

  constructor(private readonly tableName: string) {
    this.ddbClient = new ddb.DynamoDB({});
  }

  /**
   * Start an allocation for a specific environment. Returns the allocation id.
   */
  public async start(opts: AllocationsStartOptions): Promise<string> {
    const uuid = uuidv4();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const sixMonthsSeconds = 26 * 7 * 24 * 60 * 60;
    await this.ddbClient.putItem({
      TableName: this.tableName,
      Item: {
        id: { S: uuid },
        account: { S: opts.account },
        region: { S: opts.region },
        start: { S: new Date().toISOString() },
        requester: { S: opts.requester },
        ttl: { N: `${nowSeconds + sixMonthsSeconds}` },
      },
    });
    return uuid;
  }

  /**
   * End the allocation. Throws if the allocation has already ended.
   */
  public async end(opts: AllocationsEndOptions): Promise<Allocation> {
    try {
      const response = await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          id: { S: opts.id },
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          '#end': 'end',
          '#outcome': 'outcome',
        },
        ExpressionAttributeValues: {
          ':end': { S: new Date().toISOString() },
          ':outcome': { S: opts.outcome },
        },
        UpdateExpression: 'SET #end = :end, #outcome = :outcome',
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: 'attribute_not_exists(#end) AND attribute_not_exists(#outcome)',
        ReturnValues: 'ALL_NEW',
      });

      if (!response.Attributes) {
        throw new Error('Unable to retrieve item attributes');
      }

      return {
        account: value('account', response.Attributes),
        region: value('region', response.Attributes),
        start: value('start', response.Attributes),
        end: value('end', response.Attributes),
        requester: value('requester', response.Attributes),
        id: value('id', response.Attributes),
        outcome: value('outcome', response.Attributes),
      };

    } catch (e: any) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new AllocationAlreadyEndedError(opts.id);
      }
      throw e;
    }
  }

}

function value(name: string, attributes: Record<string, ddb.AttributeValue>) {
  const attribute = attributes[name];
  if (!attribute) {
    throw new Error(`Attribute '${name}' not found`);
  }
  if (attribute.S) {
    return attribute.S;
  }
  throw new Error(`Attribute '${name}' does not have a value`);
}