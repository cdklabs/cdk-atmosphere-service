import { RuntimeClients } from '../../src/clients';
import * as envars from '../../src/envars';
import * as _with from '../with';

describe('RuntimeClients', () => {

  test('is singleton', () => {

    expect(RuntimeClients.getOrCreate()).toBe(RuntimeClients.getOrCreate());

  });

  test('allocations requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.allocations).toThrow(`Missing environment variable: ${envars.ALLOCATIONS_TABLE_NAME_ENV}`);

    await _with.env( { [envars.ALLOCATIONS_TABLE_NAME_ENV]: 'foo' }, async () => {
      expect(clients.allocations).toBeDefined();
    });

  });

  test('environments requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.environments).toThrow(`Missing environment variable: ${envars.ENVIRONMENTS_TABLE_NAME_ENV}`);

    await _with.env( { [envars.ENVIRONMENTS_TABLE_NAME_ENV]: 'foo' }, async () => {
      expect(clients.environments).toBeDefined();
    });

  });

  test('configuration requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.configuration).toThrow(`Missing environment variable: ${envars.CONFIGURATION_BUCKET_ENV}`);

    await _with.env( { [envars.CONFIGURATION_BUCKET_ENV]: 'foo' }, async () => {
      expect(() => clients.configuration).toThrow(`Missing environment variable: ${envars.CONFIGURATION_KEY_ENV}`);
    });

    await _with.env( { [envars.CONFIGURATION_BUCKET_ENV]: 'foo', [envars.CONFIGURATION_KEY_ENV]: 'bar' }, async () => {
      expect(clients.configuration).toBeDefined();
    });

  });

  test('scheduler requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.scheduler).toThrow(`Missing environment variable: ${envars.SCHEDULER_ROLE_ARN_ENV}`);

    await _with.env( { [envars.SCHEDULER_ROLE_ARN_ENV]: 'dlq' }, async () => {
      expect(() => clients.scheduler).toThrow(`Missing environment variable: ${envars.SCHEDULER_DLQ_ARN_ENV}`);
    });

    await _with.env( { [envars.SCHEDULER_DLQ_ARN_ENV]: 'dql', [envars.SCHEDULER_ROLE_ARN_ENV]: 'arn' }, async () => {
      expect(clients.scheduler).toBeDefined();
    });

  });

});
