// eslint-disable-next-line import/no-extraneous-dependencies
import { Scheduler } from '@aws-sdk/client-scheduler';

/**
 * Properties for the `SchedulerClient`.
 */
export interface SchedulerClientProps {
  /**
   * The role eventbridge will use to invoke the event on its target.
   */
  readonly roleArn: string;
  /**
   * Unsuccessfull delivieries of events will be sent to this DLQ.
   */
  readonly dlqArn: string;
}

/**
 * Options for `allocationTimeout`.
 */
interface ScheduleAllocationTimeoutOptions {
  /**
   * Allocation id.
   */
  readonly allocationId: string;
  /**
   * Allocation timeout date.
   */
  readonly timeoutDate: Date;
  /**
   * Arn of the function invoked when an allocation times out.
   */
  readonly functionArn: string;
}

interface ScheduleCleanupTimeoutOptions {
  /**
   * Allocation id the environment is allocated to.
   */
  readonly allocationId: string;
  /**
   * Account of the environment being cleaned.
   */
  readonly account: string;
  /**
   * Region of the environment being cleaned.
   */
  readonly region: string;
  /**
   * Allocation timeout date.
   */
  readonly timeoutDate: Date;
  /**
   * Arn of the function invoked when a cleanup task times out.
   */
  readonly functionArn: string;
}

/**
 * Scheduler client to create the EventBridge schedulers needed by the system.
 */
export class SchedulerClient {

  private static readonly TIMEOUT_EVENT_PREFIX = 'atmosphere.timeout';

  private readonly scheduler: Scheduler = new Scheduler();

  public constructor(private readonly props: SchedulerClientProps) {}

  public async scheduleAllocationTimeout(opts: ScheduleAllocationTimeoutOptions) {

    const prefix = `${SchedulerClient.TIMEOUT_EVENT_PREFIX}.aloc_`;

    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces timeout for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId },
    });
  }

  public async scheduleCleanupTimeout(opts: ScheduleCleanupTimeoutOptions) {

    const prefix = `${SchedulerClient.TIMEOUT_EVENT_PREFIX}.clean_`;

    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces cleanup for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId, account: opts.account, region: opts.region },
    });

  }

  private scheduleExpression(date: Date) {
    // slice to get rid of timezone and milliseconds.
    // see https://docs.aws.amazon.com/scheduler/latest/APIReference/API_CreateSchedule.html#scheduler-CreateSchedule-request-ScheduleExpression
    return `at(${date.toISOString().slice(0, 19)})`;
  }

  private async scheduleLambdaInvoke(opts: ScheduleLambdaInvokeOptions) {

    // https://docs.aws.amazon.com/scheduler/latest/APIReference/API_CreateSchedule.html#API_CreateSchedule_RequestSyntax
    if (opts.name.length >= 64) {
      throw new Error(`Scheduler name '${opts.name}' is too long. Must be less than 64 characters.`);
    }

    await this.scheduler.createSchedule({
      Name: opts.name,
      Description: opts.description,
      FlexibleTimeWindow: { Mode: 'OFF' },
      ScheduleExpression: this.scheduleExpression(opts.at),
      ScheduleExpressionTimezone: 'UTC',
      Target: {
        DeadLetterConfig: {
          Arn: this.props.dlqArn,
        },
        Arn: opts.functionArn,
        RoleArn: this.props.roleArn,
        Input: JSON.stringify(opts.payload),
      },
      ActionAfterCompletion: 'DELETE',
    });

  }

}

interface ScheduleLambdaInvokeOptions {
  readonly functionArn: string;
  readonly name: string;
  readonly description: string;
  readonly at: Date;
  readonly payload: any;
}