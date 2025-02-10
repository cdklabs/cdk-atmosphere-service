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

// src/canaries/anonymous-access/anonymous-access.canary.lambda.ts
var anonymous_access_canary_lambda_exports = {};
__export(anonymous_access_canary_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(anonymous_access_canary_lambda_exports);

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ENDPOINT_URL_ENV = `${ENV_PREFIX}ENDPOINT_URL`;
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

// src/canaries/anonymous-access/anonymous-access.canary.lambda.ts
async function handler(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  await ensureUnauthorized("POST", "allocations");
  await ensureUnauthorized("DELETE", "allocations/some-id");
}
async function ensureUnauthorized(method, path) {
  const endpoint = Envars.required(ENDPOINT_URL_ENV);
  const url = `${endpoint}${path}`;
  console.log(`Executing HTTP request: ${method} ${url}`);
  const response = await fetch(url, { method });
  if (response.status !== 403) {
    throw new Error(`Unexpected status on request ${method} ${url} (expected 403, got ${response.status})`);
  }
  console.log("Receieved exepcted status: 403");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
