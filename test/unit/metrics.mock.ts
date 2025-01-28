import * as aem from 'aws-embedded-metrics';

export class MetricsMock {

  public static mock(): aem.MetricsLogger {

    const mock = {
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      setNamespace: jest.fn(),
      flush: jest.fn(),
    } as any;

    jest.spyOn(aem, 'createMetricsLogger').mockReturnValue(mock);

    return mock;
  }
}