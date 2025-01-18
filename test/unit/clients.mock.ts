import { CleanupClient } from '../../src/cleanup/cleanup.client';
import { RuntimeClients } from '../../src/clients';
import { ConfigurationClient } from '../../src/config/configuration.client';
import { SchedulerClient } from '../../src/scheduler/scheduler.client';
import { AllocationsClient } from '../../src/storage/allocations.client';
import { EnvironmentsClient } from '../../src/storage/environments.client';

export class RuntimeClientsMock {

  public static mock() {

    const clients = RuntimeClients.getOrCreate();

    const configuration = new ConfigurationClient({ bucket: 'mock', key: 'mock' });
    const environments = new EnvironmentsClient('mock');
    const allocations = new AllocationsClient('mock');
    const scheduler = new SchedulerClient({ dlqArn: 'mock', roleArn: 'mock' });
    const cleanup = new CleanupClient({
      clusterArn: 'cluster',
      taskDefinitionArn: 'task',
      subnetId: 'subnet',
      securityGroupId: 'sg',
      containerName: 'main',
    });

    jest.spyOn(clients, 'configuration', 'get').mockReturnValue(configuration);
    jest.spyOn(clients, 'environments', 'get').mockReturnValue(environments);
    jest.spyOn(clients, 'allocations', 'get').mockReturnValue(allocations);
    jest.spyOn(clients, 'scheduler', 'get').mockReturnValue(scheduler);
    jest.spyOn(clients, 'cleanup', 'get').mockReturnValue(cleanup);

  }

}