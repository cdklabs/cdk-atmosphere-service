import { MetricsMock } from './metrics.mock';
import { PoolAwareMetricsLogger, RuntimeMetrics } from '../../src/metrics';

describe('RuntimeMetrics', () => {

  const mock = MetricsMock.mock();

  describe('scoped', () => {

    test('sets the metric namespace', async () => {

      await RuntimeMetrics.scoped(async (metrics) => {
        expect(metrics.delegate.setNamespace).toHaveBeenCalledWith('Atmosphere');
      });

    });

    test('resets dimensions', async () => {

      await RuntimeMetrics.scoped(async (metrics) => {
        expect(metrics.delegate.setDimensions).toHaveBeenCalledWith({});
      });

    });

    test('calls flush on success', async () => {

      await RuntimeMetrics.scoped(async (_) => { });
      expect(mock.flush).toHaveBeenCalledTimes(1);

    });

    test('calls flush on failure', async () => {

      await expect(RuntimeMetrics.scoped(async (_) => { throw new Error('oops');})).rejects.toThrow('oops');
      expect(mock.flush).toHaveBeenCalledTimes(1);

    });

  });

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