import { RuntimeClients } from '../../../src/clients';
import { handler } from '../../../src/monitor/environments.monitor.lambda';
import { RuntimeClientsMock } from '../clients.mock';
import { MetricsMock } from '../metrics.mock';

const clients = RuntimeClients.getOrCreate();

describe('handler', () => {

  const mockMetrics = MetricsMock.mock();

  beforeEach(() => {
    RuntimeClientsMock.mock();
    jest.clearAllMocks();
  });

  test('sets pool as a dimension', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putDimensions).toHaveBeenCalledWith({ pool: 'canary' });

  });

  test('emits the right value for registered environments', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putMetric).toHaveBeenCalledWith('environments-registered', 1, 'Count');

  });

  test('emits the right value for free environments', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putMetric).toHaveBeenCalledWith('environments-free', 1, 'Count');

  });

  test('emits the right value for dirty environments', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      allocation: 'id',
      status: 'dirty',
    }]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putMetric).toHaveBeenCalledWith('environments-dirty', 1, 'Count');

  });

  test('emits the right value for cleaning environments', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      allocation: 'id',
      status: 'cleaning',
    }]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putMetric).toHaveBeenCalledWith('environments-cleaning', 1, 'Count');

  });

  test('emits the right value for in-use environments', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      pool: 'canary',
      adminRoleArn: 'arn:aws:iam::1111:role/Admin',
    }]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([{
      account: '1111',
      region: 'us-east-1',
      allocation: 'id',
      status: 'in-use',
    }]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putMetric).toHaveBeenCalledWith('environments-in-use', 1, 'Count');

  });

  test('correctly filters by pool', async () => {

    jest.spyOn(clients.configuration, 'listEnvironments').mockReturnValue(Promise.resolve([
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'canary',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin',
      },
      {
        account: '2222',
        region: 'us-east-1',
        pool: 'release',
        adminRoleArn: 'arn:aws:iam::2222:role/Admin',
      },
      {
        account: '3333',
        region: 'us-east-1',
        pool: 'release',
        adminRoleArn: 'arn:aws:iam::3333:role/Admin',
      },
    ]));
    jest.spyOn(clients.environments, 'scan').mockReturnValue(Promise.resolve([
      {
        account: '1111',
        region: 'us-east-1',
        allocation: 'id',
        status: 'in-use',
      },
      {
        account: '2222',
        region: 'us-east-1',
        allocation: 'id',
        status: 'in-use',
      },
      {
        account: '3333',
        region: 'us-east-1',
        allocation: 'id',
        status: 'in-use',
      },
    ]));

    await handler({} as any, {} as any);

    expect(mockMetrics.putDimensions).toHaveBeenNthCalledWith(1, { pool: 'canary' });
    expect(mockMetrics.putDimensions).toHaveBeenNthCalledWith(2, { pool: 'release' });
    expect(mockMetrics.putMetric).toHaveBeenNthCalledWith(3, 'environments-in-use', 1, 'Count');
    expect(mockMetrics.putMetric).toHaveBeenNthCalledWith(8, 'environments-in-use', 2, 'Count');

  });

});