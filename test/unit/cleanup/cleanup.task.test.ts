import { Cleaner, CleanerError } from '../../../src/cleanup/cleaner';
import { handler } from '../../../src/cleanup/cleanup.task';
import { RuntimeClients } from '../../../src/clients';
import { EnvironmentAlreadyInUseError } from '../../../src/storage/environments.client';
import { RuntimeClientsMock } from '../clients.mock';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  beforeEach(() => {
    RuntimeClientsMock.mock();
  });

  test('cleans stacks', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1', id: 'id', pool: 'pool' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', roleArn: 'role', pool: 'release' });
    jest.spyOn(clients.environments, 'release').mockImplementation(jest.fn());

    const mockClean = jest.fn();
    jest.spyOn(Cleaner.prototype, 'clean').mockImplementation(mockClean);

    await handler({ allocationId: 'id', timeoutSeconds: 10 });

    expect(mockClean).toHaveBeenCalledWith(10);
    expect(clients.environments.release).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('marks an environment as dirty if cleaner fails', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1', id: 'id', pool: 'pool' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', roleArn: 'role', pool: 'release' });
    jest.spyOn(clients.environments, 'dirty').mockImplementation(jest.fn());

    jest.spyOn(Cleaner.prototype, 'clean').mockRejectedValue(new CleanerError([{ name: 'stack', error: new Error() }]));

    await handler({ allocationId: 'id', timeoutSeconds: 10 });

    expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('rethrows when the environment is already in-use', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', roleArn: 'role', pool: 'release' });
    jest.spyOn(clients.environments, 'release').mockRejectedValue(new EnvironmentAlreadyInUseError('1111', 'us-east-1'));
    jest.spyOn(clients.environments, 'dirty').mockImplementation(jest.fn());

    const mockClean = jest.fn();
    jest.spyOn(Cleaner.prototype, 'clean').mockImplementation(mockClean);

    await expect(handler({ allocationId: 'id', timeoutSeconds: 10 })).rejects.toThrow(EnvironmentAlreadyInUseError);
    expect(clients.environments.dirty).toHaveBeenCalledTimes(0);

  });

  test('rethrows on unexpected cleaner error', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', roleArn: 'role', pool: 'release' });
    jest.spyOn(clients.environments, 'dirty').mockImplementation(jest.fn());

    jest.spyOn(Cleaner.prototype, 'clean').mockRejectedValue(new Error('unexpected'));

    await expect(handler({ allocationId: 'id', timeoutSeconds: 10 })).rejects.toThrow('unexpected');

  });

  test('marks an environment as dirty on unexpected cleaner error', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1', id: 'id', pool: 'pool' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', roleArn: 'role', pool: 'release' });
    jest.spyOn(clients.environments, 'dirty').mockImplementation(jest.fn());

    jest.spyOn(Cleaner.prototype, 'clean').mockRejectedValue(new Error('unexpected'));

    try {
      await handler({ allocationId: 'id', timeoutSeconds: 10 });
    } catch (e: any) {
      expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');
    }

  });

});