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

    await _with.env( { [envars.SCHEDULER_ROLE_ARN_ENV]: 'arn' }, async () => {
      expect(clients.scheduler).toBeDefined();
    });

  });

  test('cleanup requires the correct env', async () => {

    const clients = RuntimeClients.getOrCreate();

    expect(() => clients.cleanup).toThrow(`Missing environment variable: ${envars.CLEANUP_CLUSTER_ARN_ENV}`);

    await _with.env( { [envars.CLEANUP_CLUSTER_ARN_ENV]: 'cluster' }, async () => {
      expect(() => clients.cleanup).toThrow(`Missing environment variable: ${envars.CLEANUP_TASK_DEFINITION_ARN_ENV}`);
    });

    await _with.env( {
      [envars.CLEANUP_CLUSTER_ARN_ENV]: 'cluster',
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: 'task',
    }, async () => {
      expect(() => clients.cleanup).toThrow(`Missing environment variable: ${envars.CLEANUP_TASK_SUBNET_ID_ENV}`);
    });

    await _with.env( {
      [envars.CLEANUP_CLUSTER_ARN_ENV]: 'cluster',
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: 'task',
      [envars.CLEANUP_TASK_SUBNET_ID_ENV]: 'subnet',
    }, async () => {
      expect(() => clients.cleanup).toThrow(`Missing environment variable: ${envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV}`);
    });

    await _with.env( {
      [envars.CLEANUP_CLUSTER_ARN_ENV]: 'cluster',
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: 'task',
      [envars.CLEANUP_TASK_SUBNET_ID_ENV]: 'subnet',
      [envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: 'sg',
    }, async () => {
      expect(() => clients.cleanup).toThrow(`Missing environment variable: ${envars.CLEANUP_TASK_CONTAINER_NAME_ENV}`);
    });

    await _with.env( {
      [envars.CLEANUP_CLUSTER_ARN_ENV]: 'cluster',
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: 'task',
      [envars.CLEANUP_TASK_SUBNET_ID_ENV]: 'subnet',
      [envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: 'sg',
      [envars.CLEANUP_TASK_CONTAINER_NAME_ENV]: 'container',
    }, async () => {
      expect(clients.cleanup).toBeDefined();
    });

  });

});
