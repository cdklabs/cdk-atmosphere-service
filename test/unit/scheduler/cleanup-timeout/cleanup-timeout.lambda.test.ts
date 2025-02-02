import { RuntimeClients } from '../../../../src/clients';
import { handler } from '../../../../src/scheduler/cleanup-timeout/cleanup-timeout.lambda';
import { EnvironmentAlreadyReleasedError, EnvironmentAlreadyReallocated, EnvironmentAlreadyDirtyError } from '../../../../src/storage/environments.client';
import { RuntimeClientsMock } from '../../clients.mock';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  beforeEach(() => {
    RuntimeClientsMock.mock();

    // needed because we query allocations to configure the pool of the logger.
    jest.spyOn(clients.allocations, 'get').mockReturnValue(Promise.resolve({ pool: 'pool' } as any));

  });

  test('marks the environment as dirty', async () => {

    jest.spyOn(clients.environments, 'dirty').mockImplementation(jest.fn());

    await handler({ allocationId: 'id', account: '1111', region: 'us-east-1' });

    expect(clients.environments.dirty).toHaveBeenCalledTimes(1);
    expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('no ops if the environment has been reallocated', async () => {

    jest.spyOn(clients.environments, 'dirty').mockRejectedValue(new EnvironmentAlreadyReallocated('1111', 'us-east-1'));

    await handler({ allocationId: 'id', account: '1111', region: 'us-east-1' });

    expect(clients.environments.dirty).toHaveBeenCalledTimes(1);
    expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('no ops if the environment is already dirty', async () => {

    jest.spyOn(clients.environments, 'dirty').mockRejectedValue(new EnvironmentAlreadyDirtyError('1111', 'us-east-1'));

    await handler({ allocationId: 'id', account: '1111', region: 'us-east-1' });

    expect(clients.environments.dirty).toHaveBeenCalledTimes(1);
    expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('no ops if the environment is already released', async () => {

    jest.spyOn(clients.environments, 'dirty').mockRejectedValue(new EnvironmentAlreadyReleasedError('1111', 'us-east-1'));

    await handler({ allocationId: 'id', account: '1111', region: 'us-east-1' });

    expect(clients.environments.dirty).toHaveBeenCalledTimes(1);
    expect(clients.environments.dirty).toHaveBeenCalledWith('id', '1111', 'us-east-1');

  });

  test('rethrows if unexpected error when marking environment as dirty', async () => {

    jest.spyOn(clients.environments, 'dirty').mockRejectedValue(new Error('Unexpected'));

    await expect(handler({ allocationId: 'id', account: '1111', region: 'us-east-1' })).rejects.toThrow('Unexpected');

  });

});