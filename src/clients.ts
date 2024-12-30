import { ConfigurationClient } from './config/configuration.client';
import { ALLOCATIONS_TABLE_NAME_ENV, CONFIGURATION_BUCKET_ENV, CONFIGURATION_KEY_ENV, Envars, ENVIRONMENTS_TABLE_NAME_ENV } from './envars';
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

  public get configuration(): ConfigurationClient {
    if (!this._configuration) {
      const bucket = Envars.required(CONFIGURATION_BUCKET_ENV);
      const key = Envars.required(CONFIGURATION_KEY_ENV);
      this._configuration = new ConfigurationClient({ bucket, key });
    }
    return this._configuration;
  }

  public get environments(): EnvironmentsClient {
    if (!this._environments) {
      const tableName = Envars.required(ENVIRONMENTS_TABLE_NAME_ENV);
      this._environments = new EnvironmentsClient(tableName);
    }
    return this._environments;
  }

  public get allocations(): AllocationsClient {
    if (!this._allocations) {
      const tableName = Envars.required(ALLOCATIONS_TABLE_NAME_ENV);
      this._allocations = new AllocationsClient(tableName);
    }
    return this._allocations;
  }

}
