// eslint-disable-next-line import/no-extraneous-dependencies
import { ECS } from '@aws-sdk/client-ecs';
import * as envars from '../envars';
import type { Allocation } from '../storage/allocations.client';


/**
 * Options for `start`.
 */
export interface CleanupStartOptions {
  /**
   * The allocation to clean.
   */
  readonly allocation: Allocation;
  /**
   * Timeout in seconds afterwhich the environment is marked dirty.
   */
  readonly timeoutSeconds: number;
}

/**
 * Properties for `CleanupClient`.
 */
export interface CleanupClientProps {
  /**
   * Arn of the ECS cluster running the task.
   */
  readonly clusterArn: string;
  /**
   * Arn of the cleanup task definition.
   */
  readonly taskDefinitionArn: string;
  /**
   * Subnet where to run the task in.
   */
  readonly subnetId: string;
  /**
   * Security group to attach to the task.
   */
  readonly securityGroupId: string;
  /**
   * Cleanup task container name.
   */
  readonly containerName: string;
}

/**
 * Client for interfacting with the cleanup task.
 */
export class CleanupClient {

  private readonly ecs: ECS = new ECS();

  public constructor(private readonly props: CleanupClientProps) {}

  public async start(opts: CleanupStartOptions) {

    const response = await this.ecs.runTask({
      cluster: this.props.clusterArn,
      taskDefinition: this.props.taskDefinitionArn,
      launchType: 'FARGATE',

      // for troubleshooting. this allows task filtering
      // on the aws console.
      startedBy: opts.allocation.id,
      group: `aws://${opts.allocation.account}/${opts.allocation.region}`,

      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [this.props.subnetId],
          securityGroups: [this.props.securityGroupId],
          assignPublicIp: 'ENABLED',
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: this.props.containerName,
            environment: [
              { name: envars.CLEANUP_TASK_ALLOCATION_ID, value: opts.allocation.id },
              { name: envars.CLEANUP_TASK_TIMEOUT_SECONDS, value: `${opts.timeoutSeconds}` },
            ],
          },
        ],
      },
    });

    return response.tasks![0].taskArn;

  }
}