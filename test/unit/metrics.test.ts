import { PoolAwareMetricsLogger } from '../../src/metrics';

describe('RuntimeMetrics', () => {

  test('configures a default pool', () => {});

});

describe('PoolAwareMetricsLogger', () => {

  test('configures a default pool', () => {

    const metrics = new PoolAwareMetricsLogger({
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      setNamespace: jest.fn(),
      flush: jest.fn(),
    } as any);

    metrics.putDimensions({ foo: 'bar' });

    expect(metrics.delegate.putDimensions).toHaveBeenCalledWith({ foo: 'bar', pool: 'UNKNOWN' });

  });

  test('allows setting pool', () => {

    const metrics = new PoolAwareMetricsLogger({
      putMetric: jest.fn(),
      putDimensions: jest.fn(),
      setDimensions: jest.fn(),
      setProperty: jest.fn(),
      setNamespace: jest.fn(),
      flush: jest.fn(),
    } as any);

    metrics.setPool('release');
    metrics.putDimensions({ foo: 'bar' });

    expect(metrics.delegate.putDimensions).toHaveBeenCalledWith({ foo: 'bar', pool: 'release' });

  });

});