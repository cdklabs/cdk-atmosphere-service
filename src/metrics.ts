// eslint-disable-next-line import/no-extraneous-dependencies
import { MetricsLogger, createMetricsLogger } from 'aws-embedded-metrics';

export const METRICS_NAMESPACE = 'Atmosphere';
export const METRIC_DIMENSION_POOL = 'pool';
export const UNKNOWN_POOL = 'UNKNOWN';

export class RuntimeMetrics {

  public static async scoped<T>(handler: (m: PoolAwareMetricsLogger) => Promise<T>) {

    const metrics = new PoolAwareMetricsLogger(createMetricsLogger());

    metrics.delegate.setNamespace(METRICS_NAMESPACE);
    metrics.delegate.setDimensions({});

    try {
      return await handler(metrics);
    } finally {
      await metrics.delegate.flush();
    }
  }

}

/**
 * Wrapper logger that ensures each dimension set associated
 * with a metric includes a pool diemnsion. It allows operations
 * to configure a pool once, and then continously add dimension sets as
 * more dimensions become available.
 */
export class PoolAwareMetricsLogger {

  private pool: string;

  public constructor(public readonly delegate: MetricsLogger) {
    // we can't always know the pool an operation belongs to because
    // it may fail before discovering it. so we start with 'UNKNOWN' and let
    // downstream handlers override once they can.
    this.pool = UNKNOWN_POOL;
  }

  public setPool(pool: string) {
    this.pool = pool;
  }

  public putDimensions(dimensions: Record<string, string>) {
    this.delegate.putDimensions({
      ...dimensions,
      [METRIC_DIMENSION_POOL]: this.pool,
    });
  }

}

