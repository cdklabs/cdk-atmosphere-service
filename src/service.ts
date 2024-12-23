import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Endpoint, EndpointOptions } from './api';
import { Configuration, ConfigurationData } from './config/configuration';
import { Deallocate } from './deallocate';
import { Allocations, Environments } from './storage';

/**
 * Properties for `AtmosphereService`
 */
export interface AtmosphereServiceProps {

  /**
   * Service Configuration, stored in a dedicated s3 bucket.
   */
  readonly config: ConfigurationData;

  /**
   * Options for the API endpoint.
   */
  readonly endpoint?: EndpointOptions;

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

  /**
   * Provides access to the allocate function.
   */
  public readonly allocate: Allocate;

  /**
   * Provides access to the deaclloce function.
   */
  public readonly deallocate: Deallocate;

  /**
   * Provides access to the API gateway endpoint.
   */
  public readonly endpoint: Endpoint;

  constructor(scope: Construct, id: string, props: AtmosphereServiceProps) {
    super(scope, id);

    this.config = new Configuration(this, 'Configuration', {
      data: props.config,
    });

    this.environments = new Environments(this, 'Environments');
    this.allocations = new Allocations(this, 'Allocations');

    this.allocate = new Allocate(this, 'Allocate', {
      configuration: this.config,
      allocations: this.allocations,
      environments: this.environments,
    });
    this.deallocate = new Deallocate(this, 'Deallocate', {
      environments: this.environments,
      allocations: this.allocations,
    });

    this.endpoint = new Endpoint(this, 'Endpoint', {
      allocate: this.allocate,
      deallocate: this.deallocate,
      ...props.endpoint,
    });
  }
}