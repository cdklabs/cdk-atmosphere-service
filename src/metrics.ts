// eslint-disable-next-line import/no-extraneous-dependencies
import { MetricsLogger, Unit, createMetricsLogger } from 'aws-embedded-metrics';

export const METRICS_NAMESPACE = 'Atmosphere';
export const METRIC_DIMENSION_POOL = 'pool';

export class RuntimeMetrics {

  public static async scoped<T>(handler: (m: AccumulatingDimensionMetricsLogger) => Promise<T>) {

    const metrics = new AccumulatingDimensionMetricsLogger(createMetricsLogger());

    // we can't always know the pool an operation belongs to.
    // so we start with 'UNKNOWN' and let downstream handlers override
    // it once the pool is discovered.
    metrics.addDimension(METRIC_DIMENSION_POOL, 'UNKNOWN');

    try {
      return await handler(metrics);
    } finally {
      await metrics.flush();
    }
  }

}

export class AccumulatingDimensionMetricsLogger {

  private readonly dimensions: Record<string, string> = {};

  public constructor(private readonly metrics: MetricsLogger) {
    metrics.setNamespace(METRICS_NAMESPACE);
    metrics.setDimensions({});
  }

  public putMetric(key: string, value: number, unit: Unit) {
    this.metrics.setDimensions(this.dimensions);
    this.metrics.putMetric(key, value, unit);
  }

  public setPool(pool: string) {
    this.addDimension(METRIC_DIMENSION_POOL, pool);
  }

  public addDimension(key: string, value: string) {
    this.dimensions[key] = value;
  }

  public async flush() {
    await this.metrics.flush();
  }
}

