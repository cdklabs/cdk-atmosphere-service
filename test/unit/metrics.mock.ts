import { PoolAwareMetricsLogger, RuntimeMetrics } from '../../src/metrics';

export class MetricsMock {

  public static mock(): PoolAwareMetricsLogger {

    const mock = new PoolAwareMetricsLogger({
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      setNamespace: jest.fn(),
      flush: jest.fn(),
    } as any);

    async function scoped<T>(handler: (m: PoolAwareMetricsLogger) => Promise<T>) {
      return handler(mock);
    }

    jest.spyOn(RuntimeMetrics, 'scoped').mockImplementation(scoped);

    return mock;
  }
}