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

// test/integ/cleanup-timeout/assert.lambda.ts
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
var import_client_scheduler = require("@aws-sdk/client-scheduler");

// src/envars.ts
var ENV_PREFIX = "CDK_ATMOSPHERE_";
var ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
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

// src/storage/environments.client.ts
var ddb = __toESM(require("@aws-sdk/client-dynamodb"));
var EnvironmentsError = class extends Error {
  constructor(account, region, message) {
    super(`Environment aws://${account}/${region}: ${message}`);
  }
};
var EnvironmentAlreadyAcquiredError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already acquired");
  }
};
var EnvironmentAlreadyReleasedError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already released");
  }
};
var EnvironmentAlreadyInStatusError = class extends EnvironmentsError {
  constructor(account, region, status) {
    super(account, region, `already ${status}`);
  }
};
var EnvironmentAlreadyReallocated = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already reallocated");
  }
};
var EnvironmentsClient = class {
  constructor(tableName) {
    this.tableName = tableName;
    this.ddbClient = new ddb.DynamoDB({});
  }
  /**
   * Acquire an environment by inserting a new item into the table.
   * If the environment is already acquired, this will fail.
   */
  async acquire(allocationId, account, region) {
    try {
      await this.ddbClient.putItem({
        TableName: this.tableName,
        Item: {
          account: { S: account },
          region: { S: region },
          status: { S: "in-use" },
          allocation: { S: allocationId }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#region": "region",
          "#account": "account"
        },
        // ensures insertion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_not_exists(#account) AND attribute_not_exists(#region)"
      });
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new EnvironmentAlreadyAcquiredError(account, region);
      }
      throw e;
    }
  }
  /**
   * Release an environment by deleting an item from the table.
   * If the environment is already released, this will fail.
   */
  async release(allocationId, account, region) {
    try {
      await this.ddbClient.deleteItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#region": "region",
          "#account": "account",
          "#allocation": "allocation"
        },
        ExpressionAttributeValues: {
          ":allocation_value": { S: allocationId }
        },
        // ensures deletion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD"
      });
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }
        const old_allocation = e.Item.allocation?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }
      }
      throw e;
    }
  }
  /**
   * Mark the environment status as 'cleaning'.
   * If the environment is already in a 'cleaning' status, this will fail.
   */
  async cleaning(allocationId, account, region) {
    await this.setStatus(allocationId, account, region, "cleaning");
  }
  /**
   * Mark the environment status as 'dirty'.
   * If the environment is already in a 'dirty' status, this will fail.
   */
  async dirty(allocationId, account, region) {
    await this.setStatus(allocationId, account, region, "dirty");
  }
  async setStatus(allocationId, account, region, status) {
    try {
      await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#status": "status",
          "#allocation": "allocation"
        },
        ExpressionAttributeValues: {
          ":status_value": { S: status },
          ":allocation_value": { S: allocationId }
        },
        UpdateExpression: "SET #status = :status_value",
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate
        ConditionExpression: "#allocation = :allocation_value AND #status <> :status_value",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD"
      });
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }
        const old_allocation = e.Item.allocation?.S;
        const old_status = e.Item.status?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }
        if (old_status && old_status === status) {
          throw new EnvironmentAlreadyInStatusError(account, region, old_status);
        }
      }
      throw e;
    }
  }
};

// test/integ/service.session.ts
var apigw = new import_client_api_gateway.APIGateway();
var dynamo = new import_client_dynamodb.DynamoDB();
var cfn = new import_client_cloudformation.CloudFormation();
var scheduler = new import_client_scheduler.Scheduler();
var SUCCESS_PAYLOAD = "OK";
var Session = class _Session {
  constructor(vars) {
    this.vars = vars;
    this.sessionLog("Created session with variables:");
    console.log(JSON.stringify(this.vars, null, 2));
    this.environments = new EnvironmentsClient(this.vars[ENVIRONMENTS_TABLE_NAME_ENV]);
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
  static async assert(assertion, name = "default") {
    const session = await this.create();
    await session.clear();
    let failed = false;
    try {
      session.sessionLog(`\u{1F3AC} Start | ${name} | \u{1F3AC}`);
      await assertion(session);
      session.sessionLog(`\u2705 Success | ${name} | \u2705`);
      return SUCCESS_PAYLOAD;
    } catch (error) {
      session.sessionLog(`\u274C !! Fail | ${name} | !! \u274C`);
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
      const devStack = ((await cfn.describeStacks({ StackName: "atmosphere-integ-deallocate" })).Stacks ?? [])[0];
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
      [SCHEDULER_DLQ_ARN_ENV]: envValue(SCHEDULER_DLQ_ARN_ENV),
      [SCHEDULER_ROLE_ARN_ENV]: envValue(SCHEDULER_ROLE_ARN_ENV),
      [CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: envValue(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV),
      [ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: envValue(ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV),
      [REST_API_ID_ENV]: envValue(REST_API_ID_ENV),
      [ALLOCATIONS_RESOURCE_ID_ENV]: envValue(ALLOCATIONS_RESOURCE_ID_ENV),
      [ALLOCATION_RESOURCE_ID_ENV]: envValue(ALLOCATION_RESOURCE_ID_ENV),
      [DEALLOCATE_FUNCTION_NAME_ENV]: envValue(DEALLOCATE_FUNCTION_NAME_ENV)
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
  async fetchAllocationTimeoutSchedule(allocationId) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.aloc_${allocationId}`
    });
    return response.Schedules?.[0];
  }
  async fetchCleanupTimeoutSchedule(allocationId) {
    const response = await scheduler.listSchedules({
      NamePrefix: `atmosphere.timeout.clean_${allocationId}`
    });
    return response.Schedules?.[0];
  }
  async waitFor(condition, timeoutSeconds) {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1e3;
    while (true) {
      const finish = await condition();
      if (finish) {
        return;
      }
      const elapsed = Date.now() - startTime;
      assert.ok(elapsed < timeoutMs, `Timeout after ${timeoutSeconds} seconds`);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
  }
  async okFor(condition, timeoutSeconds) {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1e3;
    while (true) {
      const result = await condition();
      assert.ok(result);
      const elapsed = Date.now() - startTime;
      if (elapsed >= timeoutMs) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
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
    const schedules = (await scheduler.listSchedules({})).Schedules ?? [];
    for (const schedule of schedules) {
      this.sessionLog(`  \xBB deleting schedule ${schedule.Name}`);
      await scheduler.deleteSchedule({ Name: schedule.Name });
    }
  }
  log(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [assertion] ${message}`);
  }
  sessionLog(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [session] ${message}`);
  }
};

// test/integ/cleanup-timeout/assert.lambda.ts
async function handler(_) {
  await Session.assert(async (session) => {
    const allocateResponse = await session.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(allocateResponse.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const cleanupTimeoutSeconds = 10;
    await session.deallocate(body.id, { outcome: "success", cleanupDurationSeconds: cleanupTimeoutSeconds });
    const waitTime = cleanupTimeoutSeconds + 60;
    session.log(`Waiting ${waitTime} seconds for environment 'aws://${account}/${region}' to be marked dirty...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S === "dirty", waitTime);
  }, "cleanup-timeout-triggered-before-cleanup-finished");
  await Session.assert(async (session) => {
    const allocateResponse = await session.allocate({ pool: "release", requester: "test" });
    const body = JSON.parse(allocateResponse.body);
    const account = body.environment.account;
    const region = body.environment.region;
    const cleanupTimeoutSeconds = 30;
    await session.deallocate(body.id, { outcome: "success", cleanupDurationSeconds: cleanupTimeoutSeconds });
    await session.environments.release(body.id, account, region);
    const waitTime = cleanupTimeoutSeconds + 60;
    session.log(`Asserting for ${waitTime} seconds that environment 'aws://${account}/${region}' is released...`);
    await session.okFor(async () => (await session.fetchEnvironment(account, region)).Item === void 0, waitTime);
  }, "cleanup-timeout-triggered-after-cleanup-finished");
  await Session.assert(async (session) => {
    const allocateResponse = await session.allocate({ pool: "release", requester: "test" });
    const allocateResponsebody = JSON.parse(allocateResponse.body);
    const account = allocateResponsebody.environment.account;
    const region = allocateResponsebody.environment.region;
    const allocationId = allocateResponsebody.id;
    const cleanupTimeoutSeconds = 60;
    await session.deallocate(allocationId, { outcome: "success", cleanupDurationSeconds: cleanupTimeoutSeconds });
    await session.environments.release(allocationId, account, region);
    await session.allocate({ pool: "release", requester: "test" });
    const waitTime = cleanupTimeoutSeconds + 60;
    session.log(`Asserting for ${waitTime} seconds that environment 'aws://${account}/${region}' is not marked dirty...`);
    await session.okFor(async () => (await session.fetchEnvironment(account, region)).Item?.status?.S !== "dirty", waitTime);
  }, "cleanup-timeout-triggered-on-reallocated-environment");
  return SUCCESS_PAYLOAD;
}
if (Session.isLocal()) {
  void handler({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
