// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudWatchLogs, ResultField } from '@aws-sdk/client-cloudwatch-logs';
import { RuntimeClients } from '../../../clients';
import * as envars from '../../../envars';
import { Allocation } from '../../../storage/allocations.client';

const clients = RuntimeClients.getOrCreate();

const ACTION_LOGS = 'logs';
const CHECK_QUERY_STATUS_DELAY_MS = 250;

export async function handler(event: any, context: any) {

  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const pool = event.pool;
  const serviceRegion = event.serviceRegion;

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
        '<p><u>Successfully fetched allocation logs:</u></p>',
        '<br>',
        '<ul>',
        `<li><b>Id:</b> ${allocationId}</li>`,
        `<li><b>Requester:</b> ${allocation.requester}</li>`,
        `<li><b>Account:</b> ${allocation.account}</li>`,
        `<li><b>Region:</b> ${allocation.region}</li>`,
        `<li><b>Timespan:</b> ${from.toISOString()} to ${to.toISOString()}</li>`,
        '</ul>',
        '<br>',
        buildLogsTable(logs),
      ].join('');
    } else {
      return `<p><b>No logs found for allocation '${allocation.id}'</b></p>`;
    }
  }

  // no action performed, we just display the table
  console.log(`Finding allocations in pool '${pool}'`);
  const allocations = await findAllocations(pool);
  console.log(`Found ${allocations.length} allocations`);

  if (allocations.length === 0) {
    return '<br><p><b>No unsuccessfull allocations, hurray!</b></p>';
  }

  return buildTable(allocations, context, serviceRegion);

}

function buildTable(allocations: Allocation[], context: any, serviceRegion: string) {
  const columns = ['account', 'region', 'id', 'outcome', 'requester', 'start'];
  // amazonq-ignore-next-line
  const header = [
    '<tr>',
    ...columns.map(c => `<th>${c}</th>`),
    '<th>',
    'actions',
    '</th>',
    '</tr>',
  ].join('');

  const rows = allocations.map(a => {
    // amazonq-ignore-next-line
    return [
      '<tr>',
      ...columns.map(c => `<td>${(a as any)[c]}</td>`),
      '<td>',
      '<div style="display: flex; justify-content: space-between; width: 100%; gap: 10px;">',
      buildViewLogsAction(a.id, context, serviceRegion),
      '</div>',
      '</td>',
      '</tr>',
    ].join('');
  });

  return `<br><table>${header}${rows}</table>`;
}

async function findAllocations(pool: string): Promise<Allocation[]> {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const allocations = await clients.allocations.scan(from);
  const result = [];
  for (const allocation of allocations) {
    if (allocation.pool === pool && allocation.outcome && ['failed', 'timeout'].includes(allocation.outcome)) {
      result.push(allocation);
    }
  }
  return result;

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

function buildLogsTable(results: ResultField[][]) {
  const cols = stripPtr(results[0]).map(entry => entry.field);

  let html = `<table><thead><tr><th>${cols.join('</th><th>')}</th></tr></thead><tbody>`;

  results.forEach(row => {
    const vals = stripPtr(row).map(entry => entry.value);
    html += `<tr><td>${vals.join('</td><td>')}</td></tr>`;
  });

  return html;
}

function stripPtr(result: ResultField[]) {
  return result.filter(entry => entry.field !== '@ptr');
}

async function fetchLogs(allocationId: string, from: Date, to: Date, serviceRegion: string) {

  const client = new CloudWatchLogs({ region: serviceRegion });
  const logGroupNames = [
    envars.Envars.required(envars.ALLOCATE_LOG_GROUP_NAME_ENV),
    envars.Envars.required(envars.DEALLOCATE_LOG_GROUP_NAME_ENV),
    envars.Envars.required(envars.ALLOCATION_TIMEOUT_LOG_GROUP_NAME_ENV),
    envars.Envars.required(envars.CLEANUP_TIMEOUT_LOG_GROUP_NAME_ENV),
    envars.Envars.required(envars.CLEANUP_LOG_GROUP_NAME_ENV),
  ];
  const queryString = `fields @timestamp, @message | filter @message like /aloc:${allocationId}/ | sort @timestamp asc | limit 10000`;

  console.log(`Starting execution of query '${queryString}' in log groups '${logGroupNames.join(',')}'`);
  console.log(`Start time: ${from.toISOString()}, end time: ${to.toISOString()}`);

  const query = await client.startQuery({
    logGroupNames,
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
