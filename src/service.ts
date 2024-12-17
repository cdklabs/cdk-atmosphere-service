import { Construct } from 'constructs';
import { Configuration, ConfigurationData } from './config/config';

/**
 * Properties for `AtmosphereService`
 */
export interface AtmosphereServiceProps {

  /**
   * Service Configuration, stored in a dedicated s3 bucket.
   */
  readonly config: ConfigurationData;

}

/**
 * Atmosphere service to allocate AWS environments on-demand.
 */
export class AtmosphereService extends Construct {

  public readonly config: Configuration;

  constructor(scope: Construct, id: string, props: AtmosphereServiceProps) {
    super(scope, id);

    this.config = new Configuration(this, 'Configuration', {
      data: props.config,
    });
  }
}