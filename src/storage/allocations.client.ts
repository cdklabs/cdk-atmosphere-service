// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';
import { optionalValue, requiredValue } from './dynamo-item';

/**
 * Error thrown if the allocation is already ended.
 *
 */
export class AllocationAlreadyEndedError extends Error {
  constructor(id: string) {
    super(`Allocation ${id} is already ended`);
  }
}

/**
 * Error thrown if the input is invalid.
 */
export class InvalidInputError extends Error {
  constructor(message: string) {
    super(`Invalid input: ${message}`);
  }
}

/**
 * Error thrown if the allocation is not found.
 */
export class AllocationNotFoundError extends Error {
  constructor(id: string) {
    super(`Allocation ${id} not found`);
  }
}

/**
 * Options for `start`.
 */
export interface AllocationsStartOptions {
  /**
   * Allocation id.
   */
  readonly id: string;

  /**
   * Account of the environment to be allocated.
   */
  readonly account: string;

  /**
   * Region of the environment to be allocated.
   */
  readonly region: string;

  /**
   * Which pool the environment belongs to.
   */
  readonly pool: string;

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
   * Which pool the allocation is in.
   */
  readonly pool: string;

  /**
   * Start date of the allocation.
   */
  readonly start: string;

  /**
   * End date of the allocation.
   *
   * @default - undefined (allocation is not ended)
   */
  readonly end?: string;

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
   *
   * @default - undefined (allocation is not ended)
   */
  readonly outcome?: string;

}

/**
 * Client for accessing the allocations table at runtime.
 */
export class AllocationsClient {

  private readonly ddbClient: ddb.DynamoDB;

  constructor(private readonly tableName: string) {
    this.ddbClient = new ddb.DynamoDB({});
  }

  public async scan(from: Date): Promise<Allocation[]> {

    const items: Allocation[] = [];
    let lastEvaluatedKey = undefined;

    do {
      const response: ddb.ScanCommandOutput = await this.ddbClient.scan({
        TableName: this.tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        FilterExpression: '#start > :from',
        ExpressionAttributeNames: {
          '#start': 'start',
        },
        ExpressionAttributeValues: {
          ':from': { S: from.toISOString() },
        },
      });

      for (const item of response.Items ?? []) {
        items.push({
          account: requiredValue('account', item),
          region: requiredValue('region', item),
          pool: requiredValue('pool', item),
          start: requiredValue('start', item),
          requester: requiredValue('requester', item),
          id: requiredValue('id', item),

          // if an allocation is queried before it ended, these attributes
          // will be missing.
          end: optionalValue('end', item),
          outcome: optionalValue('outcome', item),
        });
      }
      lastEvaluatedKey = response.LastEvaluatedKey;

    } while (lastEvaluatedKey);

    return items;

  }

  /**
   * Retrieve an allocation by id.
   */
  public async get(id: string): Promise<Allocation> {
    const response = await this.ddbClient.getItem({
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    });

    if (!response.Item) {
      throw new AllocationNotFoundError(id);
    }

    return {
      account: requiredValue('account', response.Item),
      region: requiredValue('region', response.Item),
      pool: requiredValue('pool', response.Item),
      start: requiredValue('start', response.Item),
      requester: requiredValue('requester', response.Item),
      id: requiredValue('id', response.Item),

      // if an allocation is queried before it ended, these attributes
      // will be missing.
      end: optionalValue('end', response.Item),
      outcome: optionalValue('outcome', response.Item),
    };

  }

  /**
   * Start an allocation for a specific environment. Returns the allocation id.
   */
  public async start(opts: AllocationsStartOptions) {

    if (Buffer.byteLength(opts.requester) > 1024) {
      // this is user controlled so we impose a max length
      throw new InvalidInputError('requester must be less than 1024 bytes');
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const sixMonthsSeconds = 26 * 7 * 24 * 60 * 60;
    await this.ddbClient.putItem({
      TableName: this.tableName,
      Item: {
        id: { S: opts.id },
        account: { S: opts.account },
        region: { S: opts.region },
        pool: { S: opts.pool },
        start: { S: new Date().toISOString() },
        requester: { S: opts.requester },
        ttl: { N: `${nowSeconds + sixMonthsSeconds}` },
      },
    });
  }

  /**
   * End the allocation. Throws if the allocation has already ended.
   */
  public async end(opts: AllocationsEndOptions): Promise<Allocation> {

    if (Buffer.byteLength(opts.outcome) > 100) {
      // this is user controlled so we impose a max length
      throw new InvalidInputError('outcome must be less than 100 bytes');
    }

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
        account: requiredValue('account', response.Attributes),
        region: requiredValue('region', response.Attributes),
        pool: requiredValue('pool', response.Attributes),
        start: requiredValue('start', response.Attributes),
        end: requiredValue('end', response.Attributes),
        requester: requiredValue('requester', response.Attributes),
        id: requiredValue('id', response.Attributes),
        outcome: requiredValue('outcome', response.Attributes),
      };

    } catch (e: any) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new AllocationAlreadyEndedError(opts.id);
      }
      throw e;
    }
  }

}

