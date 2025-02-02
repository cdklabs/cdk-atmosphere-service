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

// src/scheduler/allocation-timeout/allocation-timeout.lambda.ts
var allocation_timeout_lambda_exports = {};
__export(allocation_timeout_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(allocation_timeout_lambda_exports);
var import_client_lambda = require("@aws-sdk/client-lambda");

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
var ENVIRONMENTS_TABLE_NAME_ENV = `${ENV_PREFIX}ENVIRONMENTS_TABLE_NAME`;
var CONFIGURATION_BUCKET_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_BUCKET`;
var CONFIGURATION_KEY_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_KEY`;
var ALLOCATION_TIMEOUT_DLQ_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_DLQ_ARN`;
var CLEANUP_TIMEOUT_DLQ_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_DLQ_ARN`;
var SCHEDULER_ROLE_ARN_ENV = `${ENV_PREFIX}SCHEDULER_ROLE_ARN`;
var CLEANUP_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_FUNCTION_ARN`;
var ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_FUNCTION_ARN`;
var REST_API_ID_ENV = `${ENV_PREFIX}REST_API_ID`;
var ALLOCATIONS_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATIONS_RESOURCE_ID`;
var ALLOCATION_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATION_RESOURCE_ID`;
var DEALLOCATE_FUNCTION_NAME_ENV = `${ENV_PREFIX}DEALLOCATE_FUNCTION_NAME`;
var CLEANUP_CLUSTER_ARN_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_ARN`;
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

// src/logging.ts
var AllocationLogger = class {
  constructor(props) {
    this.prefix = `[${props.component}] [aloc:${props.id}]`;
  }
  info(message) {
    console.log(`${this.prefix} ${message}`);
  }
  error(error, message = "") {
    console.error(`${this.prefix} ${message}`, error);
  }
};

// src/scheduler/allocation-timeout/allocation-timeout.lambda.ts
async function handler(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const log = new AllocationLogger({ id: event.allocationId, component: "allocation-timeout" });
  try {
    const body = JSON.stringify({ outcome: "timeout" });
    const lambda = new import_client_lambda.Lambda();
    const payload = JSON.stringify({ pathParameters: { id: event.allocationId }, body });
    const target = Envars.required(DEALLOCATE_FUNCTION_NAME_ENV);
    log.info(`Invoking ${target} with payload: ${payload}`);
    const response = await lambda.invoke({ FunctionName: target, InvocationType: "RequestResponse", Payload: payload });
    const responsePayload = JSON.parse(response.Payload?.transformToString("utf-8") ?? "{}");
    if (responsePayload.statusCode !== 200) {
      throw new Error(`Unexpected response status code ${responsePayload.statusCode}: ${responsePayload.body}`);
    }
    log.info("Done");
  } catch (e) {
    log.error(e);
    throw e;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
