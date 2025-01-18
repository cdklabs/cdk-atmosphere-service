import { Readable } from 'stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@smithy/util-stream';
import { mockClient } from 'aws-sdk-client-mock';
import { ConfigurationData } from '../../../src/config/configuration';
import { ConfigurationClient, EnvironmentNotFoundError } from '../../../src/config/configuration.client';
import 'aws-sdk-client-mock-jest';

describe('ConfigurationClient', () => {

  const s3Mock = mockClient(S3Client);

  beforeEach(() => {
    s3Mock.reset();
  });

  describe('getEnvironment', () => {

    test('returns the environment', async () => {

      const data: ConfigurationData = {
        environments: [
          {
            account: '1111',
            region: 'us-east-1',
            pool: 'canary',
            adminRoleArn: 'adminRoleArn',
          },
          {
            account: '2222',
            region: 'us-east-1',
            pool: 'canary',
            adminRoleArn: 'adminRoleArn',
          },
        ],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      const env = await client.getEnvironment('1111', 'us-east-1');

      expect(env).toEqual({
        account: '1111',
        region: 'us-east-1',
        pool: 'canary',
        adminRoleArn: 'adminRoleArn',
      });

    });

    test('throws if environment doesnt exist', async () => {

      const data: ConfigurationData = { environments: [] };
      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      await expect(client.getEnvironment('1111', 'us-east-1')).rejects.toThrow(EnvironmentNotFoundError);

    });

    test('throws if more than one environment is found', async () => {

      const data: ConfigurationData = {
        environments: [
          {
            account: '1111',
            region: 'us-east-1',
            pool: 'canary',
            adminRoleArn: 'adminRoleArn',
          },
          {
            account: '1111',
            region: 'us-east-1',
            pool: 'canary',
            adminRoleArn: 'adminRoleArn',
          },
        ],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      await expect(client.getEnvironment('1111', 'us-east-1')).rejects.toThrow(Error);

    });

  });

  describe('listEnvironments', () => {

    test('throws on empty data', async () => {

      s3Mock.on(GetObjectCommand).resolves({});

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      await expect(client.listEnvironments()).rejects.toThrow('Configuration file (s3://Bucket/configuration.json) is empty');

    });

    test('caches configuration data', async () => {

      const data: ConfigurationData = {
        environments: [{
          account: '1111',
          region: 'us-east-1',
          pool: 'canary',
          adminRoleArn: 'adminRoleArn',
        }],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      await client.listEnvironments();
      await client.listEnvironments();
      expect(s3Mock).toHaveReceivedCommandTimes(GetObjectCommand, 1);

    });

    test('returns all environments by default', async () => {

      const data: ConfigurationData = {
        environments: [{
          account: '1111',
          region: 'us-east-1',
          pool: 'canary',
          adminRoleArn: 'adminRoleArn',
        }],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      const envs = await client.listEnvironments();
      expect(envs).toEqual(data.environments);

    });

    test('returns empty list on no results', async () => {

      const data: ConfigurationData = {
        environments: [{
          account: '1111',
          region: 'us-east-1',
          pool: 'canary',
          adminRoleArn: 'adminRoleArn',
        }],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      const envs = await client.listEnvironments({ pool: 'non-existent' });
      expect(envs).toEqual([]);

    });

    test('can filter by pool', async () => {

      const data: ConfigurationData = {
        environments: [
          {
            account: '1111',
            region: 'us-east-1',
            pool: 'canary',
            adminRoleArn: 'adminRoleArn',
          },
          {
            account: '2222',
            region: 'us-east-1',
            pool: 'test',
            adminRoleArn: 'adminRoleArn',
          },
        ],
      };

      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(Readable.from([JSON.stringify(data)])) });

      const client = new ConfigurationClient({ bucket: 'Bucket', key: 'configuration.json' });
      const envs = await client.listEnvironments({ pool: 'canary' });
      expect(envs).toEqual([data.environments[0]]);

    });

  });

});