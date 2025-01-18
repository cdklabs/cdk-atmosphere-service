import { ConditionalCheckFailedException, DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { AllocationAlreadyEndedError, AllocationNotFoundError, AllocationsClient, InvalidInputError } from '../../../src/storage/allocations.client';
import 'aws-sdk-client-mock-jest';

describe('AllocationsClient', () => {

  const ddbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('get', () => {

    test('retrieves an element from the db', async () => {

      const client = new AllocationsClient('table');
      ddbMock.on(GetItemCommand).resolves({
        Item: {
          account: { S: '1111' },
          outcome: { S: 'success' },
          id: { S: 'id' },
          region: { S: 'us-east-1' },
          pool: { S: 'canary' },
          requester: { S: 'user1' },
          start: { S: '2022-01-01T00:00:00.000Z' },
          end: { S: '2022-01-01T01:00:00.000Z' },
          ttl: { N: '1640995200' },
        },
      });

      const allocation = await client.get('id');

      expect(allocation).toEqual({
        account: '1111',
        id: 'id',
        region: 'us-east-1',
        pool: 'canary',
        requester: 'user1',
        start: '2022-01-01T00:00:00.000Z',
        end: '2022-01-01T01:00:00.000Z',
        outcome: 'success',
      });

      expect(ddbMock).toHaveReceivedCommandWith(GetItemCommand, {
        TableName: 'table',
        Key: {
          id: { S: 'id' },
        },
      });

    });

    test('throws an error if doesnt exist', async () => {

      const client = new AllocationsClient('table');
      ddbMock.on(GetItemCommand).resolves({
        Item: undefined,
      });

      await expect(client.get('id')).rejects.toThrow(AllocationNotFoundError);

    });


  });

  describe('start', () => {

    test('throws if requester exceeds max length', async () => {

      const client = new AllocationsClient('table');
      await expect(client.start({
        id: 'id',
        account: '1111',
        region: 'us-east-1',
        requester: 'a'.repeat(1025),
        pool: 'canary',
      })).rejects.toThrow(InvalidInputError);

    });

    test('inserts a new item to the table', async () => {

      jest.useFakeTimers();

      const now = new Date();
      const sixMonthsFromNow = new Date(now.getTime() + 26 * 7 * 24 * 60 * 60 * 1000);

      const client = new AllocationsClient('table');
      const id = 'id';
      await client.start({ id, account: '1111', region: 'us-east-1', requester: 'user1', pool: 'canary' });

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

    test('throws if outcome exceeds max length', async () => {

      const client = new AllocationsClient('table');
      await expect(client.end({
        id: '1234',
        outcome: 'a'.repeat(101),
      })).rejects.toThrow(InvalidInputError);

    });

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
      await expect(client.end({ id: '1234', outcome: 'fail' })).rejects.toThrow('Attribute \'account\' not found');

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