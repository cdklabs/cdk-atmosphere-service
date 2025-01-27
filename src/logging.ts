/**
 * Properties for `AllocationLogger`.
 */
export interface AllocationLoggerProps {

  /**
   * Allocation id.
   */
  readonly id: string;

  /**
   * Runtime component that is performing the operations.
   */
  readonly component: 'allocate' | 'deallocate' | 'allocation-timeout' | 'cleanup-timeout' | 'cleanup';

}

/**
 * Log operations executed in the context of an allocation. Each message will be
 * prefixed with the allocation id and the runtime component.
 *
 * Timestamps are not added because they make for very long messages which are hard to look
 * at in the CloudWatch console. Note that CloudWatch provides its own ingestion timestamps,
 * which are probably good enough for us.
 *
 */
export class AllocationLogger {

  private readonly prefix: string;

  public constructor(props: AllocationLoggerProps) {
    this.prefix = `[${props.component}] [aloc:${props.id}]`;
  }

  public info(message?: any) {
    console.log(`${this.prefix} ${message}`);
  }

  public error(error: Error, message: string = '') {
    console.error(`${this.prefix} ${message}`, error);
  }

}
