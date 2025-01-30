import { DynamoDBClient, UpdateItemCommand, PutItemCommand, DeleteItemCommand, ConditionalCheckFailedException, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { EnvironmentAlreadyAcquiredError, EnvironmentAlreadyCleaningError, EnvironmentAlreadyDirtyError, EnvironmentAlreadyInUseError, EnvironmentAlreadyReallocated, EnvironmentAlreadyReleasedError, EnvironmentNotFound, EnvironmentsClient } from '../../../src/storage/environments.client';
import 'aws-sdk-client-mock-jest';

describe('EnvironmentsClient', () => {

  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('scan', () => {

    test('retrives all items', async () => {

      const client = new EnvironmentsClient('table');

      ddbMock.on(ScanCommand)
        .resolvesOnce({
          Items: [
            {
              account: { S: '1111' },
              region: { S: 'us-east-1' },
              status: { S: 'in-use' },
              allocation: { S: 'id' },
            },
          ],
          LastEvaluatedKey: { account: { S: '1111' }, region: { S: 'us-east-1' } },
        })
        .resolvesOnce({
          Items: [
            {
              account: { S: '2222' },
              region: { S: 'us-east-1' },
              status: { S: 'in-use' },
              allocation: { S: 'id' },
            },
          ],
        });

      const envs = await client.scan();
      expect(ddbMock).toHaveReceivedCommandTimes(ScanCommand, 2);
      expect(envs).toHaveLength(2);

    });
  });

  describe('get', () => {

    test('fetches from the databse', async () => {

      const client = new EnvironmentsClient('table');

      ddbMock.on(GetItemCommand).resolves({
        Item: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
          status: { S: 'in-use' },
          allocation: { S: 'id' },
        },
      });

      const environment = await client.get('1111', 'us-east-1');

      expect(environment).toEqual({
        account: '1111',
        region: 'us-east-1',
        status: 'in-use',
        allocation: 'id',
      });

    });

    test('throws if doesnt exist', async () => {

      const client = new EnvironmentsClient('table');

      ddbMock.on(GetItemCommand).resolves({ Item: undefined });

      await expect(client.get('1111', 'us-east-1')).rejects.toThrow(EnvironmentNotFound);

    });

  });

  describe('acquire', () => {

    test('re-throws on unexpected error', async () => {

      ddbMock.on(PutItemCommand).rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.acquire('id', '1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already acquired', async () => {

      ddbMock.on(PutItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.acquire('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyAcquiredError);

    });

    test('inserts a new item to the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.acquire('id', '1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      expect(ddbMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
      expect(ddbMock.commandCall(0, PutItemCommand).args[0].input).toMatchInlineSnapshot(`
{
  "ConditionExpression": "attribute_not_exists(#account) AND attribute_not_exists(#region)",
  "ExpressionAttributeNames": {
    "#account": "account",
    "#region": "region",
  },
  "Item": {
    "account": {
      "S": "1111",
    },
    "allocation": {
      "S": "id",
    },
    "region": {
      "S": "us-east-1",
    },
    "status": {
      "S": "in-use",
    },
  },
  "TableName": "table",
}
`);

    });

  });

  describe('release', () => {

    test('re-throws on unexpected error', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already released', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReleasedError);

    });

    test('throws explicit error when an environment is dirty', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'dirty' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyDirtyError);

    });

    test('throws explicit error when an environment is in-use', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'in-use' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyInUseError);

    });

    test('throws unexpected error when an environment is in unexpected status', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'unexpected' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow('Unexpected status for environment aws://1111/us-east-1: unexpected');

    });

    test('re-throws if environment doesnt have a status', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {},
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow(ConditionalCheckFailedException);

    });

    test('throws explicit error when an environment is already reallocated', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            allocation: { S: 'old-id' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReallocated);

    });

    test('deletes an item from the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.release('id', '1111', 'us-east-1');

      expect(ddbMock).toHaveReceivedCommandTimes(DeleteItemCommand, 1);
      expect(ddbMock.commandCall(0, DeleteItemCommand).args[0].input).toMatchInlineSnapshot(`
{
  "ConditionExpression": "attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value AND #status = :expected_status_value",
  "ExpressionAttributeNames": {
    "#account": "account",
    "#allocation": "allocation",
    "#region": "region",
    "#status": "status",
  },
  "ExpressionAttributeValues": {
    ":allocation_value": {
      "S": "id",
    },
    ":expected_status_value": {
      "S": "cleaning",
    },
  },
  "Key": {
    "account": {
      "S": "1111",
    },
    "region": {
      "S": "us-east-1",
    },
  },
  "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
  "TableName": "table",
}
`);

    });

  });

  describe('cleaning', () => {

    test('re-throws on unexpected error', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.cleaning('id', '1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already cleaning', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'cleaning' },
            allocation: { S: 'id' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.cleaning('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyCleaningError);

    });

    test('throws explicit error when an environment is already released', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.cleaning('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReleasedError);

    });

    test('sets the status to cleaning', async () => {

      const client = new EnvironmentsClient('table');
      await client.cleaning('id', '1111', 'us-east-1');

      expect(ddbMock).toHaveReceivedCommandTimes(UpdateItemCommand, 1);

      // kind of a silly assertion but there's not much more we can in unit tests
      // at least it being a snapshot, its easy to update.
      expect(ddbMock.commandCall(0, UpdateItemCommand).args[0].input).toMatchInlineSnapshot(`
{
  "ConditionExpression": "#allocation = :allocation_value AND #status <> :status_value",
  "ExpressionAttributeNames": {
    "#allocation": "allocation",
    "#status": "status",
  },
  "ExpressionAttributeValues": {
    ":allocation_value": {
      "S": "id",
    },
    ":status_value": {
      "S": "cleaning",
    },
  },
  "Key": {
    "account": {
      "S": "1111",
    },
    "region": {
      "S": "us-east-1",
    },
  },
  "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
  "TableName": "table",
  "UpdateExpression": "SET #status = :status_value",
}
`);

    });

  });

  describe('dirty', () => {

    test('re-throws on unexpected error', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('id', '1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already dirty', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'dirty' },
            allocation: { S: 'id' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyDirtyError);

    });

    test('throws explicit error when an environment is already reallocated', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
          Item: {
            status: { S: 'dirty' },
            allocation: { S: 'old-id' },
          },
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReallocated);

    });

    test('throws explicit error when an environment is already released', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('id', '1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReleasedError);

    });

    test('sets the status to dirty', async () => {

      const client = new EnvironmentsClient('table');
      await client.dirty('id', '1111', 'us-east-1');

      expect(ddbMock).toHaveReceivedCommandTimes(UpdateItemCommand, 1);

      // kind of a silly assertion but there's not much more we can in unit tests
      // at least it being a snapshot, its easy to update.
      expect(ddbMock.commandCall(0, UpdateItemCommand).args[0].input).toMatchInlineSnapshot(`
{
  "ConditionExpression": "#allocation = :allocation_value AND #status <> :status_value",
  "ExpressionAttributeNames": {
    "#allocation": "allocation",
    "#status": "status",
  },
  "ExpressionAttributeValues": {
    ":allocation_value": {
      "S": "id",
    },
    ":status_value": {
      "S": "dirty",
    },
  },
  "Key": {
    "account": {
      "S": "1111",
    },
    "region": {
      "S": "us-east-1",
    },
  },
  "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
  "TableName": "table",
  "UpdateExpression": "SET #status = :status_value",
}
`);

    });

  });

});