import { MetricsLogger } from 'aws-embedded-metrics';
import { RuntimeMetrics } from '../../src/metrics';

export class MetricsMock {

  public static mock(): MetricsLogger {

    const mock = {
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      flush: jest.fn(),
    };

    function scope<T, U extends readonly unknown[]>(handler: (m: MetricsLogger) => (...args: U) => T | Promise<T>):
    (...args: U) => T | Promise<T> {
      return handler(mock as unknown as MetricsLogger);
    }

    jest.spyOn(RuntimeMetrics, 'scope').mockImplementation(scope);

    return mock as any;
  }
}