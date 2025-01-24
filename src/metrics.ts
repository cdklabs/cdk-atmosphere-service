// eslint-disable-next-line import/no-extraneous-dependencies
import { metricScope, MetricsLogger } from 'aws-embedded-metrics';

const NAMESPACE = 'Atmosphere';

export class RuntimeMetrics {

  public static namespace(component: string) {
    return `${NAMESPACE}/${component}`;
  }

  public static scope<T, U extends readonly unknown[]>(handler: (m: MetricsLogger) => (...args: U) => T | Promise<T>):
  (...args: U) => T | Promise<T> {
    return metricScope(handler);
  }
}

