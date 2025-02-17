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

// src/deallocate/deallocate.lambda.ts
var deallocate_lambda_exports = {};
__export(deallocate_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(deallocate_lambda_exports);

// src/cleanup/cleanup.client.ts
var import_client_ecs = require("@aws-sdk/client-ecs");

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
      payload: { allocationId: opts.allocationId },
      dlqArn: Envars.required(ALLOCATION_TIMEOUT_DLQ_ARN_ENV)
    });
  }
  async scheduleCleanupTimeout(opts) {
    const prefix = `${_SchedulerClient.TIMEOUT_EVENT_PREFIX}.clean_`;
    await this.scheduleLambdaInvoke({
      name: `${prefix}${opts.allocationId}`,
      description: `Enforces cleanup for allocation ${opts.allocationId}`,
      functionArn: opts.functionArn,
      at: opts.timeoutDate,
      payload: { allocationId: opts.allocationId, account: opts.account, region: opts.region },
      dlqArn: Envars.required(CLEANUP_TIMEOUT_DLQ_ARN_ENV)
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
          Arn: opts.dlqArn
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

// src/storage/dynamo-item.ts
function optionalValue(name, attributes) {
  const attribute = attributes[name];
  if (attribute) {
    return attribute.S;
  }
  return void 0;
}
function requiredValue(name, attributes) {
  const v = optionalValue(name, attributes);
  if (!v) {
    throw new Error(`Attribute '${name}' not found`);
  }
  return v;
}

// src/storage/allocations.client.ts
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
      account: requiredValue("account", response.Item),
      region: requiredValue("region", response.Item),
      pool: requiredValue("pool", response.Item),
      start: requiredValue("start", response.Item),
      requester: requiredValue("requester", response.Item),
      id: requiredValue("id", response.Item),
      // if an allocation is queried before it ended, these attributes
      // will be missing.
      end: optionalValue("end", response.Item),
      outcome: optionalValue("outcome", response.Item)
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
        account: requiredValue("account", response.Attributes),
        region: requiredValue("region", response.Attributes),
        pool: requiredValue("pool", response.Attributes),
        start: requiredValue("start", response.Attributes),
        end: requiredValue("end", response.Attributes),
        requester: requiredValue("requester", response.Attributes),
        id: requiredValue("id", response.Attributes),
        outcome: requiredValue("outcome", response.Attributes)
      };
    } catch (e) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new AllocationAlreadyEndedError(opts.id);
      }
      throw e;
    }
  }
};

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
var EnvironmentNotFound = class extends EnvironmentsError {
  constructor(account, region) {
    super(account, region, "not found");
  }
};
var EnvironmentsClient = class {
  constructor(tableName) {
    this.tableName = tableName;
    this.ddbClient = new ddb2.DynamoDB({});
  }
  /**
   * Fetch a specific environment by account and region.
   * Will throw if it doesn't exists.
   */
  async get(account, region) {
    const response = await this.ddbClient.getItem({
      TableName: this.tableName,
      Key: {
        account: { S: account },
        region: { S: region }
      }
    });
    if (!response.Item) {
      throw new EnvironmentNotFound(account, region);
    }
    return {
      account: requiredValue("account", response.Item),
      region: requiredValue("region", response.Item),
      status: requiredValue("status", response.Item),
      allocation: requiredValue("allocation", response.Item)
    };
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
          // we shouldn't be releasing an environment if its still 'in-use'.
          // it should be marked as either 'cleaning' or 'dirty' beforehand.
          ":unexpected_status_value": { S: "in-use" }
        },
        // ensures deletion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: "attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value AND #status <> :unexpected_status_value",
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
        if (old_status === "in-use") {
          throw new EnvironmentAlreadyInUseError(account, region);
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
      this._scheduler = new SchedulerClient({ roleArn });
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

// src/logging.ts
var Logger = class {
  constructor(props) {
    this.prefix = `[${props.component}] [pool:${props.pool}] [aloc:${props.allocationId}]`;
  }
  info(message) {
    console.log(`${this.prefix} ${message}`);
  }
  error(error, message = "") {
    console.error(`${this.prefix} ${message}`, error);
  }
};

// src/deallocate/deallocate.lambda.ts
var CLEANUP_TIMEOUT_SECONDS = 60 * 60;
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
  let allocationId, request, pool;
  try {
    [allocationId, request] = parseEvent(event);
    pool = (await clients.allocations.get(allocationId)).pool;
  } catch (e) {
    return failure(e);
  }
  const log = new Logger({ allocationId, pool, component: "deallocate" });
  return safeDoHandler(allocationId, request, log);
}
async function safeDoHandler(allocationId, request, log) {
  try {
    return await doHandler(allocationId, request, log);
  } catch (e) {
    log.error(e);
    return failure(e);
  }
}
async function doHandler(allocationId, request, log) {
  try {
    const cleanupTimeoutDate = new Date(Date.now() + 1e3 * CLEANUP_TIMEOUT_SECONDS);
    log.info(`Ending allocation with outcome: ${request.outcome}`);
    const allocation = await endAllocation(allocationId, request.outcome);
    log.info(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: Envars.required(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV)
    });
    log.info(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients.environments.cleaning(allocationId, allocation.account, allocation.region);
    const taskInstanceArn = await clients.cleanup.start({ allocation, timeoutSeconds: CLEANUP_TIMEOUT_SECONDS });
    log.info(`Successfully started cleanup task: ${taskInstanceArn}`);
    return success();
  } catch (e) {
    if (e instanceof AllocationAlreadyEndedError) {
      log.info(`Returning success because: ${e.message}`);
      return success();
    }
    throw e;
  }
}
function parseEvent(event) {
  const id = (event.pathParameters ?? {}).id;
  if (!id) {
    throw new ProxyError(400, "Missing 'id' path parameter");
  }
  if (!event.body) {
    throw new ProxyError(400, "Request body not found");
  }
  const parsed = JSON.parse(event.body);
  if (!parsed.outcome) {
    throw new ProxyError(400, "'outcome' must be provided in the request body");
  }
  return [id, parsed];
}
async function endAllocation(id, outcome) {
  try {
    return await clients.allocations.end({ id, outcome });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      throw new ProxyError(400, e.message);
    }
    throw e;
  }
}
function success() {
  return { statusCode: 200, body: JSON.stringify({}) };
}
function failure(e) {
  const statusCode = e instanceof ProxyError ? e.statusCode : 500;
  return { statusCode, body: JSON.stringify({ message: e.message }) };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
