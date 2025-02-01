// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudWatchLogs, ResultField } from '@aws-sdk/client-cloudwatch-logs';
import * as envars from '../../../envars';

const CHECK_QUERY_STATUS_DELAY_MS = 250;

export async function handler(event: any, context: any) {

  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const serviceRegion = event.serviceRegion;

  const widgetContext = event.widgetContext;
  const form = widgetContext.forms.all;
  const allocationId = form.allocationId || event.allocationId;

  const to = new Date();

  // start looking from 7 days ago, this should be a big enough
  // window for us to address the alarm.
  const from = new Date();
  from.setDate(to.getDate() - 7);

  const logs = !!allocationId ? await fetchLogs(allocationId, from, to, serviceRegion): undefined;

  console.log(`allocation id is empty: ${!!allocationId}`);

  let html = `
  <form>
  <table>
      <tr>
          <td>Id</td><td><input name="allocationId" value="${allocationId ?? ''}" size="100"></td>
      </tr>
  </table>
  </form>
  <a class="btn btn-primary">Run query</a>
  <cwdb-action action="call" endpoint="${context.invokedFunctionArn}"></cwdb-action>
  <br><br>
  <p><h2>Results (1 week)</h2>`;

  if (logs && logs.length > 0) {
    html += buildLogsTable(logs);
  } else if (!!allocationId) {
    html += `<br><p><b>No results found for allocation '${allocationId}'</b>`;
  }

  return html;
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

async function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
};
