/**
 * Properties for `Logger`.
 */
export interface LoggerProps {

  /**
   * Allocation id.
   */
  readonly allocationId: string;

  /**
   * Which pool this allocation belongs to.
   */
  readonly pool: string;

  /**
   * Runtime component that is performing the operations.
   */
  readonly component: 'allocate' | 'deallocate' | 'allocation-timeout' | 'cleanup-timeout' | 'cleanup';

}

/**
 * Log operations with specific context, which is included in the message prefix.
 *
 * Timestamps are not added because they make for very long messages which are hard to look
 * at in the CloudWatch console. Note that CloudWatch provides its own ingestion timestamps,
 * which are probably good enough for us.
 *
 */
export class Logger {

  private readonly prefix: string;

  public constructor(props: LoggerProps) {
    this.prefix = `[${props.component}] [pool:${props.pool}] [aloc:${props.allocationId}]`;
  }

  public info(message?: any) {
    console.log(`${this.prefix} ${message}`);
  }

  public error(error: Error, message: string = '') {
    console.error(`${this.prefix} ${message}`, error);
  }

}
