import { RuntimeClients } from '../src/clients';
import * as envars from '../src/envars';

describe('RuntimeClients', () => {

  test('is singleton', () => {

    expect(RuntimeClients.getOrCreate()).toBe(RuntimeClients.getOrCreate());

  });

  test('allocations requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.allocations).toThrow(`Missing environment variable: ${envars.ALLOCATIONS_TABLE_NAME_ENV}`);

    withEnv( { [envars.ALLOCATIONS_TABLE_NAME_ENV]: 'foo' }, () => {
      expect(clients.allocations).toBeDefined();
    });

  });

  test('environments requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.environments).toThrow(`Missing environment variable: ${envars.ENVIRONMENTS_TABLE_NAME_ENV}`);

    withEnv( { [envars.ENVIRONMENTS_TABLE_NAME_ENV]: 'foo' }, () => {
      expect(clients.environments).toBeDefined();
    });

  });

  test('configuration requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.configuration).toThrow(`Missing environment variable: ${envars.CONFIGURATION_BUCKET_ENV}`);

    withEnv( { [envars.CONFIGURATION_BUCKET_ENV]: 'foo' }, () => {
      expect(() => clients.configuration).toThrow(`Missing environment variable: ${envars.CONFIGURATION_KEY_ENV}`);
    });

    withEnv( { [envars.CONFIGURATION_BUCKET_ENV]: 'foo', [envars.CONFIGURATION_KEY_ENV]: 'bar' }, () => {
      expect(clients.configuration).toBeDefined();
    });

  });

  test('scheduler requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.scheduler).toThrow(`Missing environment variable: ${envars.SCHEDULER_ROLE_ARN_ENV}`);

    await withEnv( { [envars.SCHEDULER_ROLE_ARN_ENV]: 'dlq' }, async () => {
      expect(() => clients.scheduler).toThrow(`Missing environment variable: ${envars.SCHEDULER_DLQ_ARN_ENV}`);
    });

    await withEnv( { [envars.SCHEDULER_DLQ_ARN_ENV]: 'dql', [envars.SCHEDULER_ROLE_ARN_ENV]: 'arn' }, async () => {
      expect(clients.scheduler).toBeDefined();
    });

  });

});

export function withEnv<T>(envVars: Record<string, string>, fn: () => T): T {
  const originalEnv = { ...process.env };

  try {
    // Set temporary env vars
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });

    return fn();
  } finally {
    // Restore original env vars
    process.env = originalEnv;
  }
}