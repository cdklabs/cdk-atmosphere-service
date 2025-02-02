"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/dashboards/custom-widgets/allocations-logs/allocation-logs.widget.lambda.ts
var allocation_logs_widget_lambda_exports = {};
__export(allocation_logs_widget_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(allocation_logs_widget_lambda_exports);
var import_client_cloudwatch_logs = require("@aws-sdk/client-cloudwatch-logs");

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
var ALLOCATE_LOG_GROUP_NAME_ENV = `${ENV_PREFIX}ALLOCATE_LOG_GROUP_NAME`;
var DEALLOCATE_LOG_GROUP_NAME_ENV = `${ENV_PREFIX}DEALLOCATE_LOG_GROUP_NAME`;
var ALLOCATION_TIMEOUT_LOG_GROUP_NAME_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_LOG_GROUP_NAME`;
var CLEANUP_TIMEOUT_LOG_GROUP_NAME_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_LOG_GROUP_NAME`;
var ENVIRONMENTS_TABLE_NAME_ENV = `${ENV_PREFIX}ENVIRONMENTS_TABLE_NAME`;
var CONFIGURATION_BUCKET_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_BUCKET`;
var CONFIGURATION_KEY_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_KEY`;
var SCHEDULER_DLQ_ARN_ENV = `${ENV_PREFIX}SCHEDULER_DLQ_ARN`;
var SCHEDULER_ROLE_ARN_ENV = `${ENV_PREFIX}SCHEDULER_ROLE_ARN`;
var CLEANUP_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_FUNCTION_ARN`;
var ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_FUNCTION_ARN`;
var REST_API_ID_ENV = `${ENV_PREFIX}REST_API_ID`;
var ALLOCATIONS_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATIONS_RESOURCE_ID`;
var ALLOCATION_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATION_RESOURCE_ID`;
var DEALLOCATE_FUNCTION_NAME_ENV = `${ENV_PREFIX}DEALLOCATE_FUNCTION_NAME`;
var CLEANUP_CLUSTER_ARN_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_ARN`;
var CLEANUP_CLUSTER_NAME_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_NAME`;
var CLEANUP_LOG_GROUP_NAME_ENV = `${ENV_PREFIX}CLEANUP_LOG_GROUP_NAME`;
var CLEANUP_TASK_DEFINITION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TASK_DEFINITION_ARN`;
var CLEANUP_TASK_SUBNET_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SUBNET_ID`;
var CLEANUP_TASK_SECURITY_GROUP_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SECURITY_GROUP_ID`;
var CLEANUP_TASK_CONTAINER_NAME_ENV = `${ENV_PREFIX}CLEANUP_TASK_CONTAINER_NAME`;
var CLEANUP_TASK_ALLOCATION_ID = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_ALLOCATION_ID`;
var CLEANUP_TASK_TIMEOUT_SECONDS = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_TIMEOUT_SECONDS`;
var Envars = class _Envars {
  static required(name) {
    const value = _Envars.optional(name);
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }
  static optional(name) {
    return process.env[name];
  }
};

// src/dashboards/custom-widgets/allocations-logs/allocation-logs.widget.lambda.ts
var CHECK_QUERY_STATUS_DELAY_MS = 250;
async function handler(event, context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  const serviceRegion = event.serviceRegion;
  const widgetContext = event.widgetContext;
  const form = widgetContext.forms.all;
  const allocationId = form.allocationId || event.allocationId;
  const to = /* @__PURE__ */ new Date();
  const from = /* @__PURE__ */ new Date();
  from.setDate(to.getDate() - 7);
  const logs = !!allocationId ? await fetchLogs(allocationId, from, to, serviceRegion) : void 0;
  console.log(`allocation id is empty: ${!!allocationId}`);
  let html = `
  <form>
  <table>
      <tr>
          <td>Id</td><td><input name="allocationId" value="${allocationId ?? ""}" size="100"></td>
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
async function fetchLogs(allocationId, from, to, serviceRegion) {
  const client = new import_client_cloudwatch_logs.CloudWatchLogs({ region: serviceRegion });
  const logGroupNames = [
    Envars.required(ALLOCATE_LOG_GROUP_NAME_ENV),
    Envars.required(DEALLOCATE_LOG_GROUP_NAME_ENV),
    Envars.required(ALLOCATION_TIMEOUT_LOG_GROUP_NAME_ENV),
    Envars.required(CLEANUP_TIMEOUT_LOG_GROUP_NAME_ENV),
    Envars.required(CLEANUP_LOG_GROUP_NAME_ENV)
  ];
  const queryString = `fields @timestamp, @message | filter @message like /aloc:${allocationId}/ | sort @timestamp asc | limit 10000`;
  console.log(`Starting execution of query '${queryString}' in log groups '${logGroupNames.join(",")}'`);
  console.log(`Start time: ${from.toISOString()}, end time: ${to.toISOString()}`);
  const query = await client.startQuery({
    logGroupNames,
    queryString,
    startTime: Math.floor(from.getTime() / 1e3),
    endTime: Math.floor(to.getTime() / 1e3)
  });
  const queryId = query.queryId;
  console.log(`Query started: ${queryId}`);
  while (true) {
    console.log(`Checking query status: ${queryId}`);
    const results = await client.getQueryResults({ queryId });
    if (results.status !== "Complete") {
      await sleep(CHECK_QUERY_STATUS_DELAY_MS);
    } else {
      console.log(`Query completed: ${queryId}. Found ${results.results?.length ?? 0} hits.`);
      return results.results;
    }
  }
}
function buildLogsTable(results) {
  const cols = stripPtr(results[0]).map((entry) => entry.field);
  let html = `<table><thead><tr><th>${cols.join("</th><th>")}</th></tr></thead><tbody>`;
  results.forEach((row) => {
    const vals = stripPtr(row).map((entry) => entry.value);
    html += `<tr><td>${vals.join("</td><td>")}</td></tr>`;
  });
  return html;
}
function stripPtr(result) {
  return result.filter((entry) => entry.field !== "@ptr");
}
async function sleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
