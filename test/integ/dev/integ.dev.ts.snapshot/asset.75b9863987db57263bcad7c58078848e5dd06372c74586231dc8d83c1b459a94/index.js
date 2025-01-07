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
  handler: () => handler4
});
module.exports = __toCommonJS(assert_lambda_exports);

// test/integ/service.session.ts
var assert = __toESM(require("assert"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var import_client_api_gateway = require("@aws-sdk/client-api-gateway");
var import_client_cloudformation2 = require("@aws-sdk/client-cloudformation");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_client_ecs2 = require("@aws-sdk/client-ecs");
var import_client_scheduler2 = require("@aws-sdk/client-scheduler");

// src/allocate/allocate.lambda.ts
var import_client_sts = require("@aws-sdk/client-sts");

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/cleanup/cleanup.client.ts
var import_client_ecs = require("@aws-sdk/client-ecs");

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
var CLEANUP_CLUSTER_ARN_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_ARN`;
var CLEANUP_TASK_DEFINITION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TASK_DEFINITION_ARN`;
var CLEANUP_TASK_SUBNET_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SUBNET_ID`;
var CLEANUP_TASK_SECURITY_GROUP_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SECURITY_GROUP_ID`;
var CLEANUP_TASK_CONTAINER_NAME_ENV = `${ENV_PREFIX}CLEANUP_TASK_CONTAINER_NAME`;
var CLEANUP_TASK_ALLOCATION_ID = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_ALLOCATION_ID`;
var CLEANUP_TASK_TIMEOUT_SECONDS = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_TIMEOUT_SECONDS`;
var Envars = class _Envars {
  static required(name) {
    const value2 = _Envars.optional(name);
    if (!value2) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value2;
  }
  static optional(name) {
    return process.env[name];
  }
};

// src/cleanup/cleanup.client.ts
var CleanupClient = class {
  constructor(props) {
    this.props = props;
    this.ecs = new import_client_ecs.ECS();
  }
  async start(opts) {
    const response = await this.ecs.runTask({
      cluster: this.props.clusterArn,
      taskDefinition: this.props.taskDefinitionArn,
      launchType: "FARGATE",
      // for troubleshooting. this allows task filtering
      // on the aws console.
      startedBy: opts.allocation.id,
      group: `aws://${opts.allocation.account}/${opts.allocation.region}`,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [this.props.subnetId],
          securityGroups: [this.props.securityGroupId],
          assignPublicIp: "ENABLED"
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: this.props.containerName,
            environment: [
              { name: CLEANUP_TASK_ALLOCATION_ID, value: opts.allocation.id },
              { name: CLEANUP_TASK_TIMEOUT_SECONDS, value: `${opts.timeoutSeconds}` }
            ]
          }
        ]
      }
    });
    return response.tasks[0].taskArn;
  }
};

// src/config/configuration.client.ts
var s3 = __toESM(require("@aws-sdk/client-s3"));
var EnvironmentNotFoundError = class extends Error {
  constructor(account, region) {
    super(`Environment aws://${account}/${region} not found`);
    this.account = account;
    this.region = region;
  }
};
var ConfigurationClient = class {
  constructor(s3Location) {
    this.s3Location = s3Location;
    this.s3Client = new s3.S3();
  }
  /**
   * Retrieve environments belonging to a specific pool.
   */
  async listEnvironments(opts = {}) {
    return (await this.data).environments.filter((e) => opts.pool ? e.pool === opts.pool : true);
  }
  /**
   * Retrieve a single environment based on account + region.
   */
  async getEnvironment(account, region) {
    const envs = (await this.data).environments.filter((e) => e.account === account && e.region === region);
    if (envs.length === 0) {
      throw new EnvironmentNotFoundError(account, region);
    }
    if (envs.length > 1) {
      throw new Error(`Multiple environments found for aws://${account}/${region}`);
    }
    return envs[0];
  }
  // lazy async getter
  get data() {
    return (async () => {
      if (this._data) {
        return this._data;
      }
      this._data = await this.download();
      return this._data;
    })();
  }
  async download() {
    const response = await this.s3Client.getObject({
      Bucket: this.s3Location.bucket,
      Key: this.s3Location.key
    });
    if (!response.Body) {
      throw new Error(`Configuration file (s3://${this.s3Location.bucket}/${this.s3Location.key}) is empty`);
    }
    return JSON.parse(await response.Body.transformToString("utf-8"));
  }
};

// src/scheduler/scheduler.client.ts
var import_client_scheduler = require("@aws-sdk/client-scheduler");
var SchedulerClient = class _SchedulerClient {
  constructor(props) {
    this.props = props;
    this.scheduler = new import_client_scheduler.Scheduler();
  }
  static {
    this.TIMEOUT_EVENT_PREFIX = "atmosphere.timeout";
  }
  async scheduleAllocationTimeout(opts) {
    const prefix = `${_SchedulerClient.TIMEOUT_EVENT_PREFIX}.aloc_`;
    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces timeout for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId }
    });
  }
  async scheduleCleanupTimeout(opts) {
    const prefix = `${_SchedulerClient.TIMEOUT_EVENT_PREFIX}.clean_`;
    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces cleanup for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId, account: opts.account, region: opts.region }
    });
  }
  scheduleExpression(date) {
    return `at(${date.toISOString().slice(0, 19)})`;
  }
  async scheduleLambdaInvoke(opts) {
    if (opts.name.length >= 64) {
      throw new Error(`Scheduler name '${opts.name}' is too long. Must be less than 64 characters.`);
    }
    await this.scheduler.createSchedule({
      Name: opts.name,
      Description: opts.description,
      FlexibleTimeWindow: { Mode: "OFF" },
      ScheduleExpression: this.scheduleExpression(opts.at),
      ScheduleExpressionTimezone: "UTC",
      Target: {
        DeadLetterConfig: {
          Arn: this.props.dlqArn
        },
        Arn: opts.functionArn,
        RoleArn: this.props.roleArn,
        Input: JSON.stringify(opts.payload)
      },
      ActionAfterCompletion: "DELETE"
    });
  }
};

// src/storage/allocations.client.ts
var ddb = __toESM(require("@aws-sdk/client-dynamodb"));
var AllocationAlreadyEndedError = class extends Error {
  constructor(id) {
    super(`Allocation ${id} is already ended`);
  }
};
var InvalidInputError = class extends Error {
  constructor(message) {
    super(`Invalid input: ${message}`);
  }
};
var AllocationNotFoundError = class extends Error {
  constructor(id) {
    super(`Allocation ${id} not found`);
  }
};
var AllocationsClient = class {
  constructor(tableName) {
    this.tableName = tableName;
    this.ddbClient = new ddb.DynamoDB({});
  }
  /**
   * Retrieve an allocation by id.
   */
  async get(id) {
    const response = await this.ddbClient.getItem({
      TableName: this.tableName,
      Key: {
        id: { S: id }
      }
    });
    if (!response.Item) {
      throw new AllocationNotFoundError(id);
    }
    return {
      account: value("account", response.Item),
      region: value("region", response.Item),
      pool: value("pool", response.Item),
      start: value("start", response.Item),
      end: value("end", response.Item),
      requester: value("requester", response.Item),
      id: value("id", response.Item),
      outcome: value("outcome", response.Item)
    };
  }
  /**
   * Start an allocation for a specific environment. Returns the allocation id.
   */
  async start(opts) {
    if (Buffer.byteLength(opts.requester) > 1024) {
      throw new InvalidInputError("requester must be less than 1024 bytes");
    }
    const nowSeconds = Math.floor(Date.now() / 1e3);
    const sixMonthsSeconds = 26 * 7 * 24 * 60 * 60;
    await this.ddbClient.putItem({
      TableName: this.tableName,
      Item: {
        id: { S: opts.id },
        account: { S: opts.account },
        region: { S: opts.region },
        pool: { S: opts.pool },
        start: { S: (/* @__PURE__ */ new Date()).toISOString() },
        requester: { S: opts.requester },
        ttl: { N: `${nowSeconds + sixMonthsSeconds}` }
      }
    });
  }
  /**
   * End the allocation. Throws if the allocation has already ended.
   */
  async end(opts) {
    if (Buffer.byteLength(opts.outcome) > 100) {
      throw new InvalidInputError("outcome must be less than 100 bytes");
    }
    try {
      const response = await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          id: { S: opts.id }
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          "#end": "end",
          "#outcome": "outcome"
        },
        ExpressionAttributeValues: {
          ":end": { S: (/* @__PURE__ */ new Date()).toISOString() },
          ":outcome": { S: opts.outcome }
        },
        UpdateExpression: "SET #end = :end, #outcome = :outcome",
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_not_exists(#end) AND attribute_not_exists(#outcome)",
        ReturnValues: "ALL_NEW"
      });
      if (!response.Attributes) {
        throw new Error("Unable to retrieve item attributes");
      }
      return {
        account: value("account", response.Attributes),
        region: value("region", response.Attributes),
        pool: value("pool", response.Attributes),
        start: value("start", response.Attributes),
        end: value("end", response.Attributes),
        requester: value("requester", response.Attributes),
        id: value("id", response.Attributes),
        outcome: value("outcome", response.Attributes)
      };
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new AllocationAlreadyEndedError(opts.id);
      }
      throw e;
    }
  }
};
function value(name, attributes) {
  const attribute = attributes[name];
  if (!attribute) {
    throw new Error(`Attribute '${name}' not found`);
  }
  if (attribute.S) {
    return attribute.S;
  }
  throw new Error(`Attribute '${name}' does not have a value`);
}

// src/storage/environments.client.ts
var ddb2 = __toESM(require("@aws-sdk/client-dynamodb"));
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
var EnvironmentAlreadyInUseError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already in-use");
  }
};
var EnvironmentAlreadyInStatusError = class extends EnvironmentsError {
  constructor(account, region, status) {
    super(account, region, `already ${status}`);
  }
};
var EnvironmentAlreadyDirtyError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already dirty");
  }
};
var EnvironmentAlreadyCleaningError = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "already cleaning");
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
    this.ddbClient = new ddb2.DynamoDB({});
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
      if (e instanceof ddb2.ConditionalCheckFailedException) {
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
          "#allocation": "allocation",
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":allocation_value": { S: allocationId },
          // we only expect to release an environment that is currenly being cleaned.
          // 'in-use' environments should not be released until they cleaned
          // 'dirty' environments should not be released because they trigger human intervention.
          ":expected_status_value": { S: "cleaning" }
        },
        // ensures deletion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value AND #status = :expected_status_value",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD"
      });
    } catch (e) {
      if (e instanceof ddb2.ConditionalCheckFailedException) {
        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }
        const old_allocation = e.Item.allocation?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }
        const old_status = e.Item.status?.S;
        if (old_status) {
          switch (old_status) {
            case "in-use":
              throw new EnvironmentAlreadyInUseError(account, region);
            case "dirty":
              throw new EnvironmentAlreadyDirtyError(account, region);
            default:
              throw new Error(`Unexpected status for environment aws://${account}/${region}: ${old_status}`);
          }
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
    try {
      await this.setStatus(allocationId, account, region, "cleaning");
    } catch (e) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyCleaningError(account, region);
      }
      throw e;
    }
  }
  /**
   * Mark the environment status as 'dirty'.
   * If the environment is already in a 'dirty' status, this will fail.
   */
  async dirty(allocationId, account, region) {
    try {
      await this.setStatus(allocationId, account, region, "dirty");
    } catch (e) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyDirtyError(account, region);
      }
      throw e;
    }
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
      if (e instanceof ddb2.ConditionalCheckFailedException) {
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

// src/clients.ts
var RuntimeClients = class _RuntimeClients {
  static getOrCreate() {
    if (!this._instance) {
      this._instance = new _RuntimeClients();
    }
    return this._instance;
  }
  get configuration() {
    if (!this._configuration) {
      const bucket = Envars.required(CONFIGURATION_BUCKET_ENV);
      const key = Envars.required(CONFIGURATION_KEY_ENV);
      this._configuration = new ConfigurationClient({ bucket, key });
    }
    return this._configuration;
  }
  get environments() {
    if (!this._environments) {
      const tableName = Envars.required(ENVIRONMENTS_TABLE_NAME_ENV);
      this._environments = new EnvironmentsClient(tableName);
    }
    return this._environments;
  }
  get allocations() {
    if (!this._allocations) {
      const tableName = Envars.required(ALLOCATIONS_TABLE_NAME_ENV);
      this._allocations = new AllocationsClient(tableName);
    }
    return this._allocations;
  }
  get scheduler() {
    if (!this._scheduler) {
      const roleArn = Envars.required(SCHEDULER_ROLE_ARN_ENV);
      const dlqArn = Envars.required(SCHEDULER_DLQ_ARN_ENV);
      this._scheduler = new SchedulerClient({ roleArn, dlqArn });
    }
    return this._scheduler;
  }
  get cleanup() {
    if (!this._cleanup) {
      const clusterArn = Envars.required(CLEANUP_CLUSTER_ARN_ENV);
      const taskDefinitionArn = Envars.required(CLEANUP_TASK_DEFINITION_ARN_ENV);
      const subnetId = Envars.required(CLEANUP_TASK_SUBNET_ID_ENV);
      const securityGroupId = Envars.required(CLEANUP_TASK_SECURITY_GROUP_ID_ENV);
      const containerName = Envars.required(CLEANUP_TASK_CONTAINER_NAME_ENV);
      this._cleanup = new CleanupClient({ clusterArn, taskDefinitionArn, subnetId, securityGroupId, containerName });
    }
    return this._cleanup;
  }
};

// src/allocate/allocate.lambda.ts
var MAX_ALLOCATION_DURATION_SECONDS = 60 * 60;
var ProxyError = class extends Error {
  constructor(statusCode, message) {
    super(`${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.message = message;
  }
};
var clients = RuntimeClients.getOrCreate();
async function handler(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  try {
    console.log("Parsing request body");
    const request = parseRequestBody(event.body);
    const durationSeconds = request.durationSeconds ?? MAX_ALLOCATION_DURATION_SECONDS;
    if (durationSeconds > MAX_ALLOCATION_DURATION_SECONDS) {
      throw new ProxyError(400, `Maximum allocation duration is ${MAX_ALLOCATION_DURATION_SECONDS} seconds`);
    }
    const timeoutDate = new Date(Date.now() + 1e3 * durationSeconds);
    const allocationId = v4_default();
    console.log(`Acquiring environment from pool '${request.pool}'`);
    const environment = await acquireEnvironment(allocationId, request.pool);
    console.log(`Starting allocation of 'aws://${environment.account}/${environment.region}'`);
    await startAllocation(allocationId, environment, request.requester);
    console.log(`Grabbing credentials to aws://${environment.account}/${environment.region} using role: ${environment.adminRoleArn}`);
    const credentials = await grabCredentials(allocationId, environment);
    console.log(`Allocation '${allocationId}' started successfully`);
    const response = { id: allocationId, environment, credentials, durationSeconds };
    console.log(`Scheduling timeout for allocation '${allocationId}' to ${timeoutDate}`);
    await clients.scheduler.scheduleAllocationTimeout({
      allocationId,
      timeoutDate,
      functionArn: Envars.required(ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV)
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: e instanceof ProxyError ? e.statusCode : 500,
      body: JSON.stringify({ message: e.message })
    };
  }
}
function parseRequestBody(body) {
  if (!body) {
    throw new ProxyError(400, "Request body not found");
  }
  const parsed = JSON.parse(body);
  if (!parsed.pool) {
    throw new ProxyError(400, "'pool' must be provided in the request body");
  }
  if (!parsed.requester) {
    throw new ProxyError(400, "'requester' must be provided in the request body");
  }
  return parsed;
}
async function acquireEnvironment(allocaionId, pool) {
  const candidates = await clients.configuration.listEnvironments({ pool });
  console.log(`Found ${candidates.length} environments in pool '${pool}'`);
  for (const canditate of candidates) {
    try {
      console.log(`Acquiring environment 'aws://${canditate.account}/${canditate.region}'...`);
      await clients.environments.acquire(allocaionId, canditate.account, canditate.region);
      return canditate;
    } catch (e) {
      if (e instanceof EnvironmentAlreadyAcquiredError) {
        console.log(`Environment 'aws://${canditate.account}/${canditate.region}' already acquired. Trying the next one.`);
        continue;
      }
      throw e;
    }
  }
  throw new ProxyError(423, `No environments available in pool '${pool}'`);
}
async function startAllocation(id, environment, requester) {
  try {
    await clients.allocations.start({
      id,
      account: environment.account,
      region: environment.region,
      pool: environment.pool,
      requester
    });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}
async function grabCredentials(id, environment) {
  const sts = new import_client_sts.STS();
  const assumed = await sts.assumeRole({
    RoleArn: environment.adminRoleArn,
    RoleSessionName: `atmosphere.allocation.${id}`
  });
  if (!assumed.Credentials) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return credentials`);
  }
  if (!assumed.Credentials.AccessKeyId) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return an access key id`);
  }
  if (!assumed.Credentials.SecretAccessKey) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return a secret access key`);
  }
  if (!assumed.Credentials.SessionToken) {
    throw new Error(`Assumed ${environment.adminRoleArn} role did not return a session token`);
  }
  return {
    accessKeyId: assumed.Credentials.AccessKeyId,
    secretAccessKey: assumed.Credentials.SecretAccessKey,
    sessionToken: assumed.Credentials.SessionToken
  };
}

// src/cleanup/cleaner.ts
var import_client_cloudformation = require("@aws-sdk/client-cloudformation");
var import_credential_providers = require("@aws-sdk/credential-providers");
var CleanerError = class extends Error {
  constructor(failedStacks) {
    super("Some stacks failed to delete");
    this.failedStacks = failedStacks;
  }
};
var Cleaner = class {
  constructor(environment) {
    this.environment = environment;
    this.credentials = (0, import_credential_providers.fromTemporaryCredentials)({
      params: {
        RoleArn: this.environment.adminRoleArn,
        RoleSessionName: `atmosphere.cleanup.${this.environment.account}.${this.environment.region}`
      }
    });
    this.cfn = new import_client_cloudformation.CloudFormationClient({ credentials: this.credentials, region: this.environment.region });
  }
  async clean(timeoutSeconds) {
    const stacks = await this.listStacks();
    const promises = stacks.map(async (s) => this.deleteStack(s, timeoutSeconds));
    const results = await Promise.all(promises);
    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
      throw new CleanerError(failed);
    }
  }
  async listStacks() {
    const stacksPaginator = (0, import_client_cloudformation.paginateDescribeStacks)({ client: this.cfn, pageSize: 10 }, {});
    const stacks = [];
    for await (const page of stacksPaginator) {
      stacks.push(...page.Stacks ?? []);
    }
    return stacks;
  }
  async deleteStack(stack, timeoutSeconds) {
    if (!stack.StackName) {
      throw new Error("Stack name is undefined");
    }
    try {
      if (stack.StackStatus !== "DELETE_IN_PROGRESS") {
        this.log(`Disabling termination protection of stack ${stack.StackName}`);
        await this.cfn.send(new import_client_cloudformation.UpdateTerminationProtectionCommand({
          StackName: stack.StackName,
          EnableTerminationProtection: false
        }));
        this.log(`Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
        await this.cfn.send(new import_client_cloudformation.DeleteStackCommand({ StackName: stack.StackName, RoleARN: this.environment.adminRoleArn }));
      }
      this.log(`Stack ${stack.StackName} deleting. Waiting for completion.`);
      await (0, import_client_cloudformation.waitUntilStackDeleteComplete)(
        { client: this.cfn, maxWaitTime: timeoutSeconds, minDelay: 5, maxDelay: 5 },
        { StackName: stack.StackName }
      );
      return { name: stack.StackName };
    } catch (e) {
      return { name: stack.StackName, error: e };
    }
  }
  log(message) {
    console.log(`aws://${this.environment.account}/${this.environment.region} | ${message}`);
  }
};

// src/cleanup/cleanup.task.ts
var clients2 = RuntimeClients.getOrCreate();
async function handler2(req) {
  console.log(`Fetching allocation '${req.allocationId}'`);
  const allocation = await clients2.allocations.get(req.allocationId);
  const env2 = `aws://${allocation.account}/${allocation.region}`;
  console.log(`Fetching environment '${env2}'`);
  const environment = await clients2.configuration.getEnvironment(allocation.account, allocation.region);
  const cleaner = new Cleaner(environment);
  try {
    console.log(`Starting cleanup of '${env2}'`);
    await cleaner.clean(req.timeoutSeconds);
    console.log(`Successfully cleaned '${env2}'`);
    console.log(`Releasing environment '${env2}'`);
    await clients2.environments.release(req.allocationId, environment.account, environment.region);
    console.log(`Successfully released environment '${env2}'`);
    console.log("Done!");
  } catch (e) {
    console.error(`Failed cleaning '${env2}':`, e.message);
    if (e instanceof CleanerError) {
      console.log(">> Failed stacks errors report <<");
      console.log();
      for (const f of e.failedStacks) {
        console.log("");
        console.log(`----- Stack: ${f.name} -----`);
        console.log(f.error);
      }
    }
    console.log(`Marking environment '${env2}' as 'dirty'`);
    await clients2.environments.dirty(req.allocationId, environment.account, environment.region);
    console.log(`Successfully marked environment '${env2}' as 'dirty'`);
    throw e;
  }
}
if (require.main !== module) {
} else {
  const allocationId = Envars.required(CLEANUP_TASK_ALLOCATION_ID);
  const timeoutSeconds = Number(Envars.required(CLEANUP_TASK_TIMEOUT_SECONDS));
  void handler2({ allocationId, timeoutSeconds });
}

// src/deallocate/deallocate.lambda.ts
var MAX_CLEANUP_TIMEOUT_SECONDS = 60 * 60;
var ProxyError2 = class extends Error {
  constructor(statusCode, message) {
    super(`${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.message = message;
  }
};
var clients3 = RuntimeClients.getOrCreate();
async function handler3(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  try {
    const id = (event.pathParameters ?? {}).id;
    if (!id) {
      throw new ProxyError2(400, "Missing 'id' path parameter");
    }
    console.log(`Extracted allocation id from path: ${id}`);
    console.log("Parsing request body");
    const request = parseRequestBody2(event.body);
    const cleanupDurationSeconds = request.cleanupDurationSeconds ?? MAX_CLEANUP_TIMEOUT_SECONDS;
    if (cleanupDurationSeconds > MAX_CLEANUP_TIMEOUT_SECONDS) {
      throw new ProxyError2(400, `Maximum cleanup timeout is ${MAX_CLEANUP_TIMEOUT_SECONDS} seconds`);
    }
    const cleanupTimeoutDate = new Date(Date.now() + 1e3 * cleanupDurationSeconds);
    console.log(`Ending allocation '${id}' with outcome: ${request.outcome}`);
    const allocation = await endAllocation(id, request.outcome);
    console.log(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}' for allocation '${id}'`);
    await clients3.environments.cleaning(id, allocation.account, allocation.region);
    console.log(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients3.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: Envars.required(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV)
    });
    console.log(`Starting cleanup task for environment 'aws://${allocation.account}/${allocation.region}`);
    const taskInstanceArn = await clients3.cleanup.start({ allocation, timeoutSeconds: cleanupDurationSeconds });
    console.log(`Successfully started cleanup task: ${taskInstanceArn}`);
    return success({ cleanupDurationSeconds });
  } catch (e) {
    if (e instanceof AllocationAlreadyEndedError) {
      console.log(`Returning success because: ${e.message}`);
      return success({ cleanupDurationSeconds: -1 });
    }
    console.error(e);
    return {
      statusCode: e instanceof ProxyError2 ? e.statusCode : 500,
      body: JSON.stringify({ message: e.message })
    };
  }
}
function parseRequestBody2(body) {
  if (!body) {
    throw new ProxyError2(400, "Request body not found");
  }
  const parsed = JSON.parse(body);
  if (!parsed.outcome) {
    throw new ProxyError2(400, "'outcome' must be provided in the request body");
  }
  return parsed;
}
async function endAllocation(id, outcome) {
  try {
    return await clients3.allocations.end({ id, outcome });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError2(400, e.message);
    }
    throw e;
  }
}
function success(response) {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}

// test/with.ts
async function env(envVars, fn) {
  const originalEnv = { ...process.env };
  try {
    Object.entries(envVars).forEach(([key, value2]) => {
      process.env[key] = value2;
    });
    return await fn();
  } finally {
    process.env = originalEnv;
  }
}

// test/integ/service.session.ts
var apigw = new import_client_api_gateway.APIGateway();
var dynamo = new import_client_dynamodb.DynamoDB();
var cfn = new import_client_cloudformation2.CloudFormation();
var scheduler = new import_client_scheduler2.Scheduler();
var ecs = new import_client_ecs2.ECS();
var clients4 = RuntimeClients.getOrCreate();
var SUCCESS_PAYLOAD = "OK";
var Session = class _Session {
  constructor(vars, name) {
    this.vars = vars;
    this.name = name;
    this.sessionLog(`Created session with variables: ${JSON.stringify(this.vars, null, 2)}`);
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
    const session = await this.create(name);
    await session.clear();
    let failed = false;
    try {
      session.log("\u{1F3AC} Start \u{1F3AC}");
      await assertion(session);
      session.log("\u2705 Success \u2705");
      return SUCCESS_PAYLOAD;
    } catch (error) {
      session.log("\u274C !! Fail !! \u274C");
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
  static async create(sessionName) {
    let envValue;
    if (_Session.isLocal()) {
      const devStack = ((await cfn.describeStacks({ StackName: "atmosphere-integ-dev-assertions" })).Stacks ?? [])[0];
      assert.ok(devStack, "Missing dev stack. Deploy by running: 'yarn integ:dev'");
      envValue = (name) => {
        const value2 = (devStack.Outputs ?? []).find((o) => o.OutputKey === name.replace(/_/g, "0"))?.OutputValue;
        assert.ok(value2, `Missing output '${name}' from dev stack`);
        return value2;
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
      [DEALLOCATE_FUNCTION_NAME_ENV]: envValue(DEALLOCATE_FUNCTION_NAME_ENV),
      [CLEANUP_CLUSTER_ARN_ENV]: envValue(CLEANUP_CLUSTER_ARN_ENV),
      [CLEANUP_TASK_DEFINITION_ARN_ENV]: envValue(CLEANUP_TASK_DEFINITION_ARN_ENV),
      [CLEANUP_TASK_SUBNET_ID_ENV]: envValue(CLEANUP_TASK_SUBNET_ID_ENV),
      [CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: envValue(CLEANUP_TASK_SECURITY_GROUP_ID_ENV),
      [CLEANUP_TASK_CONTAINER_NAME_ENV]: envValue(CLEANUP_TASK_CONTAINER_NAME_ENV)
    }, sessionName);
  }
  async allocate(body) {
    const json = JSON.stringify(body);
    const response = _Session.isLocal() ? await this.allocateLocal(json) : await this.allocateRemote(json);
    if (response.status !== 200) {
      return [response, Promise.resolve()];
    }
    const responseBody = JSON.parse(response.body);
    const region = responseBody.environment.region;
    if (region) {
      await this.assertCleanRegion(region);
    }
    return [response, this.waitForAllocationTimeout(responseBody)];
  }
  async deallocate(id, body) {
    const json = JSON.stringify(body);
    const response = _Session.isLocal() ? await this.deallocateLocal(id, json) : await this.deallocateRemote(id, json);
    if (response.status !== 200) {
      return [response, Promise.resolve()];
    }
    const responseBody = JSON.parse(response.body);
    return [response, this.waitForCleanupTimeout(id, responseBody)];
  }
  /**
   * Perform a cleanup for a specific allocation. When running locally, this will
   * invoke the cleanup task in-process, when running remotely, this will trigger the ECS task.
   */
  async cleanup(req) {
    if (_Session.isLocal()) {
      return this.cleanupLocal(req);
    } else {
      return this.cleanupRemote(req);
    }
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
  async fetchStoppedCleanupTask(allocationId) {
    const response = await ecs.listTasks({
      cluster: this.vars[CLEANUP_CLUSTER_ARN_ENV],
      startedBy: allocationId,
      desiredStatus: "STOPPED"
    });
    const taskArns = response.taskArns ?? [];
    if (taskArns.length === 0) {
      return void 0;
    }
    const tasks = await ecs.describeTasks({
      cluster: this.vars[CLEANUP_CLUSTER_ARN_ENV],
      tasks: taskArns
    });
    return tasks.tasks[0];
  }
  async waitFor(condition, timeoutSeconds, opts = {}) {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1e3;
    while (true) {
      const finish = await condition();
      if (finish) {
        return;
      }
      const elapsed = Date.now() - startTime;
      assert.ok(elapsed < timeoutMs, `Timeout after ${timeoutSeconds} seconds waiting for ${opts.message}`);
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
  async fetchStack(name, region) {
    const cfnRegion = new import_client_cloudformation2.CloudFormation({ region });
    const response = await cfnRegion.describeStacks({ StackName: name });
    return response.Stacks?.[0];
  }
  /**
   * Deploy a stack onto a region and return its name.
   * This will also wait for stack creation to complete.
   */
  async deploy(opts) {
    const cfnRegion = new import_client_cloudformation2.CloudFormation({ region: opts.region });
    const templateBody = fs.readFileSync(path.join(__dirname, opts.templatePath), { encoding: "utf-8" });
    const stackName = path.basename(opts.templatePath).split(".")[0];
    this.log(`Deploying stack '${stackName}' from path '${opts.templatePath}' to region '${opts.region}'`);
    await cfnRegion.createStack({
      StackName: stackName,
      TemplateBody: templateBody,
      EnableTerminationProtection: opts.terminationProtection ?? false,
      Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
      OnFailure: "DO_NOTHING",
      TimeoutInMinutes: opts.timeoutMinutes ?? 5
    });
    this.log(`Waiting for stack '${stackName}' to be created in region '${opts.region}'`);
    await (0, import_client_cloudformation2.waitUntilStackCreateComplete)(
      { client: cfnRegion, maxWaitTime: 300 },
      { StackName: stackName }
    );
    return stackName;
  }
  async cleanupLocal(req) {
    this.log(`Invoking local cleanup task handler with body: ${req}`);
    await handler2(req);
  }
  async cleanupRemote(req) {
    this.log(`Starting ECS cleanup task with body: ${req}`);
    const allocation = await clients4.allocations.end({ id: req.allocationId, outcome: "success" });
    const taskInstanceArn = await clients4.cleanup.start({
      allocation,
      timeoutSeconds: req.timeoutSeconds
    });
    this.log(`Waiting ${req.timeoutSeconds} seconds for cleanup task ${taskInstanceArn} to exit`);
    await this.waitFor(async () => await this.fetchStoppedCleanupTask(req.allocationId) !== void 0, req.timeoutSeconds);
  }
  async deallocateLocal(id, jsonBody) {
    this.log(`Invoking local deallocate handler for allocation '${id}' with body: ${jsonBody}`);
    console.log();
    const response = await env(this.vars, async () => {
      return handler3({ body: jsonBody, pathParameters: { id } });
    });
    console.log();
    return { status: response.statusCode, body: response.body };
  }
  async deallocateRemote(id, jsonBody) {
    this.log(`Sending deallocation request for allocation '${id}' with body: ${jsonBody}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[REST_API_ID_ENV],
      resourceId: this.vars[ALLOCATION_RESOURCE_ID_ENV],
      httpMethod: "DELETE",
      pathWithQueryString: `/allocations/${id}`,
      body: jsonBody
    });
  }
  async allocateLocal(jsonBody) {
    this.log(`Invoking local allocate handler with body: ${jsonBody}`);
    console.log();
    const response = await env(this.vars, async () => {
      return handler({ body: jsonBody });
    });
    console.log();
    return { status: response.statusCode, body: response.body };
  }
  async allocateRemote(jsonBody) {
    this.log(`Sending allocation request with body: ${jsonBody}`);
    return apigw.testInvokeMethod({
      restApiId: this.vars[REST_API_ID_ENV],
      resourceId: this.vars[ALLOCATIONS_RESOURCE_ID_ENV],
      httpMethod: "POST",
      pathWithQueryString: "/allocations",
      body: jsonBody
    });
  }
  async assertCleanRegion(region) {
    this.sessionLog(`Scanning stacks in region ${region}`);
    const stacksPaginator = (0, import_client_cloudformation2.paginateDescribeStacks)({ client: new import_client_cloudformation2.CloudFormation({ region }), pageSize: 10 }, {});
    const stacks = [];
    for await (const page of stacksPaginator) {
      for (const stack of page.Stacks ?? []) {
        this.sessionLog(`  \xBB found stack ${stack.StackName}`);
        stacks.push(stack);
      }
    }
    if (stacks.length === 0) {
      this.sessionLog(`Region '${region}' is clean. Proceeding.`);
      return;
    }
    assert.fail(`Region '${region}' it not clean. Please either delete all stacks or remove '${region}' from environment pools.`);
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
  async waitForAllocationTimeout(response) {
    const waitTimeSeconds = response.durationSeconds + 60;
    await this.waitFor(async () => await this.fetchAllocationTimeoutSchedule(response.id) === void 0, waitTimeSeconds, {
      message: `allocation ${response.id} to timeout`
    });
    return new Promise((resolve) => setTimeout(resolve, 5e3));
  }
  async waitForCleanupTimeout(id, response) {
    const waitTimeSeconds = response.cleanupDurationSeconds + 60;
    await this.waitFor(async () => await this.fetchCleanupTimeoutSchedule(id) === void 0, waitTimeSeconds, {
      message: `cleanup of allocation ${id} to timeout`
    });
    return new Promise((resolve) => setTimeout(resolve, 5e3));
  }
  log(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [assertion] [${this.name}] ${message}`);
  }
  sessionLog(message) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] [session] [${this.name}] ${message}`);
  }
};

// test/integ/dev/assert.lambda.ts
async function handler4(_) {
  return Session.assert(async () => {
    return;
  });
}
if (Session.isLocal()) {
  void handler4({});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
