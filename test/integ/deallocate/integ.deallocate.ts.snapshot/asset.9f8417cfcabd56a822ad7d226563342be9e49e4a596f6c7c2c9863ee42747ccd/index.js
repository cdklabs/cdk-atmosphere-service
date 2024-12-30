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

// test/integ/deallocate/assert.lambda.ts
var assert_lambda_exports = {};
__export(assert_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(assert_lambda_exports);
var assert = __toESM(require("assert"));

// test/integ/service.session.ts
var import_client_api_gateway = require("@aws-sdk/client-api-gateway");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var apigw = new import_client_api_gateway.APIGateway();
var dynamo = new import_client_dynamodb.DynamoDB();
var SUCCESS_PAYLOAD = "OK";
var Session = class _Session {
  constructor(api, environmentsTableName, allocationsTableName) {
    this.api = api;
    this.environmentsTableName = environmentsTableName;
    this.allocationsTableName = allocationsTableName;
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
    return new _Session(
      await discoverRestApi(),
      await discoverEnvironmentsTable(),
      await discoverAllocationsTable()
    );
  }
  async allocate(body) {
    const json = JSON.stringify(body);
    this.log(`Sending allocation request with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationsResourceId,
      httpMethod: "POST",
      pathWithQueryString: "/allocations",
      body: json
    });
  }
  async deallocate(id, body) {
    const json = JSON.stringify(body);
    this.log(`Sending deallocation request for allocation '${id}' with body: ${json}`);
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationResourceId,
      httpMethod: "DELETE",
      pathWithQueryString: `/allocations/${id}`,
      body: json
    });
  }
  async fetchEnvironment(account, region) {
    return dynamo.getItem({
      TableName: this.environmentsTableName,
      Key: {
        account: { S: account },
        region: { S: region }
      }
    });
  }
  async fetchAllocation(id) {
    return dynamo.getItem({
      TableName: this.allocationsTableName,
      Key: { id: { S: id } }
    });
  }
  async clear() {
    this.sessionLog("Clearing state");
    const environments = (await dynamo.scan({ TableName: this.environmentsTableName })).Items ?? [];
    for (const environment of environments) {
      this.sessionLog(`  \xBB deleting environment aws://${environment.account.S}/${environment.region.S}`);
      await dynamo.deleteItem({
        TableName: this.environmentsTableName,
        Key: {
          account: { S: environment.account.S },
          region: { S: environment.region.S }
        }
      });
    }
    const allocations = (await dynamo.scan({ TableName: this.allocationsTableName })).Items ?? [];
    for (const allocation of allocations) {
      this.sessionLog(`  \xBB deleting allocation ${allocation.id.S}`);
      await dynamo.deleteItem({
        TableName: this.allocationsTableName,
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
async function discoverRestApi() {
  const api = ((await apigw.getRestApis()).items ?? []).filter((a) => a.name === "Atmosphere")[0];
  if (!api) {
    throw new Error("Unable to discover Atmosphere Rest API. Is it deployed?");
  }
  const resources = (await apigw.getResources({ restApiId: api.id })).items ?? [];
  const allocations = resources.filter((r) => r.path === "/allocations")[0];
  const allocation = resources.filter((r) => r.path === "/allocations/{id}")[0];
  if (!allocations) {
    throw new Error("Unable to find /allocations resource");
  }
  if (!allocation) {
    throw new Error("Unable to find /allocations/{id} resource");
  }
  return {
    id: api.id,
    allocationsResourceId: allocations.id,
    allocationResourceId: allocation.id
  };
}
async function discoverAllocationsTable() {
  const table = ((await dynamo.listTables({})).TableNames ?? []).filter((t) => t.includes("AllocationsTable"))[0];
  if (!table) {
    throw new Error("Unable to discover Atmosphere Allocations table. Is it deployed?");
  }
  return table;
}
async function discoverEnvironmentsTable() {
  const table = ((await dynamo.listTables({})).TableNames ?? []).filter((t) => t.includes("EnvironmentsTable"))[0];
  if (!table) {
    throw new Error("Unable to discover Atmosphere Allocations table. Is it deployed?");
  }
  return table;
}

// test/integ/deallocate/assert.lambda.ts
async function handler(_) {
  return Session.assert(async (session) => {
    const output = await session.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(output.body);
    const deallocateResponse = await session.deallocate(body.id, { outcome: "success" });
    assert.strictEqual(deallocateResponse.status, 200);
    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);
    assert.strictEqual(environment.Item.status.S, "cleaning");
  });
}
if (process.env.CDK_ATMOSPHERE_INTEG !== "true") {
  void handler({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
