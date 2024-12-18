import { DynamoDBClient, UpdateItemCommand, PutItemCommand, DeleteItemCommand, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { EnvironmentAlreadyAcquiredError, EnvironmentAlreadyCleaningError, EnvironmentAlreadyDirtyError, EnvironmentAlreadyReleasedError, EnvironmentsClient } from '../../src/storage/environments.client';
import 'aws-sdk-client-mock-jest';

describe('EnvironmentsClient', () => {

  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('acquire', () => {

    test('re-throws on unexpected error', async () => {

      ddbMock.on(PutItemCommand).rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.acquire('1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already acquired', async () => {

      ddbMock.on(PutItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.acquire('1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyAcquiredError);

    });

    test('inserts a new item to the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.acquire('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: 'attribute_not_exists(#account) AND attribute_not_exists(#region)',
        ExpressionAttributeNames: {
          '#region': 'region',
          '#account': 'account',
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

    test('re-throws on unexpected error', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already released', async () => {

      ddbMock.on(DeleteItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.release('1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyReleasedError);

    });

    test('deletes an item from the table', async () => {

      const client = new EnvironmentsClient('table');
      await client.release('1111', 'us-east-1');

      // kind of a silly assertion but there's not much more we can in unit tests
      const expected = {
        ConditionExpression: 'attribute_exists(#account) AND attribute_exists(#region)',
        ExpressionAttributeNames: {
          '#region': 'region',
          '#account': 'account',
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

    test('re-throws on unexpected error', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.cleaning('1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already cleaning', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.cleaning('1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyCleaningError);

    });

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

    test('re-throws on unexpected error', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new Error('unexpected'));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('1111', 'us-east-1')).rejects.toThrow('unexpected');

    });

    test('throws explicit error when an environment is already dirty', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new EnvironmentsClient('table');
      await expect(() => client.dirty('1111', 'us-east-1')).rejects.toThrow(EnvironmentAlreadyDirtyError);

    });

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