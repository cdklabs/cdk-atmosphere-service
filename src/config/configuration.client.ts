// eslint-disable-next-line import/no-extraneous-dependencies
import * as s3 from '@aws-sdk/client-s3';
import type { ConfigurationData, Environment } from './configuration';

/**
 * Error thrown when an environment is not found.
 */
export class EnvironmentNotFoundError extends Error {
  constructor(readonly account: string, readonly region: string) {
    super(`Environment aws://${account}/${region} not found`);
  }
}

/**
 * Options for `listEnvironments`.
 */
export interface ListEnvironmentsOptions {

  /**
   * Which pool should the environment belong to.
   *
   * @default - any pool
   */
  readonly pool?: string;
}

/**
 * Client for accessing the configuration file at runtime.
 */
export class ConfigurationClient {

  private readonly s3Location: { bucket: string; key: string };
  private readonly s3Client;
  private _data: ConfigurationData | undefined;

  constructor(s3Location: { bucket: string; key: string }) {
    this.s3Location = s3Location;
    this.s3Client = new s3.S3();
  }

  /**
   * Retrieve environments belonging to a specific pool.
   */
  public async listEnvironments(opts: ListEnvironmentsOptions = {}): Promise<Environment[]> {
    return (await this.data).environments.filter(e => opts.pool ? e.pool === opts.pool : true);
  }

  /**
   * Retrieve a single environment based on account + region.
   */
  public async getEnvironment(account: string, region: string): Promise<Environment> {
    const envs = (await this.data).environments.filter(e => e.account === account && e.region === region);
    if (envs.length === 0) {
      throw new EnvironmentNotFoundError(account, region);
    }
    if (envs.length > 1) {
      throw new Error(`Multiple environments found for aws://${account}/${region}`);
    }
    return envs[0];
  }

  // lazy async getter
  private get data() {
    return (async () => {
      if (this._data) {
        return this._data;
      }
      this._data = await this.download();
      return this._data!;
    })();
  }

  private async download() {
    const response = await this.s3Client.getObject({
      Bucket: this.s3Location.bucket,
      Key: this.s3Location.key,
    });

    if (!response.Body) {
      throw new Error(`Configuration file (s3://${this.s3Location.bucket}/${this.s3Location.key}) is empty`);
    }

    return JSON.parse(await response.Body.transformToString('utf-8'));
  }
}