import { RuntimeClients } from './clients';
import * as envars from './envars';
import { ActiveEnvironment } from './storage/environments.client';

const clients = RuntimeClients.getOrCreate();

const ACTION_CLEAN = 'clean';

export async function handler(event: any, context: any) {

  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const pool = event.pool;
  const region = event.region;
  const cleanupClusterName = envars.Envars.required(envars.CLEANUP_CLUSTER_NAME_ENV);

  if (event.action === ACTION_CLEAN) {
    // user clicked the "clean" button from the table.
    // we just start the cleanup task and return.
    const allocationId = event.allocationId;
    const env = event.env;
    const allocation = await clients.allocations.get(allocationId);
    console.log(`Starting cleanup task for allocation '${allocationId}'`);
    const taskArn = await clients.cleanup.start({ timeoutSeconds: 3600, allocation });
    console.log(`Cleanup task started: ${taskArn}`);

    const taskId = taskArn!.split('/').pop();
    const logsLink = `/ecs/v2/clusters/${cleanupClusterName}/tasks/${taskId}/logs?region=${region}`;

    // amazonq-ignore-next-line
    return [
      '<p><u>Task started successfully:</u></p>',
      '<br>',
      '<ul>',
      `<li><b>Account:</b> ${env.account}</li>`,
      `<li><b>Region:</b> ${env.region}</li>`,
      `<li><b>Allocation:</b> ${allocationId}</li>`,
      `<li><b>Arn:</b> ${taskArn}</li>`,
      '</ul>',
      `<p><a href="${logsLink}" target=_blank>Click here to view task logs</a> (may not be immediately available).</p>`,
      '<p>Once the task completes successfully, the environment will be released and reinstated back to service operation.</p>',
    ].join('');
  }

  // no action performed, we just display the table
  console.log(`Finding dirty environments in pool '${pool}'`);
  const dirty = await findDirtyEnvironments(pool);
  console.log(`Found ${dirty.length} dirty environments`);

  return buildTable(dirty, context, region);
}

function buildTable(environments: ActiveEnvironment[], context: any, region: string) {
  const columns = ['account', 'region', 'status', 'allocation'];
  // amazonq-ignore-next-line
  const header = [
    '<tr>',
    ...columns.map(c => `<th>${c}</th>`),
    '<th>',
    'action',
    '</th>',
    '</tr>',
  ].join('');

  const rows = environments.map(e => {
    // amazonq-ignore-next-line
    return [
      '<tr>',
      ...columns.map(c => `<td>${(e as any)[c]}</td>`),
      '<td>',
      buildCleanAction(e.allocation, e, context, region),
      '</td>',
      '</tr>',
    ].join('');
  });

  return `<table>${header}${rows}</table>`;
}

function buildCleanAction(allocationId: string, env: ActiveEnvironment, context: any, serviceRegion: string) {
  const envSpec = `aws://${env.account}/${env.region}`;
  return `<a class="btn btn-primary" style="submit">Clean</a>
<cwdb-action 
  action="call" 
  display="popup" 
  endpoint="${context.invokedFunctionArn}" 
  confirmation="Are you sure you want to clean environment '${envSpec}'?">
  { "region": "${serviceRegion}", "action": "${ACTION_CLEAN}", "allocationId": "${allocationId}", "env": { "account": "${env.account}", "region": "${env.region}" } }
</cwdb-action>`;
}

async function findDirtyEnvironments(pool: string): Promise<ActiveEnvironment[]> {
  console.log('Scanning environments table');
  const environments = await clients.environments.scan();

  const dirty = [];
  for (const active of environments) {
    const registered = await clients.configuration.getEnvironment(active.account, active.region);
    if (registered.pool === pool && active.status === 'dirty') {
      dirty.push(active);
    }
  }
  return dirty;

}