import { MetricsLogger } from 'aws-embedded-metrics';
import { AccumulatingDimensionMetricsLogger, RuntimeMetrics } from '../../src/metrics';

export class MetricsMock {

  public static mock(): MetricsLogger {

    const mock = new AccumulatingDimensionMetricsLogger({
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      setNamespace: jest.fn(),
      flush: jest.fn(),
    } as any);

    async function scoped<T>(handler: (m: AccumulatingDimensionMetricsLogger) => Promise<T>) {
      return handler(mock);
    }

    jest.spyOn(RuntimeMetrics, 'scoped').mockImplementation(scoped);

    return mock as any;
  }
}