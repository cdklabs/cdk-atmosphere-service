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

// test/integ/allocate/assert.lambda.ts
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
   * Run an assertion function in a fresh service state.
   */
  static async run(assert2) {
    const session = await this.create();
    await session.clear();
    try {
      await assert2(session);
      return SUCCESS_PAYLOAD;
    } finally {
      await session.clear();
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
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationsResourceId,
      httpMethod: "POST",
      pathWithQueryString: "/allocations",
      body: JSON.stringify(body)
    });
  }
  async deallocate(id, body) {
    return apigw.testInvokeMethod({
      restApiId: this.api.id,
      resourceId: this.api.allocationResourceId,
      httpMethod: "DELETE",
      pathWithQueryString: `/allocations/${id}`,
      body: JSON.stringify(body)
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
    const environments = (await dynamo.scan({ TableName: this.environmentsTableName })).Items ?? [];
    for (const environment of environments) {
      console.log(`Deleting environment aws://${environment.account.S}/${environment.region.S}`);
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
      console.log(`Deleting allocation ${allocation.id.S}`);
      await dynamo.deleteItem({
        TableName: this.allocationsTableName,
        Key: {
          id: { S: allocation.id.S }
        }
      });
    }
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

// test/integ/allocate/assert.lambda.ts
async function handler(_) {
  return Session.run(async (session) => {
    let output = await session.allocate({ pool: "release", requester: "test" });
    assert.strictEqual(output.status, 200, "Expected first allocation to succeed");
    const body = JSON.parse(output.body);
    const environment = await session.fetchEnvironment(body.environment.account, body.environment.region);
    const allocation = await session.fetchAllocation(body.id);
    assert.strictEqual(environment.Item.status.S, "in-use");
    assert.strictEqual(allocation.Item.account.S, body.environment.account);
    assert.strictEqual(allocation.Item.region.S, body.environment.region);
    output = await session.allocate({ pool: "release", requester: "test" });
    assert.strictEqual(output.status, 423, "Expected second allocation to fail");
  });
}
if (process.env.CDK_ATMOSPHERE_INTEG !== "true") {
  void handler({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
