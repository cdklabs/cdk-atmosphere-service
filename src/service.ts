import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Allocate } from './allocate';
import { Endpoint, EndpointOptions } from './api';
import { Cleanup } from './cleanup';
import { Configuration, ConfigurationData } from './config/configuration';
import { Dashboard } from './dashboard';
import { Deallocate } from './deallocate';
import { Scheduler } from './scheduler';
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

  /**
   * Provides access to the scheduler.
   */
  public readonly scheduler: Scheduler;

  /**
   * Provides access to the cleanup task.
   */
  public readonly cleanup: Cleanup;

  /**
   * Provides access to the operational dashboard.
   */
  public readonly dashboard: Dashboard;

  constructor(scope: Construct, id: string, props: AtmosphereServiceProps) {
    super(scope, id);

    this.config = new Configuration(this, 'Configuration', {
      data: props.config,
    });

    this.environments = new Environments(this, 'Environments', {
      config: this.config,
    });
    this.allocations = new Allocations(this, 'Allocations');

    this.cleanup = new Cleanup(this, 'Cleanup', {
      configuration: this.config,
      environments: this.environments,
      allocations: this.allocations,
    });

    this.scheduler = new Scheduler(this, 'Scheduler', {
      environments: this.environments,
      allocations: this.allocations,
    });

    this.allocate = new Allocate(this, 'Allocate', {
      configuration: this.config,
      allocations: this.allocations,
      environments: this.environments,
      scheduler: this.scheduler,
    });

    this.deallocate = new Deallocate(this, 'Deallocate', {
      configuration: this.config,
      environments: this.environments,
      allocations: this.allocations,
      scheduler: this.scheduler,
      cleanup: this.cleanup,
    });

    this.endpoint = new Endpoint(this, 'Endpoint', {
      allocate: this.allocate,
      deallocate: this.deallocate,
      ...props.endpoint,
    });

    this.dashboard = new Dashboard(this, 'Dashboard', {
      name: Stack.of(this).stackName,
      config: this.config,
      allocate: this.allocate,
      deallocate: this.deallocate,
      cleanup: this.cleanup,
      environments: this.environments,
      allocations: this.allocations,
    });

  }
}
