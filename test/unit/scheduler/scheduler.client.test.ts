import 'aws-sdk-client-mock-jest';
import { SchedulerClient as SchedulerClientSDK, CreateScheduleCommand } from '@aws-sdk/client-scheduler';
import { mockClient } from 'aws-sdk-client-mock';
import * as envars from '../../../src/envars';
import { SchedulerClient } from '../../../src/scheduler/scheduler.client';
import * as _with from '../../with';

describe('SchedulerClient', () => {

  const schedulerMock = mockClient(SchedulerClientSDK);

  beforeEach(() => {
    schedulerMock.reset();
  });

  describe('scheduleAllocationTimeout', () => {

    test('throws if allocation id is too long', async () => {

      const client = new SchedulerClient({
        roleArn: 'role',
      });

      // this is used in the schedule name, which is limited to 64 characters.
      const allocationId = 'a'.repeat(41);

      await _with.env({ [envars.ALLOCATION_TIMEOUT_DLQ_ARN_ENV]: 'dlq' }, async () => {

        await expect(client.scheduleAllocationTimeout({
          allocationId,
          timeoutDate: new Date(),
          functionArn: 'allocation-arn',
        })).rejects.toThrow('too long');

      });
    });

    test('create a one time scheduler', async () => {

      const client = new SchedulerClient({
        roleArn: 'role',
      });
      const timeoutDate = new Date();
      const allocationId = 'abcdef';

      await _with.env({ [envars.ALLOCATION_TIMEOUT_DLQ_ARN_ENV]: 'dlq' }, async () => {
        await client.scheduleAllocationTimeout({ allocationId, timeoutDate, functionArn: 'allocation-arn' });
      });

      expect(schedulerMock).toHaveReceivedCommandTimes(CreateScheduleCommand, 1);
      expect(schedulerMock).toHaveReceivedCommandWith(CreateScheduleCommand, {
        ActionAfterCompletion: 'DELETE',
        Description: `Enforces timeout for allocation ${allocationId}`,
        FlexibleTimeWindow: { Mode: 'OFF' },
        Name: `atmosphere.timeout.aloc_${allocationId}`,
        ScheduleExpression: `at(${timeoutDate.toISOString().slice(0, 19)})`,
        ScheduleExpressionTimezone: 'UTC',
        Target: {
          Arn: 'allocation-arn',
          DeadLetterConfig: {
            Arn: 'dlq',
          },
          Input: `{"allocationId":"${allocationId}"}`,
          RoleArn: 'role',
        },
      });


    });

  });

  describe('scheduleCleanupTimeout', () => {

    test('throws if account-region is too long', async () => {

      const client = new SchedulerClient({
        roleArn: 'role',
      });

      // this is used in the schedule name, which is limited to 64 characters.
      const allocationId = 'a'.repeat(41);

      await _with.env({ [envars.CLEANUP_TIMEOUT_DLQ_ARN_ENV]: 'dlq' }, async () => {
        await expect(client.scheduleCleanupTimeout({
          allocationId: allocationId,
          account: '1111',
          region: 'us-east-1',
          timeoutDate: new Date(),
          functionArn: 'cleanup-arn',
        })).rejects.toThrow('too long');
      });

    });

    test('create a one time scheduler', async () => {

      const client = new SchedulerClient({
        roleArn: 'role',
      });
      const timeoutDate = new Date();
      const account = '1111';
      const region = 'us-east-1';

      await _with.env({ [envars.CLEANUP_TIMEOUT_DLQ_ARN_ENV]: 'dlq' }, async () => {
        await client.scheduleCleanupTimeout({ allocationId: 'id', account, region, timeoutDate, functionArn: 'cleanup-arn' });
      });

      expect(schedulerMock).toHaveReceivedCommandTimes(CreateScheduleCommand, 1);
      expect(schedulerMock).toHaveReceivedCommandWith(CreateScheduleCommand, {
        ActionAfterCompletion: 'DELETE',
        Description: 'Enforces cleanup for allocation id',
        FlexibleTimeWindow: { Mode: 'OFF' },
        Name: 'atmosphere.timeout.clean_id',
        ScheduleExpression: `at(${timeoutDate.toISOString().slice(0, 19)})`,
        ScheduleExpressionTimezone: 'UTC',
        Target: {
          Arn: 'cleanup-arn',
          DeadLetterConfig: {
            Arn: 'dlq',
          },
          Input: `{\"allocationId\":\"id\",\"account\":\"${account}\",\"region\":\"${region}\"}`,
          RoleArn: 'role',
        },
      });


    });

  });

});