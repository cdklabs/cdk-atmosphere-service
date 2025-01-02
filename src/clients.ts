import { ConfigurationClient } from './config/configuration.client';
import * as envars from './envars';
import { SchedulerClient } from './scheduler/scheduler.client';
import { AllocationsClient } from './storage/allocations.client';
import { EnvironmentsClient } from './storage/environments.client';

/**
 * Factory class to initialize clients using environment variables.
 * Allows for lazy initialization of clients to avoid loading environment variables
 * until they are needed.
 */
export class RuntimeClients {

  public static getOrCreate(): RuntimeClients {
    if (!this._instance) {
      this._instance = new RuntimeClients();
    }
    return this._instance;
  }

  private static _instance: RuntimeClients;

  private _configuration: ConfigurationClient | undefined;
  private _environments: EnvironmentsClient | undefined;
  private _allocations: AllocationsClient | undefined;
  private _scheduler: SchedulerClient | undefined;

  public get configuration(): ConfigurationClient {
    if (!this._configuration) {
      const bucket = envars.Envars.required(envars.CONFIGURATION_BUCKET_ENV);
      const key = envars.Envars.required(envars.CONFIGURATION_KEY_ENV);
      this._configuration = new ConfigurationClient({ bucket, key });
    }
    return this._configuration;
  }

  public get environments(): EnvironmentsClient {
    if (!this._environments) {
      const tableName = envars.Envars.required(envars.ENVIRONMENTS_TABLE_NAME_ENV);
      this._environments = new EnvironmentsClient(tableName);
    }
    return this._environments;
  }

  public get allocations(): AllocationsClient {
    if (!this._allocations) {
      const tableName = envars.Envars.required(envars.ALLOCATIONS_TABLE_NAME_ENV);
      this._allocations = new AllocationsClient(tableName);
    }
    return this._allocations;
  }

  public get scheduler(): SchedulerClient {
    if (!this._scheduler) {
      const roleArn = envars.Envars.required(envars.SCHEDULER_ROLE_ARN_ENV);
      const dlqArn = envars.Envars.required(envars.SCHEDULER_DLQ_ARN_ENV);
      this._scheduler = new SchedulerClient({ roleArn, dlqArn });
    }
    return this._scheduler;
  }

}
