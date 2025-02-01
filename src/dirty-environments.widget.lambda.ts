// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudWatchLogs, ResultField } from '@aws-sdk/client-cloudwatch-logs';
import { RuntimeClients } from './clients';
import * as envars from './envars';
import { ActiveEnvironment } from './storage/environments.client';

const clients = RuntimeClients.getOrCreate();

const ACTION_CLEAN = 'clean';
const ACTION_LOGS = 'logs';
const CHECK_QUERY_STATUS_DELAY_MS = 250;

export async function handler(event: any, context: any) {

  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const pool = event.pool;
  const serviceRegion = event.serviceRegion;
  const cleanupClusterName = envars.Envars.required(envars.CLEANUP_CLUSTER_NAME_ENV);

  if (event.action === ACTION_LOGS) {
    // user clicked the "view logs" button from the table.
    // we fetch logs and return.
    const allocationId = event.allocationId;
    const allocation = await clients.allocations.get(allocationId);
    console.log(`Fetching cleanup logs for allocation '${allocationId}'`);
    const to = new Date();

    // start looking from 7 days ago, this should be a big enough
    // window for us to address the alarm.
    const from = new Date();
    from.setDate(to.getDate() - 7);
    const logs = await fetchLogs(allocationId, from, to, serviceRegion);
    if (logs && logs.length > 0) {
      // amazonq-ignore-next-line
      return [
        '<p><u>Successfully fetched cleanup logs:</u></p>',
        '<br>',
        '<ul>',
        `<li><b>Account:</b> ${allocation.account}</li>`,
        `<li><b>Region:</b> ${allocation.region}</li>`,
        `<li><b>Allocation:</b> ${allocationId}</li>`,
        `<li><b>Timespan:</b> ${from.toISOString()} to ${to.toISOString()}</li>`,
        '</ul>',
        '<br>',
        buildLogsTable(logs),
      ].join('');
    } else {
      return `<p><b>No cleanup logs found for environment 'aws://${allocation.account}/${allocation.region}'</b></p>`;
    }
  }

  if (event.action === ACTION_CLEAN) {
    // user clicked the "clean" button from the table.
    // we start the cleanup task and return.
    const allocationId = event.allocationId;
    const allocation = await clients.allocations.get(allocationId);
    console.log(`Starting cleanup task for allocation '${allocationId}'`);
    const taskArn = await clients.cleanup.start({ timeoutSeconds: 3600, allocation });
    console.log(`Cleanup task started: ${taskArn}`);

    const taskId = taskArn!.split('/').pop();
    const logsLink = `/ecs/v2/clusters/${cleanupClusterName}/tasks/${taskId}/logs?region=${serviceRegion}`;

    // amazonq-ignore-next-line
    return [
      '<p><u>Task started successfully:</u></p>',
      '<br>',
      '<ul>',
      `<li><b>Account:</b> ${allocation.account}</li>`,
      `<li><b>Region:</b> ${allocation.region}</li>`,
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

  if (dirty.length === 0) {
    return '<br><p><b>No dirty environments, hurray!</b></p>';
  }

  return buildTable(dirty, context, serviceRegion);
}

function buildTable(environments: ActiveEnvironment[], context: any, serviceRegion: string) {
  const columns = ['account', 'region', 'status', 'allocation'];
  // amazonq-ignore-next-line
  const header = [
    '<tr>',
    ...columns.map(c => `<th>${c}</th>`),
    '<th>',
    'actions',
    '</th>',
    '</tr>',
  ].join('');

  const rows = environments.map(e => {
    // amazonq-ignore-next-line
    return [
      '<tr>',
      ...columns.map(c => `<td>${(e as any)[c]}</td>`),
      '<td>',
      '<div style="display: flex; justify-content: space-between; width: 100%; gap: 10px;">',
      buildCleanAction(e.allocation, e, context, serviceRegion),
      buildViewLogsAction(e.allocation, context, serviceRegion),
      '</div>',
      '</td>',
      '</tr>',
    ].join('');
  });

  return `<br><table>${header}${rows}</table>`;
}

function buildCleanAction(allocationId: string, env: ActiveEnvironment, context: any, serviceRegion: string) {
  const envSpec = `aws://${env.account}/${env.region}`;
  return `<a class="btn btn-primary" style="submit">Clean</a>
<cwdb-action 
  action="call" 
  display="popup" 
  endpoint="${context.invokedFunctionArn}" 
  confirmation="Are you sure you want to clean environment '${envSpec}'?">
  { "serviceRegion": "${serviceRegion}", "action": "${ACTION_CLEAN}", "allocationId": "${allocationId}" }
</cwdb-action>`;
}

function buildViewLogsAction(allocationId: string, context: any, serviceRegion: string) {
  return `<a class="btn btn-primary" style="submit">Logs</a>
<cwdb-action 
  action="call" 
  display="popup" 
  endpoint="${context.invokedFunctionArn}">
  { "serviceRegion": "${serviceRegion}", "action": "${ACTION_LOGS}", "allocationId": "${allocationId}" }
</cwdb-action>`;
}

async function findDirtyEnvironments(pool: string): Promise<ActiveEnvironment[]> {
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

async function fetchLogs(allocationId: string, from: Date, to: Date, serviceRegion: string) {

  const client = new CloudWatchLogs({ region: serviceRegion });
  const logGroupName = envars.Envars.required(envars.CLEANUP_LOG_GROUP_NAME_ENV);
  const queryString = `fields @timestamp, @message | filter @message like /aloc:${allocationId}/ | sort @timestamp asc | limit 10000`;

  console.log(`Starting execution of query '${queryString}' in log group '${logGroupName}'`);
  console.log(`Start time: ${from.toISOString()}, end time: ${to.toISOString()}`);

  const query = await client.startQuery({
    logGroupNames: [logGroupName],
    queryString,
    startTime: Math.floor(from.getTime() / 1000),
    endTime: Math.floor(to.getTime() / 1000),
  });

  const queryId = query.queryId;
  console.log(`Query started: ${queryId}`);

  while (true) {
    console.log(`Checking query status: ${queryId}`);
    const results = await client.getQueryResults({ queryId });
    if (results.status !== 'Complete') {
      await sleep(CHECK_QUERY_STATUS_DELAY_MS);
    } else {
      console.log(`Query completed: ${queryId}. Found ${results.results?.length ?? 0} hits.`);
      return results.results;
    }
  }
};

async function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
};

function stripPtr(result: ResultField[]) {
  return result.filter(entry => entry.field !== '@ptr');
}

function buildLogsTable(results: ResultField[][]) {
  const cols = stripPtr(results[0]).map(entry => entry.field);

  let html = `<table><thead><tr><th>${cols.join('</th><th>')}</th></tr></thead><tbody>`;

  results.forEach(row => {
    const vals = stripPtr(row).map(entry => entry.value);
    html += `<tr><td>${vals.join('</td><td>')}</td></tr>`;
  });

  return html;
}