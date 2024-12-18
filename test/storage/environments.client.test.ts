import { DynamoDBClient, UpdateItemCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { EnvironmentsClient } from '../../src/storage/environments.client';
import 'aws-sdk-client-mock-jest';

describe('EnvironmentsClient', () => {

  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('acquire', () => {

    test('inserts a new item to the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.acquire('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: 'attribute_not_exists(account) AND attribute_not_exists(#region)',
        ExpressionAttributeNames: {
          '#region': 'region',
        },
        Item: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
          status: { S: 'in-use' },
        },
        TableName: 'table',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(PutItemCommand, expected);

    });

  });

  describe('release', () => {

    test('deletes an item from the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.release('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: 'attribute_exists(account) AND attribute_exists(#region)',
        ExpressionAttributeNames: {
          '#region': 'region',
        },
        Key: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
        },
        TableName: 'table',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(DeleteItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(DeleteItemCommand, expected);

    });

  });

  describe('cleaning', () => {

    test('sets the status to cleaning', async () => {

      const client = new EnvironmentsClient('table');
      await client.cleaning('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: '#status <> :status_value',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status_value': { S: 'cleaning' } },
        Key: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
        },
        TableName: 'table',
        UpdateExpression: 'SET #status = :status_value',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(UpdateItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateItemCommand, expected);

    });

  });

  describe('dirty', () => {

    test('sets the status to dirty', async () => {

      const client = new EnvironmentsClient('table');
      await client.dirty('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: '#status <> :status_value',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status_value': { S: 'dirty' } },
        Key: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
        },
        TableName: 'table',
        UpdateExpression: 'SET #status = :status_value',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(UpdateItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateItemCommand, expected);

    });

  });

});