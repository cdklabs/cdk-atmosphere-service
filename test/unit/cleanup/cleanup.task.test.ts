import { handler } from '../../../src/cleanup/cleanup.task';
import { RuntimeClients } from '../../../src/clients';
import { RuntimeClientsMock } from '../clients.mock';

// this grabs the same instance the handler uses
// so we can easily mock it.
const clients = RuntimeClients.getOrCreate();

const mockClean = jest.fn();
function createCleaner() {
  return {
    clean: mockClean,
  };
}

jest.mock('../../../src/cleanup/cleaner', () => {
  return {
    Cleaner: createCleaner,
  };
});

describe('handler', () => {

  beforeEach(() => {
    RuntimeClientsMock.mock();
  });

  test('cleans stacks', async () => {

    jest.spyOn(clients.allocations, 'get').mockResolvedValue({ account: '1111', region: 'us-east-1' } as any);
    jest.spyOn(clients.configuration, 'getEnvironment').mockResolvedValue({ account: '1111', region: 'us-east-1', adminRoleArn: 'role', pool: 'release' });

    await handler({ allocationId: 'id', timeoutSeconds: 10 });

    expect(mockClean).toHaveBeenCalled();

  });

});