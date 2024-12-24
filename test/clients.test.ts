import { RuntimeClients, ALLOCATIONS_TABLE_NAME_ENV, ENVIRONMENTS_TABLE_NAME_ENV, CONFIGURATION_BUCKET_ENV, CONFIGURATION_KEY_ENV } from '../src/clients';

describe('RuntimeClients', () => {

  test('is singleton', () => {

    expect(RuntimeClients.getOrCreate()).toBe(RuntimeClients.getOrCreate());

  });

  test('allocations requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.allocations).toThrow(`Missing environment variable: ${ALLOCATIONS_TABLE_NAME_ENV}`);

    withEnv( { [ALLOCATIONS_TABLE_NAME_ENV]: 'foo' }, () => {
      expect(clients.allocations).toBeDefined();
    });

  });

  test('environments requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.environments).toThrow(`Missing environment variable: ${ENVIRONMENTS_TABLE_NAME_ENV}`);

    withEnv( { [ENVIRONMENTS_TABLE_NAME_ENV]: 'foo' }, () => {
      expect(clients.environments).toBeDefined();
    });

  });

  test('configuration requires the correct env', () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.configuration).toThrow(`Missing environment variable: ${CONFIGURATION_BUCKET_ENV}`);

    withEnv( { [CONFIGURATION_BUCKET_ENV]: 'foo' }, () => {
      expect(() => clients.configuration).toThrow(`Missing environment variable: ${CONFIGURATION_KEY_ENV}`);
    });

    withEnv( { [CONFIGURATION_BUCKET_ENV]: 'foo', [CONFIGURATION_KEY_ENV]: 'bar' }, () => {
      expect(clients.configuration).toBeDefined();
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