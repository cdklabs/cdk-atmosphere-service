// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';

/**
 * Client for accessing the environments table at runtime.
 */
export class EnvironmentsClient {

  private readonly ddbClient: ddb.DynamoDB;

  constructor(private readonly tableName: string) {
    this.ddbClient = new ddb.DynamoDB({});
  }

  /**
   * Acquire an environment by inserting a new item into the table.
   * If the environment is already acquired, this will fail.
   */
  public async acquire(account: string, region: string) {
    await this.ddbClient.putItem({
      TableName: this.tableName,
      Item: {
        account: { S: account },
        region: { S: region },
        status: { S: 'in-use' },
      },
      // 'region' is a reserved keyword so we need attribute aliasing.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
      ExpressionAttributeNames: {
        '#region': 'region',
      },
      // ensures insertion.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
      ConditionExpression: 'attribute_not_exists(account) AND attribute_not_exists(#region)',
    });
  }

  /**
   * Release an environment by deleting an item from the table.
   * If the environment is already released, this will fail.
   */
  public async release(account: string, region: string) {
    await this.ddbClient.deleteItem({
      TableName: this.tableName,
      Key: {
        account: { S: account },
        region: { S: region },
      },
      // 'region' is a reserved keyword so we need attribute aliasing.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
      ExpressionAttributeNames: {
        '#region': 'region',
      },
      // ensures deletion.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
      ConditionExpression: 'attribute_exists(account) AND attribute_exists(#region)',
    });
  }

  /**
   * Mark the environment status as 'cleaning'.
   * If the environment is already in a 'cleaning' status, this will fail.
   */
  public async cleaning(account: string, region: string) {
    await this.ddbClient.updateItem({
      TableName: this.tableName,
      Key: {
        account: { S: account },
        region: { S: region },
      },
      // 'status' is a reserved keyword so we need attribute aliasing.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status_value': { S: 'cleaning' },
      },
      UpdateExpression: 'SET #status = :status_value',
      // ensures update.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate
      ConditionExpression: '#status <> :status_value',
    });
  }

  /**
   * Mark the environment status as 'dirty'.
   * If the environment is already in a 'dirty' status, this will fail.
   */
  public async dirty(account: string, region: string) {
    await this.ddbClient.updateItem({
      TableName: this.tableName,
      Key: {
        account: { S: account },
        region: { S: region },
      },
      // 'status' is a reserved keyword so we need attribute aliasing.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status_value': { S: 'dirty' },
      },
      UpdateExpression: 'SET #status = :status_value',
      // ensures update.
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate
      ConditionExpression: '#status <> :status_value',
    });
  }

}