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

// src/allocate/allocate.lambda.ts
var allocate_lambda_exports = {};
__export(allocate_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(allocate_lambda_exports);
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
      if (e instanceof ddb2.ConditionalCheckFailedException) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
