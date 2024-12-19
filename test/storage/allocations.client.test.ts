import { ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { AllocationAlreadyEndedError, AllocationsClient } from '../../src/storage/allocations.client';
import 'aws-sdk-client-mock-jest';

describe('AllocationsClient', () => {

  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('start', () => {

    test('inserts a new item to the table', async () => {

      jest.useFakeTimers();

      const now = new Date();
      const sixMonthsFromNow = new Date(now.getTime() + 26 * 7 * 24 * 60 * 60 * 1000);

      const client = new AllocationsClient('table');
      const id = await client.start({ account: '1111', region: 'us-east-1', requester: 'user1', pool: 'canary' });

      const expected = {
        Item: {
          account: { S: '1111' },
          id: { S: id },
          region: { S: 'us-east-1' },
          pool: { S: 'canary' },
          requester: { S: 'user1' },
          start: { S: now.toISOString() },
          ttl: { N: `${Math.floor(sixMonthsFromNow.getTime() / 1000)}` },
        },
        TableName: 'table',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(PutItemCommand, expected);


    });

  });

  describe('end', () => {

    test('throws if an attribute doesnt exist in the response', async () => {

      ddbMock.on(UpdateItemCommand).resolves({
        Attributes: {
          // missing account attribute
          region: { S: 'us-east-1' },
          pool: { S: 'canary' },
          start: { S: '2022-01-01T00:00:00.000Z' },
          end: { S: '2022-01-02T00:00:00.000Z' },
          requester: { S: 'user1' },
          id: { S: '1234' },
          outcome: { S: 'fail' },
        },
      });

      const client = new AllocationsClient('table');
      await expect(client.end({ id: '1234', outcome: 'fail' })).rejects.toThrow('Attribute \'account\' not foun');

    });

    test('throws if an attribute doesnt have a value', async () => {

      ddbMock.on(UpdateItemCommand).resolves({
        Attributes: {
          account: { S: undefined as unknown as string },
          region: { S: 'us-east-1' },
          pool: { S: 'canary' },
          start: { S: '2022-01-01T00:00:00.000Z' },
          end: { S: '2022-01-02T00:00:00.000Z' },
          requester: { S: 'user1' },
          id: { S: '1234' },
          outcome: { S: 'fail' },
        },
      });

      const client = new AllocationsClient('table');
      await expect(client.end({ id: '1234', outcome: 'fail' })).rejects.toThrow('Attribute \'account\' does not have a value');

    });

    test('throws if an response doesnt have attributes', async () => {

      ddbMock.on(UpdateItemCommand).resolves({});

      const client = new AllocationsClient('table');
      await expect(client.end({ id: '1234', outcome: 'fail' })).rejects.toThrow('Unable to retrieve item attributes');

    });

    test('throws explicit error when an allocation is already ended', async () => {

      ddbMock.on(UpdateItemCommand)
        .rejectsOnce(new ConditionalCheckFailedException({
          $metadata: {},
          message: 'The conditional request failed',
        }));

      const client = new AllocationsClient('table');
      await expect(() => client.end({ id: '1234', outcome: 'outcome' })).rejects.toThrow(AllocationAlreadyEndedError);

    });

    test('updates the item in the table', async () => {

      jest.useFakeTimers();

      ddbMock.on(UpdateItemCommand).resolves({
        Attributes: {
          account: { S: '1111' },
          region: { S: 'us-east-1' },
          pool: { S: 'canary' },
          start: { S: '2022-01-01T00:00:00.000Z' },
          end: { S: '2022-01-02T00:00:00.000Z' },
          requester: { S: 'user1' },
          id: { S: '1234' },
          outcome: { S: 'fail' },
        },
      });

      const client = new AllocationsClient('table');
      const allocation = await client.end({ id: '1234', outcome: 'fail' });

      expect(allocation).toEqual({
        account: '1111',
        pool: 'canary',
        end: '2022-01-02T00:00:00.000Z',
        id: '1234',
        outcome: 'fail',
        region: 'us-east-1',
        requester: 'user1',
        start: '2022-01-01T00:00:00.000Z',
      });

      const expected = {
        ConditionExpression: 'attribute_not_exists(#end) AND attribute_not_exists(#outcome)',
        ExpressionAttributeNames: { '#end': 'end', '#outcome': 'outcome' },
        ExpressionAttributeValues: {
          ':end': { S: new Date().toISOString() },
          ':outcome': { S: 'fail' },
        },
        Key: {
          id: { S: '1234' },
        },
        ReturnValues: 'ALL_NEW',
        TableName: 'table',
        UpdateExpression: 'SET #end = :end, #outcome = :outcome',
      };

      expect(ddbMock).toHaveReceivedCommandTimes(UpdateItemCommand, 1);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateItemCommand, expected);

    });
  });
});