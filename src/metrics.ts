// eslint-disable-next-line import/no-extraneous-dependencies
import { metricScope, MetricsLogger } from 'aws-embedded-metrics';

export const NAMESPACE = 'Atmosphere';
export const METRICS_DIMENSION_POOL = 'pool';
export const METRIC_DIMENSION_VALUE = 'value';

export class RuntimeMetrics {

  public static namespace(component: string) {
    return `${NAMESPACE}/${component}`;
  }

  public static scope<T, U extends readonly unknown[]>(handler: (m: MetricsLogger) => (...args: U) => T | Promise<T>):
  (...args: U) => T | Promise<T> {
    return metricScope(handler);
  }
}

