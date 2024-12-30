"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// test/integ/dev/assert.lambda.ts
var assert_lambda_exports = {};
__export(assert_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(assert_lambda_exports);

// test/integ/service.session.ts
var assert = __toESM(require("assert"));
var import_client_api_gateway = require("@aws-sdk/client-api-gateway");
var import_client_cloudformation = require("@aws-sdk/client-cloudformation");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
var ENVIRONMENTS_TABLE_NAME_ENV = `${ENV_PREFIX}ENVIRONMENTS_TABLE_NAME`;
var CONFIGURATION_BUCKET_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_BUCKET`;
var CONFIGURATION_KEY_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_KEY`;
var REST_API_ID_ENV = `${ENV_PREFIX}REST_API_ID`;
var ALLOCATIONS_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATIONS_RESOURCE_ID`;
var ALLOCATION_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATION_RESOURCE_ID`;
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

// test/integ/service.session.ts
var apigw = new import_client_api_gateway.APIGateway();
var dynamo = new import_client_dynamodb.DynamoDB();
var cfn = new import_client_cloudformation.CloudFormation();
var SUCCESS_PAYLOAD = "OK";
var Session = class _Session {
  constructor(vars) {
    this.vars = vars;
    this.sessionLog(`Created session with variables: ${JSON.stringify(this.vars, null, 2)}`);
  }
  /**
   * Running locally or in lambda as part of integ.
   */
  static isLocal() {
    return process.env.CDK_ATMOSPHERE_INTEG !== "true";
  }
  /**
   * Run an assertion function in a fresh service state.
   */
  static async assert(assertion) {
    const session = await this.create();
    await session.clear();
    let failed = false;
    try {
      session.sessionLog("\u{1F3AC} Start \u{1F3AC}");
      await assertion(session);
      session.sessionLog("\u2705 Success \u2705");
      return SUCCESS_PAYLOAD;
    } catch (error) {
      session.sessionLog("\u274C !! Fail !! \u274C");
      failed = true;
      throw error;
    } finally {
      if (failed && _Session.isLocal()) {
        session.sessionLog("Not clearing state to help troubleshoot the error");
      } else {
        await session.clear();
      }
    }
  }
  static async create() {
    let envValue;
    if (_Session.isLocal()) {
      const devStack = ((await cfn.describeStacks({ StackName: "atmoshpere-integ-dev" })).Stacks ?? [])[0];
      assert.ok(devStack, "Missing dev stack. Deploy by running: 'yarn integ:dev'");
      envValue = (name) => {
        const value = (devStack.Outputs ?? []).find((o) => o.OutputKey === name.replace(/_/g, "0"))?.OutputValue;
        assert.ok(value, `Missing output '${name}' from dev stack`);
        return value;
      };
    } else {
      envValue = (name) => Envars.required(name);
    }
    return new _Session({
      [ALLOCATIONS_TABLE_NAME_ENV]: envValue(ALLOCATIONS_TABLE_NAME_ENV),
      [ENVIRONMENTS_TABLE_NAME_ENV]: envValue(ENVIRONMENTS_TABLE_NAME_ENV),
      [CONFIGURATION_BUCKET_ENV]: envValue(CONFIGURATION_BUCKET_ENV),
      [CONFIGURATION_KEY_ENV]: envValue(CONFIGURATION_KEY_ENV),
      [REST_API_ID_ENV]: envValue(REST_API_ID_ENV),
      [ALLOCATIONS_RESOURCE_ID_ENV]: envValue(ALLOCATIONS_RESOURCE_ID_ENV),
      [ALLOCATION_RESOURCE_ID_ENV]: envValue(ALLOCATION_RESOURCE_ID_ENV)
    });
  }
  async allocate(body) {
    const json = JSON.stringify(body);
    this.log(`Sending allocation request with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[REST_API_ID_ENV],
      resourceId: this.vars[ALLOCATIONS_RESOURCE_ID_ENV],
      httpMethod: "POST",
      pathWithQueryString: "/allocations",
      body: json
    });
  }
  async deallocate(id, body) {
    const json = JSON.stringify(body);
    this.log(`Sending deallocation request for allocation '${id}' with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[REST_API_ID_ENV],
      resourceId: this.vars[ALLOCATION_RESOURCE_ID_ENV],
      httpMethod: "DELETE",
      pathWithQueryString: `/allocations/${id}`,
      body: json
    });
  }
  async fetchEnvironment(account, region) {
    return dynamo.getItem({
      TableName: this.vars[ENVIRONMENTS_TABLE_NAME_ENV],
      Key: {
        account: { S: account },
        region: { S: region }
      }
    });
  }
  async fetchAllocation(id) {
    return dynamo.getItem({
      TableName: this.vars[ALLOCATIONS_TABLE_NAME_ENV],
      Key: { id: { S: id } }
    });
  }
  async clear() {
    this.sessionLog("Clearing state");
    const environments = (await dynamo.scan({ TableName: this.vars[ENVIRONMENTS_TABLE_NAME_ENV] })).Items ?? [];
    for (const environment of environments) {
      this.sessionLog(`  \xBB deleting environment aws://${environment.account.S}/${environment.region.S}`);
      await dynamo.deleteItem({
        TableName: this.vars[ENVIRONMENTS_TABLE_NAME_ENV],
        Key: {
          account: { S: environment.account.S },
          region: { S: environment.region.S }
        }
      });
    }
    const allocations = (await dynamo.scan({ TableName: this.vars[ALLOCATIONS_TABLE_NAME_ENV] })).Items ?? [];
    for (const allocation of allocations) {
      this.sessionLog(`  \xBB deleting allocation ${allocation.id.S}`);
      await dynamo.deleteItem({
        TableName: this.vars[ALLOCATIONS_TABLE_NAME_ENV],
        Key: {
          id: { S: allocation.id.S }
        }
      });
    }
  }
  log(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [assertion] ${message}`);
  }
  sessionLog(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [session] ${message}`);
  }
};

// test/integ/dev/assert.lambda.ts
async function handler(_) {
  return Session.assert(async () => {
    return;
  });
}
if (Session.isLocal()) {
  void handler({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
