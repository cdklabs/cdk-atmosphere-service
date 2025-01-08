import 'aws-sdk-client-mock-jest';
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { mockClient } from 'aws-sdk-client-mock';
import { CleanupClient } from '../../../src/cleanup/cleanup.client';

describe('CleanupClient', () => {

  const ecsMock = mockClient(ECSClient);

  beforeEach(() => {
    ecsMock.reset();
  });

  describe('starts', () => {

    test('invokes the ecs task', async () => {

      ecsMock.on(RunTaskCommand).resolves({
        tasks: [{
          taskArn: 'taskArn',
        }],
      });

      const client = new CleanupClient({
        clusterArn: 'cluster',
        taskDefinitionArn: 'task',
        containerName: 'main',
        securityGroupId: 'sec',
        subnetId: 'sub',
      });
      const taskArn = await client.start({
        allocation: {
          account: '1111',
          region: 'us-east-1',
          pool: 'release',
          requester: 'user1',
          outcome: 'outcome',
          id: 'allocation',
          start: 'start',
          end: 'end',
        },
        timeoutSeconds: 30,
      });

      expect(taskArn).toEqual('taskArn');
      expect(ecsMock).toHaveReceivedCommandWith(RunTaskCommand, {
        cluster: 'cluster',
        group: 'aws://1111/us-east-1',
        launchType: 'FARGATE',
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: 'ENABLED',
            securityGroups: ['sec'],
            subnets: ['sub'],
          },
        },
        overrides: {
          containerOverrides: [{
            environment: [{
              name: 'CDK_ATMOSPHERE_RUNTIME_CLEANUP_TASK_ALLOCATION_ID',
              value: 'allocation',
            }, { name: 'CDK_ATMOSPHERE_RUNTIME_CLEANUP_TASK_TIMEOUT_SECONDS', value: '30' }],
            name: 'main',
          }],
        },
        startedBy: 'allocation',
        taskDefinition: 'task',
      });

    });

  });
});