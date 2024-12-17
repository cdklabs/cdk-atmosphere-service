import { Construct } from 'constructs';
import { Configuration, ConfigurationData } from './config/configuration';
import { Allocations, Environments } from './storage';

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

  /**
   * Provides access to the service configuration file.
   */
  public readonly config: Configuration;

  /**
   * Provides access to the environments table.
   */
  public readonly environments: Environments;

  /**
   * Provides access to the allocations table.
   */
  public readonly allocations: Allocations;

  constructor(scope: Construct, id: string, props: AtmosphereServiceProps) {
    super(scope, id);

    this.config = new Configuration(this, 'Configuration', {
      data: props.config,
    });

    this.environments = new Environments(this, 'Environments');
    this.allocations = new Allocations(this, 'Allocations');
  }
}