import { ConfigurationClient } from './config/configuration.client';
import { AllocationsClient } from './storage/allocations.client';
import { EnvironmentsClient } from './storage/environments.client';

const ALLOCATIONS_TABLE_NAME_ENV = 'CDK_ATMOSPHERE_ALLOCATIONS_TABLE_NAME';
const ENVIRONMENTS_TABLE_NAME_ENV = 'CDK_ATMOSPHERE_ENVIRONMENTS_TABLE_NAME';
const CONFIGURATION_BUCKET_ENV = 'CDK_ATMOSPHERE_CONFIGURATION_FILE_BUCKET';
const CONFIGURATION_KEY_ENV = 'CDK_ATMOSPHERE_CONFIGURATION_FILE_KEY';

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
      const bucket = requireEnv(CONFIGURATION_BUCKET_ENV);
      const key = requireEnv(CONFIGURATION_KEY_ENV);
      this._configuration = new ConfigurationClient({ bucket, key });
    }
    return this._configuration;
  }

  public get environments(): EnvironmentsClient {
    if (!this._environments) {
      const tableName = requireEnv(ENVIRONMENTS_TABLE_NAME_ENV);
      this._environments = new EnvironmentsClient(tableName);
    }
    return this._environments;
  }

  public get allocations(): AllocationsClient {
    if (!this._allocations) {
      const tableName = requireEnv(ALLOCATIONS_TABLE_NAME_ENV);
      this._allocations = new AllocationsClient(tableName);
    }
    return this._allocations;
  }

}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
