"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/aws-embedded-metrics/lib/Constants.js
var require_Constants = __commonJS({
  "node_modules/aws-embedded-metrics/lib/Constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Constants = void 0;
    var Constants;
    (function(Constants2) {
      Constants2[Constants2["MAX_DIMENSION_SET_SIZE"] = 30] = "MAX_DIMENSION_SET_SIZE";
      Constants2[Constants2["MAX_DIMENSION_NAME_LENGTH"] = 250] = "MAX_DIMENSION_NAME_LENGTH";
      Constants2[Constants2["MAX_DIMENSION_VALUE_LENGTH"] = 1024] = "MAX_DIMENSION_VALUE_LENGTH";
      Constants2[Constants2["MAX_METRIC_NAME_LENGTH"] = 1024] = "MAX_METRIC_NAME_LENGTH";
      Constants2[Constants2["MAX_NAMESPACE_LENGTH"] = 256] = "MAX_NAMESPACE_LENGTH";
      Constants2["VALID_NAMESPACE_REGEX"] = "^[a-zA-Z0-9._#:/-]+$";
      Constants2["VALID_DIMENSION_REGEX"] = "^[\0-\x7F]+$";
      Constants2[Constants2["MAX_TIMESTAMP_PAST_AGE"] = 12096e5] = "MAX_TIMESTAMP_PAST_AGE";
      Constants2[Constants2["MAX_TIMESTAMP_FUTURE_AGE"] = 72e5] = "MAX_TIMESTAMP_FUTURE_AGE";
      Constants2["DEFAULT_NAMESPACE"] = "aws-embedded-metrics";
      Constants2[Constants2["MAX_METRICS_PER_EVENT"] = 100] = "MAX_METRICS_PER_EVENT";
      Constants2[Constants2["MAX_VALUES_PER_METRIC"] = 100] = "MAX_VALUES_PER_METRIC";
      Constants2["DEFAULT_AGENT_HOST"] = "0.0.0.0";
      Constants2[Constants2["DEFAULT_AGENT_PORT"] = 25888] = "DEFAULT_AGENT_PORT";
    })(Constants = exports2.Constants || (exports2.Constants = {}));
  }
});

// node_modules/aws-embedded-metrics/lib/environment/Environments.js
var require_Environments = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/Environments.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Environments;
    (function(Environments2) {
      Environments2["Local"] = "Local";
      Environments2["Lambda"] = "Lambda";
      Environments2["Agent"] = "Agent";
      Environments2["EC2"] = "EC2";
      Environments2["ECS"] = "ECS";
      Environments2["Unknown"] = "";
    })(Environments || (Environments = {}));
    exports2.default = Environments;
  }
});

// node_modules/aws-embedded-metrics/lib/config/EnvironmentConfigurationProvider.js
var require_EnvironmentConfigurationProvider = __commonJS({
  "node_modules/aws-embedded-metrics/lib/config/EnvironmentConfigurationProvider.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EnvironmentConfigurationProvider = void 0;
    var Constants_1 = require_Constants();
    var Environments_1 = __importDefault(require_Environments());
    var ENV_VAR_PREFIX = "AWS_EMF";
    var ConfigKeys;
    (function(ConfigKeys2) {
      ConfigKeys2["LOG_GROUP_NAME"] = "LOG_GROUP_NAME";
      ConfigKeys2["LOG_STREAM_NAME"] = "LOG_STREAM_NAME";
      ConfigKeys2["ENABLE_DEBUG_LOGGING"] = "ENABLE_DEBUG_LOGGING";
      ConfigKeys2["SERVICE_NAME"] = "SERVICE_NAME";
      ConfigKeys2["SERVICE_TYPE"] = "SERVICE_TYPE";
      ConfigKeys2["AGENT_ENDPOINT"] = "AGENT_ENDPOINT";
      ConfigKeys2["ENVIRONMENT_OVERRIDE"] = "ENVIRONMENT";
      ConfigKeys2["NAMESPACE"] = "NAMESPACE";
    })(ConfigKeys || (ConfigKeys = {}));
    var EnvironmentConfigurationProvider = class {
      getConfiguration() {
        return {
          agentEndpoint: this.getEnvVariable(ConfigKeys.AGENT_ENDPOINT),
          debuggingLoggingEnabled: this.tryGetEnvVariableAsBoolean(ConfigKeys.ENABLE_DEBUG_LOGGING, false),
          logGroupName: this.getEnvVariable(ConfigKeys.LOG_GROUP_NAME),
          logStreamName: this.getEnvVariable(ConfigKeys.LOG_STREAM_NAME),
          serviceName: this.getEnvVariable(ConfigKeys.SERVICE_NAME) || this.getEnvVariableWithoutPrefix(ConfigKeys.SERVICE_NAME),
          serviceType: this.getEnvVariable(ConfigKeys.SERVICE_TYPE) || this.getEnvVariableWithoutPrefix(ConfigKeys.SERVICE_TYPE),
          environmentOverride: this.getEnvironmentOverride(),
          namespace: this.getEnvVariable(ConfigKeys.NAMESPACE) || Constants_1.Constants.DEFAULT_NAMESPACE
        };
      }
      getEnvVariableWithoutPrefix(configKey) {
        return process.env[configKey];
      }
      getEnvVariable(configKey) {
        return process.env[`${ENV_VAR_PREFIX}_${configKey}`];
      }
      tryGetEnvVariableAsBoolean(configKey, fallback) {
        const configValue = this.getEnvVariable(configKey);
        return !configValue ? fallback : configValue.toLowerCase() === "true";
      }
      getEnvironmentOverride() {
        const overrideValue = this.getEnvVariable(ConfigKeys.ENVIRONMENT_OVERRIDE);
        const environment = Environments_1.default[overrideValue];
        if (environment === void 0) {
          return Environments_1.default.Unknown;
        }
        return environment;
      }
    };
    exports2.EnvironmentConfigurationProvider = EnvironmentConfigurationProvider;
  }
});

// node_modules/aws-embedded-metrics/lib/config/Configuration.js
var require_Configuration = __commonJS({
  "node_modules/aws-embedded-metrics/lib/config/Configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var EnvironmentConfigurationProvider_1 = require_EnvironmentConfigurationProvider();
    var Configuration = new EnvironmentConfigurationProvider_1.EnvironmentConfigurationProvider().getConfiguration();
    exports2.default = Configuration;
  }
});

// node_modules/aws-embedded-metrics/lib/utils/Logger.js
var require_Logger = __commonJS({
  "node_modules/aws-embedded-metrics/lib/utils/Logger.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LOG = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var LOG = (...args) => {
      if (Configuration_1.default.debuggingLoggingEnabled) {
        console.log(...args);
      }
    };
    exports2.LOG = LOG;
  }
});

// node_modules/aws-embedded-metrics/lib/logger/Unit.js
var require_Unit = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/Unit.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Unit = void 0;
    var Unit2;
    (function(Unit3) {
      Unit3["Seconds"] = "Seconds";
      Unit3["Microseconds"] = "Microseconds";
      Unit3["Milliseconds"] = "Milliseconds";
      Unit3["Bytes"] = "Bytes";
      Unit3["Kilobytes"] = "Kilobytes";
      Unit3["Megabytes"] = "Megabytes";
      Unit3["Gigabytes"] = "Gigabytes";
      Unit3["Terabytes"] = "Terabytes";
      Unit3["Bits"] = "Bits";
      Unit3["Kilobits"] = "Kilobits";
      Unit3["Megabits"] = "Megabits";
      Unit3["Gigabits"] = "Gigabits";
      Unit3["Terabits"] = "Terabits";
      Unit3["Percent"] = "Percent";
      Unit3["Count"] = "Count";
      Unit3["BytesPerSecond"] = "Bytes/Second";
      Unit3["KilobytesPerSecond"] = "Kilobytes/Second";
      Unit3["MegabytesPerSecond"] = "Megabytes/Second";
      Unit3["GigabytesPerSecond"] = "Gigabytes/Second";
      Unit3["TerabytesPerSecond"] = "Terabytes/Second";
      Unit3["BitsPerSecond"] = "Bits/Second";
      Unit3["KilobitsPerSecond"] = "Kilobits/Second";
      Unit3["MegabitsPerSecond"] = "Megabits/Second";
      Unit3["GigabitsPerSecond"] = "Gigabits/Second";
      Unit3["TerabitsPerSecond"] = "Terabits/Second";
      Unit3["CountPerSecond"] = "Count/Second";
      Unit3["None"] = "None";
    })(Unit2 = exports2.Unit || (exports2.Unit = {}));
  }
});

// node_modules/aws-embedded-metrics/lib/logger/StorageResolution.js
var require_StorageResolution = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/StorageResolution.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StorageResolution = void 0;
    var StorageResolution;
    (function(StorageResolution2) {
      StorageResolution2[StorageResolution2["High"] = 1] = "High";
      StorageResolution2[StorageResolution2["Standard"] = 60] = "Standard";
    })(StorageResolution = exports2.StorageResolution || (exports2.StorageResolution = {}));
  }
});

// node_modules/aws-embedded-metrics/lib/exceptions/DimensionSetExceededError.js
var require_DimensionSetExceededError = __commonJS({
  "node_modules/aws-embedded-metrics/lib/exceptions/DimensionSetExceededError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DimensionSetExceededError = void 0;
    var DimensionSetExceededError = class _DimensionSetExceededError extends Error {
      constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, _DimensionSetExceededError.prototype);
      }
    };
    exports2.DimensionSetExceededError = DimensionSetExceededError;
  }
});

// node_modules/aws-embedded-metrics/lib/exceptions/InvalidDimensionError.js
var require_InvalidDimensionError = __commonJS({
  "node_modules/aws-embedded-metrics/lib/exceptions/InvalidDimensionError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvalidDimensionError = void 0;
    var InvalidDimensionError = class _InvalidDimensionError extends Error {
      constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, _InvalidDimensionError.prototype);
      }
    };
    exports2.InvalidDimensionError = InvalidDimensionError;
  }
});

// node_modules/aws-embedded-metrics/lib/exceptions/InvalidMetricError.js
var require_InvalidMetricError = __commonJS({
  "node_modules/aws-embedded-metrics/lib/exceptions/InvalidMetricError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvalidMetricError = void 0;
    var InvalidMetricError = class _InvalidMetricError extends Error {
      constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, _InvalidMetricError.prototype);
      }
    };
    exports2.InvalidMetricError = InvalidMetricError;
  }
});

// node_modules/aws-embedded-metrics/lib/exceptions/InvalidNamespaceError.js
var require_InvalidNamespaceError = __commonJS({
  "node_modules/aws-embedded-metrics/lib/exceptions/InvalidNamespaceError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvalidNamespaceError = void 0;
    var InvalidNamespaceError = class _InvalidNamespaceError extends Error {
      constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, _InvalidNamespaceError.prototype);
      }
    };
    exports2.InvalidNamespaceError = InvalidNamespaceError;
  }
});

// node_modules/aws-embedded-metrics/lib/exceptions/InvalidTimestampError.js
var require_InvalidTimestampError = __commonJS({
  "node_modules/aws-embedded-metrics/lib/exceptions/InvalidTimestampError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvalidTimestampError = void 0;
    var InvalidTimestampError = class _InvalidTimestampError extends Error {
      constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, _InvalidTimestampError.prototype);
      }
    };
    exports2.InvalidTimestampError = InvalidTimestampError;
  }
});

// node_modules/aws-embedded-metrics/lib/utils/Validator.js
var require_Validator = __commonJS({
  "node_modules/aws-embedded-metrics/lib/utils/Validator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateTimestamp = exports2.validateNamespace = exports2.validateMetric = exports2.validateDimensionSet = void 0;
    var Constants_1 = require_Constants();
    var Unit_1 = require_Unit();
    var StorageResolution_1 = require_StorageResolution();
    var DimensionSetExceededError_1 = require_DimensionSetExceededError();
    var InvalidDimensionError_1 = require_InvalidDimensionError();
    var InvalidMetricError_1 = require_InvalidMetricError();
    var InvalidNamespaceError_1 = require_InvalidNamespaceError();
    var InvalidTimestampError_1 = require_InvalidTimestampError();
    var validateDimensionSet = (dimensionSet) => {
      if (Object.keys(dimensionSet).length > Constants_1.Constants.MAX_DIMENSION_SET_SIZE)
        throw new DimensionSetExceededError_1.DimensionSetExceededError(`Maximum number of dimensions per dimension set allowed are ${Constants_1.Constants.MAX_DIMENSION_SET_SIZE}`);
      Object.entries(dimensionSet).forEach(([key, value]) => {
        dimensionSet[key] = value = String(value);
        if (!new RegExp(Constants_1.Constants.VALID_DIMENSION_REGEX).test(key)) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension key ${key} has invalid characters`);
        }
        if (!new RegExp(Constants_1.Constants.VALID_DIMENSION_REGEX).test(value)) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension value ${value} has invalid characters`);
        }
        if (key.trim().length == 0) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension key ${key} must include at least one non-whitespace character`);
        }
        if (value.trim().length == 0) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension value ${value} must include at least one non-whitespace character`);
        }
        if (key.length > Constants_1.Constants.MAX_DIMENSION_NAME_LENGTH) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension key ${key} must not exceed maximum length ${Constants_1.Constants.MAX_DIMENSION_NAME_LENGTH}`);
        }
        if (value.length > Constants_1.Constants.MAX_DIMENSION_VALUE_LENGTH) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension value ${value} must not exceed maximum length ${Constants_1.Constants.MAX_DIMENSION_VALUE_LENGTH}`);
        }
        if (key.startsWith(":")) {
          throw new InvalidDimensionError_1.InvalidDimensionError(`Dimension key ${key} cannot start with ':'`);
        }
      });
    };
    exports2.validateDimensionSet = validateDimensionSet;
    var validateMetric = (key, value, unit, storageResolution, metricNameAndResolutionMap) => {
      if (key.trim().length == 0) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric key ${key} must include at least one non-whitespace character`);
      }
      if (key.length > Constants_1.Constants.MAX_METRIC_NAME_LENGTH) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric key ${key} must not exceed maximum length ${Constants_1.Constants.MAX_METRIC_NAME_LENGTH}`);
      }
      if (!Number.isFinite(value)) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric value ${value} is not a number`);
      }
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric value ${value} must not exceed maximum value ${Number.MAX_SAFE_INTEGER}}`);
      }
      if (value < -Number.MAX_SAFE_INTEGER) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric value ${value} must not be less than minimum value ${-Number.MAX_SAFE_INTEGER}`);
      }
      if (unit !== void 0 && !Object.values(Unit_1.Unit).map((u) => String(u)).includes(unit)) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric unit ${unit} is not valid`);
      }
      if (storageResolution !== void 0 && !Object.values(StorageResolution_1.StorageResolution).map((s) => s).includes(storageResolution)) {
        throw new InvalidMetricError_1.InvalidMetricError(`Metric resolution ${storageResolution} is not valid`);
      }
      if ((metricNameAndResolutionMap === null || metricNameAndResolutionMap === void 0 ? void 0 : metricNameAndResolutionMap.has(key)) && metricNameAndResolutionMap.get(key) !== (storageResolution ? storageResolution : StorageResolution_1.StorageResolution.Standard)) {
        throw new InvalidMetricError_1.InvalidMetricError(`Resolution for metrics ${key} is already set. A single log event cannot have a metric with two different resolutions.`);
      }
    };
    exports2.validateMetric = validateMetric;
    var validateNamespace = (namespace) => {
      if (namespace.trim().length == 0) {
        throw new InvalidNamespaceError_1.InvalidNamespaceError(`Namespace must include at least one non-whitespace character`);
      }
      if (namespace.length > Constants_1.Constants.MAX_NAMESPACE_LENGTH) {
        throw new InvalidNamespaceError_1.InvalidNamespaceError(`Namespace must not exceed maximum length ${Constants_1.Constants.MAX_NAMESPACE_LENGTH}`);
      }
      if (!new RegExp(Constants_1.Constants.VALID_NAMESPACE_REGEX).test(namespace)) {
        throw new InvalidNamespaceError_1.InvalidNamespaceError(`Namespace ${namespace} has invalid characters`);
      }
    };
    exports2.validateNamespace = validateNamespace;
    var validateTimestamp = (timestamp) => {
      if (!isDate(timestamp)) {
        throw new InvalidTimestampError_1.InvalidTimestampError(`Timestamp ${String(timestamp)} is invalid`);
      }
      timestamp = new Date(timestamp);
      if (timestamp < new Date(Date.now() - Constants_1.Constants.MAX_TIMESTAMP_PAST_AGE)) {
        throw new InvalidTimestampError_1.InvalidTimestampError(`Timestamp ${String(timestamp)} must not be older than ${Constants_1.Constants.MAX_TIMESTAMP_PAST_AGE} milliseconds`);
      }
      if (timestamp > new Date(Date.now() + Constants_1.Constants.MAX_TIMESTAMP_FUTURE_AGE)) {
        throw new InvalidTimestampError_1.InvalidTimestampError(`Timestamp ${String(timestamp)} must not be newer than ${Constants_1.Constants.MAX_TIMESTAMP_FUTURE_AGE} milliseconds`);
      }
    };
    exports2.validateTimestamp = validateTimestamp;
    var isDate = (timestamp) => {
      return timestamp instanceof Date && !isNaN(new Date(timestamp).getTime()) || new Date(timestamp).getTime() > 0;
    };
  }
});

// node_modules/aws-embedded-metrics/lib/logger/MetricValues.js
var require_MetricValues = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/MetricValues.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MetricValues = void 0;
    var StorageResolution_1 = require_StorageResolution();
    var MetricValues = class {
      constructor(value, unit, storageResolution) {
        this.values = [value];
        this.unit = unit || "None";
        this.storageResolution = storageResolution || StorageResolution_1.StorageResolution.Standard;
      }
      /**
       * Appends the provided value to the current metric
       * @param value
       */
      addValue(value) {
        this.values.push(value);
      }
    };
    exports2.MetricValues = MetricValues;
  }
});

// node_modules/aws-embedded-metrics/lib/logger/MetricsContext.js
var require_MetricsContext = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/MetricsContext.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MetricsContext = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var Logger_1 = require_Logger();
    var Validator_1 = require_Validator();
    var MetricValues_1 = require_MetricValues();
    var StorageResolution_1 = require_StorageResolution();
    var MetricsContext = class _MetricsContext {
      /**
       * Use this to create a new, empty context.
       */
      static empty() {
        return new _MetricsContext();
      }
      /**
       * Constructor used to create child instances.
       * You should not use this constructor directly.
       * Instead, use createCopyWithContext() or empty().
       *
       * The reason for this is to avoid unexpected behavior when creating
       * MetricsContexts with defaultDimensions and existing dimensions.
       *
       * @param properties
       * @param dimensions
       */
      constructor(namespace, properties, dimensions, defaultDimensions, shouldUseDefaultDimensions, timestamp) {
        this.metrics = /* @__PURE__ */ new Map();
        this.meta = {};
        this.shouldUseDefaultDimensions = true;
        this.metricNameAndResolutionMap = /* @__PURE__ */ new Map();
        this.namespace = namespace || Configuration_1.default.namespace;
        this.properties = properties || {};
        this.dimensions = dimensions || [];
        this.timestamp = timestamp;
        this.meta.Timestamp = _MetricsContext.resolveMetaTimestamp(timestamp);
        this.defaultDimensions = defaultDimensions || {};
        if (shouldUseDefaultDimensions != void 0) {
          this.shouldUseDefaultDimensions = shouldUseDefaultDimensions;
        }
      }
      static resolveMetaTimestamp(timestamp) {
        if (timestamp instanceof Date) {
          return timestamp.getTime();
        } else if (timestamp) {
          return timestamp;
        } else {
          return Date.now();
        }
      }
      setNamespace(value) {
        (0, Validator_1.validateNamespace)(value);
        this.namespace = value;
      }
      setProperty(key, value) {
        this.properties[key] = value;
      }
      setTimestamp(timestamp) {
        (0, Validator_1.validateTimestamp)(timestamp);
        this.timestamp = timestamp;
        this.meta.Timestamp = _MetricsContext.resolveMetaTimestamp(timestamp);
      }
      /**
       * Sets default dimensions for the Context.
       * A dimension set will be created with just the default dimensions
       * and all calls to putDimensions will be prepended with the defaults.
       */
      setDefaultDimensions(dimensions) {
        (0, Logger_1.LOG)(`Received default dimensions`, dimensions);
        this.defaultDimensions = dimensions;
      }
      /**
       * Adds a new set of dimensions. Any time a new dimensions set
       * is added, the set is first prepended by the default dimensions.
       *
       * @param dimensions
       */
      putDimensions(incomingDimensionSet) {
        (0, Validator_1.validateDimensionSet)(incomingDimensionSet);
        const incomingDimensionSetKeys = Object.keys(incomingDimensionSet);
        this.dimensions = this.dimensions.filter((existingDimensionSet) => {
          const existingDimensionSetKeys = Object.keys(existingDimensionSet);
          if (existingDimensionSetKeys.length !== incomingDimensionSetKeys.length) {
            return true;
          }
          return !existingDimensionSetKeys.every((existingDimensionSetKey) => incomingDimensionSetKeys.includes(existingDimensionSetKey));
        });
        this.dimensions.push(incomingDimensionSet);
      }
      /**
       * Overwrite all dimensions.
       *
       * @param dimensionSets
       */
      setDimensions(dimensionSets, useDefault = false) {
        dimensionSets.forEach((dimensionSet) => (0, Validator_1.validateDimensionSet)(dimensionSet));
        this.shouldUseDefaultDimensions = useDefault;
        this.dimensions = dimensionSets;
      }
      /**
       * Reset all custom dimensions
       * @param useDefault Indicates whether default dimensions should be used
       */
      resetDimensions(useDefault) {
        this.shouldUseDefaultDimensions = useDefault;
        this.dimensions = [];
      }
      /**
       * Get the current dimensions.
       */
      getDimensions() {
        if (this.shouldUseDefaultDimensions === false) {
          return this.dimensions;
        }
        if (Object.keys(this.defaultDimensions).length === 0) {
          return this.dimensions;
        }
        if (this.dimensions.length === 0) {
          return [this.defaultDimensions];
        }
        return this.dimensions.map((custom) => {
          return Object.assign(Object.assign({}, this.defaultDimensions), custom);
        });
      }
      putMetric(key, value, unit, storageResolution) {
        var _a;
        (0, Validator_1.validateMetric)(key, value, unit, storageResolution, this.metricNameAndResolutionMap);
        const currentMetric = this.metrics.get(key);
        if (currentMetric) {
          currentMetric.addValue(value);
        } else {
          this.metrics.set(key, new MetricValues_1.MetricValues(value, unit, storageResolution));
        }
        (_a = this.metricNameAndResolutionMap) === null || _a === void 0 ? void 0 : _a.set(key, storageResolution || StorageResolution_1.StorageResolution.Standard);
      }
      /**
       * Creates an independently flushable context.
       * Custom dimensions are preserved by default unless preserveDimensions parameter is set.
       * @param preserveDimensions Indicates whether custom dimensions should be preserved
       */
      createCopyWithContext(preserveDimensions = true) {
        return new _MetricsContext(this.namespace, Object.assign({}, this.properties), preserveDimensions ? Object.assign([], this.dimensions) : [], this.defaultDimensions, this.shouldUseDefaultDimensions, this.timestamp);
      }
    };
    exports2.MetricsContext = MetricsContext;
  }
});

// node_modules/aws-embedded-metrics/lib/logger/MetricsLogger.js
var require_MetricsLogger = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/MetricsLogger.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MetricsLogger = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var MetricsContext_1 = require_MetricsContext();
    var MetricsLogger2 = class _MetricsLogger {
      constructor(resolveEnvironment, context) {
        this.configureContextForEnvironment = (context2, environment) => {
          const defaultDimensions = {
            // LogGroup name will entirely depend on the environment since there
            // are some cases where the LogGroup cannot be configured (e.g. Lambda)
            LogGroup: environment.getLogGroupName(),
            ServiceName: Configuration_1.default.serviceName || environment.getName(),
            ServiceType: Configuration_1.default.serviceType || environment.getType()
          };
          context2.setDefaultDimensions(defaultDimensions);
          environment.configureContext(context2);
        };
        this.resolveEnvironment = resolveEnvironment;
        this.context = context || MetricsContext_1.MetricsContext.empty();
        this.flushPreserveDimensions = true;
      }
      /**
       * Flushes the current context state to the configured sink.
       */
      flush() {
        return __awaiter(this, void 0, void 0, function* () {
          const environment = yield this.resolveEnvironment();
          this.configureContextForEnvironment(this.context, environment);
          const sink = environment.getSink();
          yield sink.accept(this.context);
          this.context = this.context.createCopyWithContext(this.flushPreserveDimensions);
        });
      }
      /**
       * Set a property on the published metrics.
       * This is stored in the emitted log data and you are not
       * charged for this data by CloudWatch Metrics.
       * These values can be values that are useful for searching on,
       * but have too high cardinality to emit as dimensions to
       * CloudWatch Metrics.
       *
       * @param key Property name
       * @param value Property value
       */
      setProperty(key, value) {
        this.context.setProperty(key, value);
        return this;
      }
      /**
       * Adds a dimension.
       * This is generally a low cardinality key-value pair that is part of the metric identity.
       * CloudWatch treats each unique combination of dimensions as a separate metric, even if the metrics have the same metric name.
       *
       * @param dimension
       * @param value
       * @see [CloudWatch Dimensions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension)
       */
      putDimensions(dimensions) {
        this.context.putDimensions(dimensions);
        return this;
      }
      setDimensions(dimensionSetOrSets, useDefault = false) {
        if (Array.isArray(dimensionSetOrSets)) {
          this.context.setDimensions(dimensionSetOrSets, useDefault);
        } else {
          this.context.setDimensions([dimensionSetOrSets], useDefault);
        }
        return this;
      }
      /**
       * Clear all custom dimensions on this MetricsLogger instance
       *
       * @param useDefault indicates whether default dimensions should be used
       */
      resetDimensions(useDefault) {
        this.context.resetDimensions(useDefault);
        return this;
      }
      /**
       * Put a metric value.
       * This value will be emitted to CloudWatch Metrics asyncronously and does not contribute to your
       * account TPS limits. The value will also be available in your CloudWatch Logs
       * @param key
       * @param value
       * @param unit
       * @param storageResolution
       */
      putMetric(key, value, unit, storageResolution) {
        this.context.putMetric(key, value, unit, storageResolution);
        return this;
      }
      /**
       * Set the CloudWatch namespace that metrics should be published to.
       * @param value
       */
      setNamespace(value) {
        this.context.setNamespace(value);
        return this;
      }
      /**
       * Set the timestamp of metrics emitted in this context.
       *
       * If not set, the timestamp will default to new Date() at the point
       * the context is constructed.
       *
       * If set, timestamp will preserved across calls to flush().
       *
       * @param timestamp
       */
      setTimestamp(timestamp) {
        this.context.setTimestamp(timestamp);
        return this;
      }
      /**
       * Creates a new logger using the same contextual data as
       * the previous logger. This allows you to flush the instances
       * independently.
       */
      new() {
        return new _MetricsLogger(this.resolveEnvironment, this.context.createCopyWithContext());
      }
    };
    exports2.MetricsLogger = MetricsLogger2;
  }
});

// node_modules/@datastructures-js/heap/src/heap.js
var require_heap = __commonJS({
  "node_modules/@datastructures-js/heap/src/heap.js"(exports2) {
    "use strict";
    var Heap = class _Heap {
      /**
       * @param {function} compare
       * @param {array} [_values]
       * @param {number|string|object} [_leaf]
       */
      constructor(compare, _values, _leaf) {
        if (typeof compare !== "function") {
          throw new Error("Heap constructor expects a compare function");
        }
        this._compare = compare;
        this._nodes = Array.isArray(_values) ? _values : [];
        this._leaf = _leaf || null;
      }
      /**
       * Converts the heap to a cloned array without sorting.
       * @public
       * @returns {Array}
       */
      toArray() {
        return Array.from(this._nodes);
      }
      /**
       * Checks if a parent has a left child
       * @private
       */
      _hasLeftChild(parentIndex) {
        const leftChildIndex = parentIndex * 2 + 1;
        return leftChildIndex < this.size();
      }
      /**
       * Checks if a parent has a right child
       * @private
       */
      _hasRightChild(parentIndex) {
        const rightChildIndex = parentIndex * 2 + 2;
        return rightChildIndex < this.size();
      }
      /**
       * Compares two nodes
       * @private
       */
      _compareAt(i, j) {
        return this._compare(this._nodes[i], this._nodes[j]);
      }
      /**
       * Swaps two nodes in the heap
       * @private
       */
      _swap(i, j) {
        const temp = this._nodes[i];
        this._nodes[i] = this._nodes[j];
        this._nodes[j] = temp;
      }
      /**
       * Checks if parent and child should be swapped
       * @private
       */
      _shouldSwap(parentIndex, childIndex) {
        if (parentIndex < 0 || parentIndex >= this.size()) {
          return false;
        }
        if (childIndex < 0 || childIndex >= this.size()) {
          return false;
        }
        return this._compareAt(parentIndex, childIndex) > 0;
      }
      /**
       * Compares children of a parent
       * @private
       */
      _compareChildrenOf(parentIndex) {
        if (!this._hasLeftChild(parentIndex) && !this._hasRightChild(parentIndex)) {
          return -1;
        }
        const leftChildIndex = parentIndex * 2 + 1;
        const rightChildIndex = parentIndex * 2 + 2;
        if (!this._hasLeftChild(parentIndex)) {
          return rightChildIndex;
        }
        if (!this._hasRightChild(parentIndex)) {
          return leftChildIndex;
        }
        const compare = this._compareAt(leftChildIndex, rightChildIndex);
        return compare > 0 ? rightChildIndex : leftChildIndex;
      }
      /**
       * Compares two children before a position
       * @private
       */
      _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
        const compare = this._compareAt(rightChildIndex, leftChildIndex);
        if (compare <= 0 && rightChildIndex < index) {
          return rightChildIndex;
        }
        return leftChildIndex;
      }
      /**
       * Recursively bubbles up a node if it's in a wrong position
       * @private
       */
      _heapifyUp(startIndex) {
        let childIndex = startIndex;
        let parentIndex = Math.floor((childIndex - 1) / 2);
        while (this._shouldSwap(parentIndex, childIndex)) {
          this._swap(parentIndex, childIndex);
          childIndex = parentIndex;
          parentIndex = Math.floor((childIndex - 1) / 2);
        }
      }
      /**
       * Recursively bubbles down a node if it's in a wrong position
       * @private
       */
      _heapifyDown(startIndex) {
        let parentIndex = startIndex;
        let childIndex = this._compareChildrenOf(parentIndex);
        while (this._shouldSwap(parentIndex, childIndex)) {
          this._swap(parentIndex, childIndex);
          parentIndex = childIndex;
          childIndex = this._compareChildrenOf(parentIndex);
        }
      }
      /**
       * Recursively bubbles down a node before a given index
       * @private
       */
      _heapifyDownUntil(index) {
        let parentIndex = 0;
        let leftChildIndex = 1;
        let rightChildIndex = 2;
        let childIndex;
        while (leftChildIndex < index) {
          childIndex = this._compareChildrenBefore(
            index,
            leftChildIndex,
            rightChildIndex
          );
          if (this._shouldSwap(parentIndex, childIndex)) {
            this._swap(parentIndex, childIndex);
          }
          parentIndex = childIndex;
          leftChildIndex = parentIndex * 2 + 1;
          rightChildIndex = parentIndex * 2 + 2;
        }
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {Heap}
       */
      insert(value) {
        this._nodes.push(value);
        this._heapifyUp(this.size() - 1);
        if (this._leaf === null || this._compare(value, this._leaf) > 0) {
          this._leaf = value;
        }
        return this;
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {Heap}
       */
      push(value) {
        return this.insert(value);
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      extractRoot() {
        if (this.isEmpty()) {
          return null;
        }
        const root = this.root();
        this._nodes[0] = this._nodes[this.size() - 1];
        this._nodes.pop();
        this._heapifyDown(0);
        if (root === this._leaf) {
          this._leaf = this.root();
        }
        return root;
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      pop() {
        return this.extractRoot();
      }
      /**
       * Applies heap sort and return the values sorted by priority
       * @public
       * @returns {array}
       */
      sort() {
        for (let i = this.size() - 1; i > 0; i -= 1) {
          this._swap(0, i);
          this._heapifyDownUntil(i);
        }
        return this._nodes;
      }
      /**
       * Fixes node positions in the heap
       * @public
       * @returns {Heap}
       */
      fix() {
        for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i -= 1) {
          this._heapifyDown(i);
        }
        for (let i = Math.floor(this.size() / 2); i < this.size(); i += 1) {
          const value = this._nodes[i];
          if (this._leaf === null || this._compare(value, this._leaf) > 0) {
            this._leaf = value;
          }
        }
        return this;
      }
      /**
       * Verifies that all heap nodes are in the right position
       * @public
       * @returns {boolean}
       */
      isValid() {
        const isValidRecursive = (parentIndex) => {
          let isValidLeft = true;
          let isValidRight = true;
          if (this._hasLeftChild(parentIndex)) {
            const leftChildIndex = parentIndex * 2 + 1;
            if (this._compareAt(parentIndex, leftChildIndex) > 0) {
              return false;
            }
            isValidLeft = isValidRecursive(leftChildIndex);
          }
          if (this._hasRightChild(parentIndex)) {
            const rightChildIndex = parentIndex * 2 + 2;
            if (this._compareAt(parentIndex, rightChildIndex) > 0) {
              return false;
            }
            isValidRight = isValidRecursive(rightChildIndex);
          }
          return isValidLeft && isValidRight;
        };
        return isValidRecursive(0);
      }
      /**
       * Returns a shallow copy of the heap
       * @public
       * @returns {Heap}
       */
      clone() {
        return new _Heap(this._compare, this._nodes.slice(), this._leaf);
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      root() {
        if (this.isEmpty()) {
          return null;
        }
        return this._nodes[0];
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      top() {
        return this.root();
      }
      /**
       * Returns a leaf node in the heap
       * @public
       * @returns {number|string|object}
       */
      leaf() {
        return this._leaf;
      }
      /**
       * Returns the number of nodes in the heap
       * @public
       * @returns {number}
       */
      size() {
        return this._nodes.length;
      }
      /**
       * Checks if the heap is empty
       * @public
       * @returns {boolean}
       */
      isEmpty() {
        return this.size() === 0;
      }
      /**
       * Clears the heap
       * @public
       */
      clear() {
        this._nodes = [];
        this._leaf = null;
      }
      /**
       * Implements an iterable on the heap
       * @public
       */
      [Symbol.iterator]() {
        let size = this.size();
        return {
          next: () => {
            size -= 1;
            return {
              value: this.pop(),
              done: size === -1
            };
          }
        };
      }
      /**
       * Builds a heap from a array of values
       * @public
       * @static
       * @param {array} values
       * @param {function} compare
       * @returns {Heap}
       */
      static heapify(values, compare) {
        if (!Array.isArray(values)) {
          throw new Error("Heap.heapify expects an array of values");
        }
        if (typeof compare !== "function") {
          throw new Error("Heap.heapify expects a compare function");
        }
        return new _Heap(compare, values).fix();
      }
      /**
       * Checks if a list of values is a valid heap
       * @public
       * @static
       * @param {array} values
       * @param {function} compare
       * @returns {boolean}
       */
      static isHeapified(values, compare) {
        return new _Heap(compare, values).isValid();
      }
    };
    exports2.Heap = Heap;
  }
});

// node_modules/@datastructures-js/heap/src/minHeap.js
var require_minHeap = __commonJS({
  "node_modules/@datastructures-js/heap/src/minHeap.js"(exports2) {
    "use strict";
    var { Heap } = require_heap();
    var getMinCompare = (getCompareValue) => (a, b) => {
      const aVal = typeof getCompareValue === "function" ? getCompareValue(a) : a;
      const bVal = typeof getCompareValue === "function" ? getCompareValue(b) : b;
      return aVal <= bVal ? -1 : 1;
    };
    var MinHeap = class _MinHeap {
      /**
       * @param {function} [getCompareValue]
       * @param {Heap} [_heap]
       */
      constructor(getCompareValue, _heap) {
        this._getCompareValue = getCompareValue;
        this._heap = _heap || new Heap(getMinCompare(getCompareValue));
      }
      /**
       * Converts the heap to a cloned array without sorting.
       * @public
       * @returns {Array}
       */
      toArray() {
        return Array.from(this._heap._nodes);
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {MinHeap}
       */
      insert(value) {
        return this._heap.insert(value);
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {Heap}
       */
      push(value) {
        return this.insert(value);
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      extractRoot() {
        return this._heap.extractRoot();
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      pop() {
        return this.extractRoot();
      }
      /**
       * Applies heap sort and return the values sorted by priority
       * @public
       * @returns {array}
       */
      sort() {
        return this._heap.sort();
      }
      /**
       * Fixes node positions in the heap
       * @public
       * @returns {MinHeap}
       */
      fix() {
        return this._heap.fix();
      }
      /**
       * Verifies that all heap nodes are in the right position
       * @public
       * @returns {boolean}
       */
      isValid() {
        return this._heap.isValid();
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      root() {
        return this._heap.root();
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      top() {
        return this.root();
      }
      /**
       * Returns a leaf node in the heap
       * @public
       * @returns {number|string|object}
       */
      leaf() {
        return this._heap.leaf();
      }
      /**
       * Returns the number of nodes in the heap
       * @public
       * @returns {number}
       */
      size() {
        return this._heap.size();
      }
      /**
       * Checks if the heap is empty
       * @public
       * @returns {boolean}
       */
      isEmpty() {
        return this._heap.isEmpty();
      }
      /**
       * Clears the heap
       * @public
       */
      clear() {
        this._heap.clear();
      }
      /**
       * Returns a shallow copy of the MinHeap
       * @public
       * @returns {MinHeap}
       */
      clone() {
        return new _MinHeap(this._getCompareValue, this._heap.clone());
      }
      /**
       * Implements an iterable on the heap
       * @public
       */
      [Symbol.iterator]() {
        let size = this.size();
        return {
          next: () => {
            size -= 1;
            return {
              value: this.pop(),
              done: size === -1
            };
          }
        };
      }
      /**
       * Builds a MinHeap from an array
       * @public
       * @static
       * @param {array} values
       * @param {function} [getCompareValue]
       * @returns {MinHeap}
       */
      static heapify(values, getCompareValue) {
        if (!Array.isArray(values)) {
          throw new Error("MinHeap.heapify expects an array");
        }
        const heap = new Heap(getMinCompare(getCompareValue), values);
        return new _MinHeap(getCompareValue, heap).fix();
      }
      /**
       * Checks if a list of values is a valid min heap
       * @public
       * @static
       * @param {array} values
       * @param {function} [getCompareValue]
       * @returns {boolean}
       */
      static isHeapified(values, getCompareValue) {
        const heap = new Heap(getMinCompare(getCompareValue), values);
        return new _MinHeap(getCompareValue, heap).isValid();
      }
    };
    exports2.MinHeap = MinHeap;
  }
});

// node_modules/@datastructures-js/heap/src/maxHeap.js
var require_maxHeap = __commonJS({
  "node_modules/@datastructures-js/heap/src/maxHeap.js"(exports2) {
    "use strict";
    var { Heap } = require_heap();
    var getMaxCompare = (getCompareValue) => (a, b) => {
      const aVal = typeof getCompareValue === "function" ? getCompareValue(a) : a;
      const bVal = typeof getCompareValue === "function" ? getCompareValue(b) : b;
      return aVal < bVal ? 1 : -1;
    };
    var MaxHeap = class _MaxHeap {
      /**
       * @param {function} [getCompareValue]
       * @param {Heap} [_heap]
       */
      constructor(getCompareValue, _heap) {
        this._getCompareValue = getCompareValue;
        this._heap = _heap || new Heap(getMaxCompare(getCompareValue));
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {MaxHeap}
       */
      insert(value) {
        return this._heap.insert(value);
      }
      /**
       * Inserts a new value into the heap
       * @public
       * @param {number|string|object} value
       * @returns {Heap}
       */
      push(value) {
        return this.insert(value);
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      extractRoot() {
        return this._heap.extractRoot();
      }
      /**
       * Removes and returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      pop() {
        return this.extractRoot();
      }
      /**
       * Applies heap sort and return the values sorted by priority
       * @public
       * @returns {array}
       */
      sort() {
        return this._heap.sort();
      }
      /**
       * Converts the heap to a cloned array without sorting.
       * @public
       * @returns {Array}
       */
      toArray() {
        return Array.from(this._heap._nodes);
      }
      /**
       * Fixes node positions in the heap
       * @public
       * @returns {MaxHeap}
       */
      fix() {
        return this._heap.fix();
      }
      /**
       * Verifies that all heap nodes are in the right position
       * @public
       * @returns {boolean}
       */
      isValid() {
        return this._heap.isValid();
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      root() {
        return this._heap.root();
      }
      /**
       * Returns the root node in the heap
       * @public
       * @returns {number|string|object}
       */
      top() {
        return this.root();
      }
      /**
       * Returns a leaf node in the heap
       * @public
       * @returns {number|string|object}
       */
      leaf() {
        return this._heap.leaf();
      }
      /**
       * Returns the number of nodes in the heap
       * @public
       * @returns {number}
       */
      size() {
        return this._heap.size();
      }
      /**
       * Checks if the heap is empty
       * @public
       * @returns {boolean}
       */
      isEmpty() {
        return this._heap.isEmpty();
      }
      /**
       * Clears the heap
       * @public
       */
      clear() {
        this._heap.clear();
      }
      /**
       * Returns a shallow copy of the MaxHeap
       * @public
       * @returns {MaxHeap}
       */
      clone() {
        return new _MaxHeap(this._getCompareValue, this._heap.clone());
      }
      /**
       * Implements an iterable on the heap
       * @public
       */
      [Symbol.iterator]() {
        let size = this.size();
        return {
          next: () => {
            size -= 1;
            return {
              value: this.pop(),
              done: size === -1
            };
          }
        };
      }
      /**
       * Builds a MaxHeap from an array
       * @public
       * @static
       * @param {array} values
       * @param {function} [getCompareValue]
       * @returns {MaxHeap}
       */
      static heapify(values, getCompareValue) {
        if (!Array.isArray(values)) {
          throw new Error("MaxHeap.heapify expects an array");
        }
        const heap = new Heap(getMaxCompare(getCompareValue), values);
        return new _MaxHeap(getCompareValue, heap).fix();
      }
      /**
       * Checks if a list of values is a valid max heap
       * @public
       * @static
       * @param {array} values
       * @param {function} [getCompareValue]
       * @returns {boolean}
       */
      static isHeapified(values, getCompareValue) {
        const heap = new Heap(getMaxCompare(getCompareValue), values);
        return new _MaxHeap(getCompareValue, heap).isValid();
      }
    };
    exports2.MaxHeap = MaxHeap;
  }
});

// node_modules/@datastructures-js/heap/index.js
var require_heap2 = __commonJS({
  "node_modules/@datastructures-js/heap/index.js"(exports2) {
    "use strict";
    var { Heap } = require_heap();
    var { MinHeap } = require_minHeap();
    var { MaxHeap } = require_maxHeap();
    exports2.Heap = Heap;
    exports2.MinHeap = MinHeap;
    exports2.MaxHeap = MaxHeap;
  }
});

// node_modules/aws-embedded-metrics/lib/serializers/LogSerializer.js
var require_LogSerializer = __commonJS({
  "node_modules/aws-embedded-metrics/lib/serializers/LogSerializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LogSerializer = void 0;
    var heap_1 = require_heap2();
    var Constants_1 = require_Constants();
    var DimensionSetExceededError_1 = require_DimensionSetExceededError();
    var StorageResolution_1 = require_StorageResolution();
    var LogSerializer = class {
      /**
       * Retrieve the current context as a JSON string
       */
      serialize(context) {
        const dimensionKeys = [];
        let dimensionProperties = {};
        context.getDimensions().forEach((dimensionSet) => {
          const keys = Object.keys(dimensionSet);
          if (keys.length > Constants_1.Constants.MAX_DIMENSION_SET_SIZE) {
            const errMsg = `Maximum number of dimensions allowed are ${Constants_1.Constants.MAX_DIMENSION_SET_SIZE}.Account for default dimensions if not using set_dimensions.`;
            throw new DimensionSetExceededError_1.DimensionSetExceededError(errMsg);
          }
          dimensionKeys.push(keys);
          dimensionProperties = Object.assign(Object.assign({}, dimensionProperties), dimensionSet);
        });
        const createBody = () => {
          return Object.assign(Object.assign(Object.assign({}, dimensionProperties), context.properties), { _aws: Object.assign(Object.assign({}, context.meta), { CloudWatchMetrics: [
            {
              Dimensions: dimensionKeys,
              Metrics: [],
              Namespace: context.namespace
            }
          ] }) });
        };
        const eventBatches = [];
        let currentBody = createBody();
        const currentMetricsInBody = () => currentBody._aws.CloudWatchMetrics[0].Metrics.length;
        const hasMaxMetrics = () => currentMetricsInBody() === Constants_1.Constants.MAX_METRICS_PER_EVENT;
        const serializeCurrentBody = () => {
          eventBatches.push(JSON.stringify(currentBody));
          currentBody = createBody();
        };
        const remainingMetrics = heap_1.MaxHeap.heapify(Array.from(context.metrics, ([key, value]) => {
          return { name: key, numLeft: value.values.length };
        }), (metric) => metric.numLeft);
        let processedMetrics = [];
        while (!remainingMetrics.isEmpty()) {
          const metricProgress = remainingMetrics.extractRoot();
          const metric = context.metrics.get(metricProgress.name);
          if (metric) {
            const startIndex = metric.values.length - metricProgress.numLeft;
            const metricValue = metricProgress.numLeft === 1 ? metric.values[startIndex] : (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              metric.values.slice(startIndex, startIndex + Constants_1.Constants.MAX_VALUES_PER_METRIC)
            );
            currentBody[metricProgress.name] = metricValue;
            const metricBody = Object.assign({ Name: metricProgress.name, Unit: metric.unit }, metric.storageResolution == StorageResolution_1.StorageResolution.High ? { StorageResolution: StorageResolution_1.StorageResolution.High } : {});
            currentBody._aws.CloudWatchMetrics[0].Metrics.push(metricBody);
            metricProgress.numLeft -= Constants_1.Constants.MAX_VALUES_PER_METRIC;
            if (metricProgress.numLeft > 0) {
              processedMetrics.push(metricProgress);
            }
            if (hasMaxMetrics() || remainingMetrics.isEmpty()) {
              serializeCurrentBody();
              processedMetrics.forEach((processingMetric) => remainingMetrics.insert(processingMetric));
              processedMetrics = [];
            }
          }
        }
        if (eventBatches.length === 0 || currentMetricsInBody() > 0) {
          serializeCurrentBody();
        }
        return eventBatches;
      }
    };
    exports2.LogSerializer = LogSerializer;
  }
});

// node_modules/aws-embedded-metrics/lib/sinks/ConsoleSink.js
var require_ConsoleSink = __commonJS({
  "node_modules/aws-embedded-metrics/lib/sinks/ConsoleSink.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConsoleSink = void 0;
    var console_1 = require("console");
    var LogSerializer_1 = require_LogSerializer();
    var ConsoleSink = class _ConsoleSink {
      constructor(serializer) {
        this.name = "ConsoleSink";
        this.serializer = serializer || new LogSerializer_1.LogSerializer();
        this.console = process.env[_ConsoleSink.AWS_LAMBDA_LOG_FORMAT] === "JSON" ? new console_1.Console(process.stdout, process.stderr) : console;
      }
      accept(context) {
        const events = this.serializer.serialize(context);
        events.forEach((event) => this.console.log(event));
        return Promise.resolve();
      }
    };
    exports2.ConsoleSink = ConsoleSink;
    ConsoleSink.AWS_LAMBDA_LOG_FORMAT = "AWS_LAMBDA_LOG_FORMAT";
  }
});

// node_modules/aws-embedded-metrics/lib/sinks/connections/TcpClient.js
var require_TcpClient = __commonJS({
  "node_modules/aws-embedded-metrics/lib/sinks/connections/TcpClient.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TcpClient = void 0;
    var net = require("net");
    var Logger_1 = require_Logger();
    var TcpClient = class {
      constructor(endpoint) {
        this.endpoint = endpoint;
        this.socket = new net.Socket({ allowHalfOpen: true }).setEncoding("utf8").setKeepAlive(true).setTimeout(5e3).on("timeout", () => this.disconnect("idle timeout")).on("end", () => this.disconnect("end")).on("data", (data) => (0, Logger_1.LOG)("TcpClient received data.", data));
        this.initialConnect.apply(this);
      }
      initialConnect() {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            this.socket.connect(this.endpoint.port, this.endpoint.host, (err) => {
              if (err)
                reject(err);
              else
                resolve();
            });
          });
        });
      }
      warmup() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            yield this.establishConnection();
          } catch (err) {
            (0, Logger_1.LOG)("Failed to connect", err);
          }
        });
      }
      sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
          yield this.waitForOpenConnection();
          yield new Promise((resolve, reject) => {
            const onSendError = (err) => {
              (0, Logger_1.LOG)("Failed to write", err);
              reject(err);
            };
            const wasFlushedToKernel = this.socket.write(message, (err) => {
              if (!err) {
                (0, Logger_1.LOG)("Write succeeded");
                resolve();
              } else {
                onSendError(err);
              }
            });
            if (!wasFlushedToKernel) {
              (0, Logger_1.LOG)("TcpClient data was not flushed to kernel buffer and was queued in memory.");
            }
          });
        });
      }
      disconnect(eventName) {
        (0, Logger_1.LOG)("TcpClient disconnected due to:", eventName);
        this.socket.removeAllListeners();
        this.socket.destroy();
        this.socket.unref();
      }
      waitForOpenConnection() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this.socket.writable || this.socket.readyState !== "open") {
            yield this.establishConnection();
          }
        });
      }
      establishConnection() {
        return __awaiter(this, void 0, void 0, function* () {
          yield new Promise((resolve, reject) => {
            const onError = (e) => {
              if (e.message.includes("EISCONN")) {
                resolve();
                return;
              }
              (0, Logger_1.LOG)("TCP Client received error", e);
              this.disconnect(e.message);
              reject(e);
            };
            const onConnect = () => {
              this.socket.removeListener("error", onError);
              (0, Logger_1.LOG)("TcpClient connected.", this.endpoint);
              resolve();
            };
            switch (this.socket.readyState) {
              case "open":
                resolve();
                break;
              case "opening":
                this.socket.once("connect", onConnect);
                this.socket.once("error", onError);
                break;
              default:
                (0, Logger_1.LOG)("opening connection with socket in state: ", this.socket.readyState);
                this.socket.connect(this.endpoint.port, this.endpoint.host, onConnect).once("error", onError);
                break;
            }
          });
        });
      }
    };
    exports2.TcpClient = TcpClient;
  }
});

// node_modules/aws-embedded-metrics/lib/sinks/connections/UdpClient.js
var require_UdpClient = __commonJS({
  "node_modules/aws-embedded-metrics/lib/sinks/connections/UdpClient.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UdpClient = void 0;
    var dgram = require("dgram");
    var Logger_1 = require_Logger();
    var UdpClient = class {
      constructor(endpoint) {
        this.endpoint = endpoint;
      }
      // No warm up for UDP
      warmup() {
        return Promise.resolve();
      }
      sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
          const client = dgram.createSocket("udp4");
          client.send(message, this.endpoint.port, this.endpoint.host, (error) => {
            if (error) {
              (0, Logger_1.LOG)(error);
            }
            client.close();
          });
          return Promise.resolve();
        });
      }
    };
    exports2.UdpClient = UdpClient;
  }
});

// node_modules/aws-embedded-metrics/lib/sinks/AgentSink.js
var require_AgentSink = __commonJS({
  "node_modules/aws-embedded-metrics/lib/sinks/AgentSink.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AgentSink = void 0;
    var url = require("url");
    var Configuration_1 = __importDefault(require_Configuration());
    var LogSerializer_1 = require_LogSerializer();
    var Logger_1 = require_Logger();
    var TcpClient_1 = require_TcpClient();
    var UdpClient_1 = require_UdpClient();
    var TCP = "tcp:";
    var UDP = "udp:";
    var defaultTcpEndpoint = {
      host: "0.0.0.0",
      port: 25888,
      protocol: TCP
    };
    var parseEndpoint = (endpoint) => {
      try {
        if (!endpoint) {
          return defaultTcpEndpoint;
        }
        const parsedUrl = url.parse(endpoint);
        if (!parsedUrl.hostname || !parsedUrl.port || !parsedUrl.protocol) {
          (0, Logger_1.LOG)(`Failed to parse the provided agent endpoint. Falling back to the default TCP endpoint.`, parsedUrl);
          return defaultTcpEndpoint;
        }
        if (parsedUrl.protocol !== TCP && parsedUrl.protocol !== UDP) {
          (0, Logger_1.LOG)(`The provided agent endpoint protocol '${parsedUrl.protocol}' is not supported. Please use TCP or UDP. Falling back to the default TCP endpoint.`, parsedUrl);
          return defaultTcpEndpoint;
        }
        return {
          host: parsedUrl.hostname,
          port: Number(parsedUrl.port),
          protocol: parsedUrl.protocol
        };
      } catch (e) {
        (0, Logger_1.LOG)("Failed to parse the provided agent endpoint", e);
        return defaultTcpEndpoint;
      }
    };
    var AgentSink = class {
      constructor(logGroupName, logStreamName, serializer) {
        this.name = "AgentSink";
        this.logGroupName = logGroupName;
        this.logStreamName = logStreamName;
        this.serializer = serializer || new LogSerializer_1.LogSerializer();
        this.endpoint = parseEndpoint(Configuration_1.default.agentEndpoint);
        this.socketClient = this.getSocketClient(this.endpoint);
        (0, Logger_1.LOG)("Using socket client", this.socketClient.constructor.name);
      }
      accept(context) {
        return __awaiter(this, void 0, void 0, function* () {
          if (this.logGroupName) {
            context.meta.LogGroupName = this.logGroupName;
          }
          if (this.logStreamName) {
            context.meta.LogStreamName = this.logStreamName;
          }
          const events = this.serializer.serialize(context);
          (0, Logger_1.LOG)(`Sending {} events to socket.`, events.length);
          for (let index = 0; index < events.length; index++) {
            const event = events[index];
            const message = event + "\n";
            const bytes = Buffer.from(message);
            yield this.socketClient.sendMessage(bytes);
          }
        });
      }
      getSocketClient(endpoint) {
        (0, Logger_1.LOG)("Getting socket client for connection.", endpoint);
        const client = endpoint.protocol === TCP ? new TcpClient_1.TcpClient(endpoint) : new UdpClient_1.UdpClient(endpoint);
        client.warmup();
        return client;
      }
    };
    exports2.AgentSink = AgentSink;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/DefaultEnvironment.js
var require_DefaultEnvironment = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/DefaultEnvironment.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DefaultEnvironment = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var AgentSink_1 = require_AgentSink();
    var Logger_1 = require_Logger();
    var DefaultEnvironment = class {
      probe() {
        return Promise.resolve(true);
      }
      getName() {
        if (!Configuration_1.default.serviceName) {
          (0, Logger_1.LOG)("Unknown ServiceName.");
          return "Unknown";
        }
        return Configuration_1.default.serviceName;
      }
      getType() {
        if (!Configuration_1.default.serviceType) {
          (0, Logger_1.LOG)("Unknown ServiceType.");
          return "Unknown";
        }
        return Configuration_1.default.serviceType;
      }
      getLogGroupName() {
        if (Configuration_1.default.logGroupName === "") {
          return "";
        }
        return Configuration_1.default.logGroupName ? Configuration_1.default.logGroupName : `${this.getName()}-metrics`;
      }
      configureContext() {
      }
      getSink() {
        if (!this.sink) {
          this.sink = new AgentSink_1.AgentSink(this.getLogGroupName(), Configuration_1.default.logStreamName);
        }
        return this.sink;
      }
    };
    exports2.DefaultEnvironment = DefaultEnvironment;
  }
});

// node_modules/aws-embedded-metrics/lib/utils/Fetch.js
var require_Fetch = __commonJS({
  "node_modules/aws-embedded-metrics/lib/utils/Fetch.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fetchString = exports2.fetchJSON = exports2.fetch = void 0;
    var http_1 = require("http");
    var SOCKET_TIMEOUT = 1e3;
    var fetch = (options) => {
      return new Promise((resolve, reject) => {
        const request = (0, http_1.request)(options, (response) => {
          if (!response.statusCode) {
            reject(`Received undefined response status code from '${options.host || "unknown"}/${options.path || "unknown"}'`);
            return;
          }
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
            return;
          }
          const body = [];
          let bodyBytes = 0;
          response.on("data", (chunk) => {
            bodyBytes += chunk.length;
            body.push(chunk);
          });
          response.on("end", () => {
            const buffer = Buffer.concat(body, bodyBytes);
            resolve(buffer);
          });
        }).on("error", (err) => {
          reject(err);
        });
        request.on("socket", (socket) => {
          socket.on("timeout", () => {
            request.abort();
            reject(`Socket timeout while connecting to '${options.host || "unknown"}/${options.path || "unknown"}'`);
          });
          socket.setTimeout(SOCKET_TIMEOUT);
        });
        request.end();
      });
    };
    exports2.fetch = fetch;
    var fetchString = (options) => __awaiter(void 0, void 0, void 0, function* () {
      const buffer = yield fetch(options);
      return buffer.toString();
    });
    exports2.fetchString = fetchString;
    var fetchJSON = (options) => __awaiter(void 0, void 0, void 0, function* () {
      const responseString = yield fetchString(options);
      return JSON.parse(responseString);
    });
    exports2.fetchJSON = fetchJSON;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/ECSEnvironment.js
var require_ECSEnvironment = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/ECSEnvironment.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ECSEnvironment = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var AgentSink_1 = require_AgentSink();
    var Fetch_1 = require_Fetch();
    var Logger_1 = require_Logger();
    var os = __importStar(require("os"));
    var Constants_1 = require_Constants();
    var formatImageName = (imageName) => {
      if (imageName) {
        const splitImageName = imageName.split("/");
        return splitImageName[splitImageName.length - 1];
      }
      return imageName;
    };
    var ECSEnvironment = class {
      probe() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!process.env.ECS_CONTAINER_METADATA_URI) {
            return Promise.resolve(false);
          }
          if (process.env.FLUENT_HOST && !Configuration_1.default.agentEndpoint) {
            this.fluentBitEndpoint = `tcp://${process.env.FLUENT_HOST}:${Constants_1.Constants.DEFAULT_AGENT_PORT}`;
            Configuration_1.default.agentEndpoint = this.fluentBitEndpoint;
            (0, Logger_1.LOG)(`Using FluentBit configuration. Endpoint: ${this.fluentBitEndpoint}`);
          }
          try {
            const options = new URL(process.env.ECS_CONTAINER_METADATA_URI);
            this.metadata = yield (0, Fetch_1.fetchJSON)(options);
            if (this.metadata) {
              this.metadata.FormattedImageName = formatImageName(this.metadata.Image);
              (0, Logger_1.LOG)(`Successfully collected ECS Container metadata.`);
            }
          } catch (e) {
            (0, Logger_1.LOG)("Failed to collect ECS Container Metadata.");
            (0, Logger_1.LOG)(e);
          }
          return true;
        });
      }
      getName() {
        var _a;
        if (Configuration_1.default.serviceName) {
          return Configuration_1.default.serviceName;
        }
        return ((_a = this.metadata) === null || _a === void 0 ? void 0 : _a.FormattedImageName) ? this.metadata.FormattedImageName : "Unknown";
      }
      getType() {
        return "AWS::ECS::Container";
      }
      getLogGroupName() {
        if (this.fluentBitEndpoint) {
          return "";
        }
        return Configuration_1.default.logGroupName || this.getName();
      }
      configureContext(context) {
        var _a, _b, _c, _d, _e;
        this.addProperty(context, "containerId", os.hostname());
        this.addProperty(context, "createdAt", (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.CreatedAt);
        this.addProperty(context, "startedAt", (_b = this.metadata) === null || _b === void 0 ? void 0 : _b.StartedAt);
        this.addProperty(context, "image", (_c = this.metadata) === null || _c === void 0 ? void 0 : _c.Image);
        this.addProperty(context, "cluster", (_d = this.metadata) === null || _d === void 0 ? void 0 : _d.Labels["com.amazonaws.ecs.cluster"]);
        this.addProperty(context, "taskArn", (_e = this.metadata) === null || _e === void 0 ? void 0 : _e.Labels["com.amazonaws.ecs.task-arn"]);
        if (this.fluentBitEndpoint) {
          context.setDefaultDimensions({
            ServiceName: Configuration_1.default.serviceName || this.getName(),
            ServiceType: Configuration_1.default.serviceType || this.getType()
          });
        }
      }
      getSink() {
        if (!this.sink) {
          const logGroupName = this.fluentBitEndpoint ? "" : this.getLogGroupName();
          this.sink = new AgentSink_1.AgentSink(logGroupName);
        }
        return this.sink;
      }
      addProperty(context, key, value) {
        if (value) {
          context.setProperty(key, value);
        }
      }
    };
    exports2.ECSEnvironment = ECSEnvironment;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/EC2Environment.js
var require_EC2Environment = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/EC2Environment.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EC2Environment = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var AgentSink_1 = require_AgentSink();
    var Fetch_1 = require_Fetch();
    var Logger_1 = require_Logger();
    var host = "169.254.169.254";
    var tokenPath = "/latest/api/token";
    var tokenRequestHeaderKey = "X-aws-ec2-metadata-token-ttl-seconds";
    var tokenRequestHeaderValue = "21600";
    var metadataPath = "/latest/dynamic/instance-identity/document";
    var metadataRequestTokenHeaderKey = "X-aws-ec2-metadata-token";
    var EC2Environment = class {
      probe() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const options = {
              host,
              path: tokenPath,
              method: "PUT",
              headers: { [tokenRequestHeaderKey]: tokenRequestHeaderValue }
            };
            this.token = yield (0, Fetch_1.fetchString)(options);
          } catch (e) {
            (0, Logger_1.LOG)(e);
            return false;
          }
          try {
            const metadataOptions = {
              host,
              path: metadataPath,
              method: "GET",
              headers: { [metadataRequestTokenHeaderKey]: this.token }
            };
            this.metadata = yield (0, Fetch_1.fetchJSON)(metadataOptions);
            return !!this.metadata;
          } catch (e) {
            (0, Logger_1.LOG)(e);
            return false;
          }
        });
      }
      getName() {
        if (!Configuration_1.default.serviceName) {
          (0, Logger_1.LOG)("Unknown ServiceName.");
          return "Unknown";
        }
        return Configuration_1.default.serviceName;
      }
      getType() {
        if (this.metadata) {
          return "AWS::EC2::Instance";
        }
        return "Unknown";
      }
      getLogGroupName() {
        return Configuration_1.default.logGroupName ? Configuration_1.default.logGroupName : `${this.getName()}-metrics`;
      }
      configureContext(context) {
        if (this.metadata) {
          context.setProperty("imageId", this.metadata.imageId);
          context.setProperty("instanceId", this.metadata.instanceId);
          context.setProperty("instanceType", this.metadata.instanceType);
          context.setProperty("privateIP", this.metadata.privateIp);
          context.setProperty("availabilityZone", this.metadata.availabilityZone);
        }
      }
      getSink() {
        if (!this.sink) {
          this.sink = new AgentSink_1.AgentSink(this.getLogGroupName(), Configuration_1.default.logStreamName);
        }
        return this.sink;
      }
    };
    exports2.EC2Environment = EC2Environment;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/LambdaEnvironment.js
var require_LambdaEnvironment = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/LambdaEnvironment.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LambdaEnvironment = void 0;
    var ConsoleSink_1 = require_ConsoleSink();
    var LambdaEnvironment = class {
      probe() {
        return Promise.resolve(process.env.AWS_LAMBDA_FUNCTION_NAME ? true : false);
      }
      getName() {
        return process.env.AWS_LAMBDA_FUNCTION_NAME || "Unknown";
      }
      getType() {
        return "AWS::Lambda::Function";
      }
      getLogGroupName() {
        return this.getName();
      }
      configureContext(context) {
        this.addProperty(context, "executionEnvironment", process.env.AWS_EXECUTION_ENV);
        this.addProperty(context, "memorySize", process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE);
        this.addProperty(context, "functionVersion", process.env.AWS_LAMBDA_FUNCTION_VERSION);
        this.addProperty(context, "logStreamId", process.env.AWS_LAMBDA_LOG_STREAM_NAME);
        const trace = this.getSampledTrace();
        if (trace) {
          this.addProperty(context, "traceId", trace);
        }
      }
      getSink() {
        if (!this.sink) {
          this.sink = new ConsoleSink_1.ConsoleSink();
        }
        return this.sink;
      }
      addProperty(context, key, value) {
        if (value) {
          context.setProperty(key, value);
        }
      }
      getSampledTrace() {
        if (process.env._X_AMZN_TRACE_ID && process.env._X_AMZN_TRACE_ID.includes("Sampled=1")) {
          return process.env._X_AMZN_TRACE_ID;
        }
      }
    };
    exports2.LambdaEnvironment = LambdaEnvironment;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/LocalEnvironment.js
var require_LocalEnvironment = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/LocalEnvironment.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LocalEnvironment = void 0;
    var Configuration_1 = __importDefault(require_Configuration());
    var Logger_1 = require_Logger();
    var ConsoleSink_1 = require_ConsoleSink();
    var LocalEnvironment = class {
      probe() {
        return Promise.resolve(false);
      }
      getName() {
        if (!Configuration_1.default.serviceName) {
          (0, Logger_1.LOG)("Unknown ServiceName.");
          return "Unknown";
        }
        return Configuration_1.default.serviceName;
      }
      getType() {
        if (!Configuration_1.default.serviceType) {
          (0, Logger_1.LOG)("Unknown ServiceType.");
          return "Unknown";
        }
        return Configuration_1.default.serviceType;
      }
      getLogGroupName() {
        return Configuration_1.default.logGroupName ? Configuration_1.default.logGroupName : `${this.getName()}-metrics`;
      }
      configureContext() {
      }
      getSink() {
        if (!this.sink) {
          this.sink = new ConsoleSink_1.ConsoleSink();
        }
        return this.sink;
      }
    };
    exports2.LocalEnvironment = LocalEnvironment;
  }
});

// node_modules/aws-embedded-metrics/lib/environment/EnvironmentDetector.js
var require_EnvironmentDetector = __commonJS({
  "node_modules/aws-embedded-metrics/lib/environment/EnvironmentDetector.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cleanResolveEnvironment = exports2.resolveEnvironment = void 0;
    var Logger_1 = require_Logger();
    var DefaultEnvironment_1 = require_DefaultEnvironment();
    var ECSEnvironment_1 = require_ECSEnvironment();
    var EC2Environment_1 = require_EC2Environment();
    var LambdaEnvironment_1 = require_LambdaEnvironment();
    var Configuration_1 = __importDefault(require_Configuration());
    var Environments_1 = __importDefault(require_Environments());
    var LocalEnvironment_1 = require_LocalEnvironment();
    var lambdaEnvironment = new LambdaEnvironment_1.LambdaEnvironment();
    var ecsEnvironment = new ECSEnvironment_1.ECSEnvironment();
    var ec2Environment = new EC2Environment_1.EC2Environment();
    var defaultEnvironment = new DefaultEnvironment_1.DefaultEnvironment();
    var environments = [lambdaEnvironment, ecsEnvironment, ec2Environment];
    var environment = void 0;
    var getEnvironmentFromOverride = () => {
      switch (Configuration_1.default.environmentOverride) {
        case Environments_1.default.Agent:
          return defaultEnvironment;
        case Environments_1.default.EC2:
          return ec2Environment;
        case Environments_1.default.Lambda:
          return lambdaEnvironment;
        case Environments_1.default.ECS:
          return ecsEnvironment;
        case Environments_1.default.Local:
          return new LocalEnvironment_1.LocalEnvironment();
        case Environments_1.default.Unknown:
        default:
          return void 0;
      }
    };
    var discoverEnvironment = () => __awaiter(void 0, void 0, void 0, function* () {
      (0, Logger_1.LOG)(`Discovering environment`);
      for (const envUnderTest of environments) {
        (0, Logger_1.LOG)(`Testing: ${envUnderTest.constructor.name}`);
        try {
          if (yield envUnderTest.probe()) {
            return envUnderTest;
          }
        } catch (e) {
          (0, Logger_1.LOG)(`Failed probe: ${envUnderTest.constructor.name}`);
        }
      }
      return defaultEnvironment;
    });
    var _resolveEnvironment = () => __awaiter(void 0, void 0, void 0, function* () {
      (0, Logger_1.LOG)("Resolving environment");
      if (environment) {
        return environment;
      }
      if (Configuration_1.default.environmentOverride) {
        (0, Logger_1.LOG)("Environment override supplied", Configuration_1.default.environmentOverride);
        environment = getEnvironmentFromOverride();
        if (environment) {
          return environment;
        } else {
          (0, Logger_1.LOG)("Invalid environment provided. Falling back to auto-discovery.", Configuration_1.default.environmentOverride);
        }
      }
      environment = yield discoverEnvironment();
      return environment;
    });
    var environmentPromise = _resolveEnvironment();
    var resolveEnvironment = () => __awaiter(void 0, void 0, void 0, function* () {
      return environmentPromise;
    });
    exports2.resolveEnvironment = resolveEnvironment;
    var cleanResolveEnvironment = () => __awaiter(void 0, void 0, void 0, function* () {
      yield environmentPromise;
      environment = void 0;
      return yield _resolveEnvironment();
    });
    exports2.cleanResolveEnvironment = cleanResolveEnvironment;
  }
});

// node_modules/aws-embedded-metrics/lib/logger/MetricsLoggerFactory.js
var require_MetricsLoggerFactory = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/MetricsLoggerFactory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createMetricsLogger = void 0;
    var __1 = require_lib();
    var EnvironmentDetector_1 = require_EnvironmentDetector();
    var MetricsContext_1 = require_MetricsContext();
    var createMetricsLogger2 = () => {
      const context = MetricsContext_1.MetricsContext.empty();
      return new __1.MetricsLogger(EnvironmentDetector_1.resolveEnvironment, context);
    };
    exports2.createMetricsLogger = createMetricsLogger2;
  }
});

// node_modules/aws-embedded-metrics/lib/logger/MetricScope.js
var require_MetricScope = __commonJS({
  "node_modules/aws-embedded-metrics/lib/logger/MetricScope.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.metricScope = void 0;
    var Logger_1 = require_Logger();
    var MetricsLoggerFactory_1 = require_MetricsLoggerFactory();
    var metricScope = (handler2) => {
      const wrappedHandler = (...args) => __awaiter(void 0, void 0, void 0, function* () {
        const metrics = (0, MetricsLoggerFactory_1.createMetricsLogger)();
        try {
          return yield handler2(metrics)(...args);
        } finally {
          try {
            yield metrics.flush();
          } catch (e) {
            (0, Logger_1.LOG)("Failed to flush metrics", e);
          }
        }
      });
      return wrappedHandler;
    };
    exports2.metricScope = metricScope;
  }
});

// node_modules/aws-embedded-metrics/lib/index.js
var require_lib = __commonJS({
  "node_modules/aws-embedded-metrics/lib/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Configuration = exports2.StorageResolution = exports2.Unit = exports2.createMetricsLogger = exports2.metricScope = exports2.AgentSink = exports2.LocalSink = exports2.MetricsLogger = void 0;
    var MetricsLogger_1 = require_MetricsLogger();
    Object.defineProperty(exports2, "MetricsLogger", { enumerable: true, get: function() {
      return MetricsLogger_1.MetricsLogger;
    } });
    var ConsoleSink_1 = require_ConsoleSink();
    Object.defineProperty(exports2, "LocalSink", { enumerable: true, get: function() {
      return ConsoleSink_1.ConsoleSink;
    } });
    var AgentSink_1 = require_AgentSink();
    Object.defineProperty(exports2, "AgentSink", { enumerable: true, get: function() {
      return AgentSink_1.AgentSink;
    } });
    var MetricScope_1 = require_MetricScope();
    Object.defineProperty(exports2, "metricScope", { enumerable: true, get: function() {
      return MetricScope_1.metricScope;
    } });
    var MetricsLoggerFactory_1 = require_MetricsLoggerFactory();
    Object.defineProperty(exports2, "createMetricsLogger", { enumerable: true, get: function() {
      return MetricsLoggerFactory_1.createMetricsLogger;
    } });
    var Unit_1 = require_Unit();
    Object.defineProperty(exports2, "Unit", { enumerable: true, get: function() {
      return Unit_1.Unit;
    } });
    var StorageResolution_1 = require_StorageResolution();
    Object.defineProperty(exports2, "StorageResolution", { enumerable: true, get: function() {
      return StorageResolution_1.StorageResolution;
    } });
    var Configuration_1 = __importDefault(require_Configuration());
    exports2.Configuration = Configuration_1.default;
  }
});

// src/deallocate/deallocate.lambda.ts
var deallocate_lambda_exports = {};
__export(deallocate_lambda_exports, {
  METRIC_DIMENSION_OUTCOME: () => METRIC_DIMENSION_OUTCOME,
  METRIC_DIMENSION_STATUS_CODE: () => METRIC_DIMENSION_STATUS_CODE,
  METRIC_NAME: () => METRIC_NAME,
  doHandler: () => doHandler,
  handler: () => handler
});
module.exports = __toCommonJS(deallocate_lambda_exports);
var import_aws_embedded_metrics2 = __toESM(require_lib());

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

// src/metrics.ts
var import_aws_embedded_metrics = __toESM(require_lib());
var METRICS_NAMESPACE = "Atmosphere";
var METRIC_DIMENSION_POOL = "pool";
var UNKNOWN_POOL = "UNKNOWN";
var RuntimeMetrics = class {
  static async scoped(handler2) {
    const metrics = new PoolAwareMetricsLogger((0, import_aws_embedded_metrics.createMetricsLogger)());
    metrics.delegate.setNamespace(METRICS_NAMESPACE);
    metrics.delegate.setDimensions({});
    try {
      return await handler2(metrics);
    } finally {
      await metrics.delegate.flush();
    }
  }
};
var PoolAwareMetricsLogger = class {
  constructor(delegate) {
    this.delegate = delegate;
    this.pool = UNKNOWN_POOL;
  }
  setPool(pool) {
    this.pool = pool;
  }
  putDimensions(dimensions) {
    this.delegate.putDimensions({
      ...dimensions,
      [METRIC_DIMENSION_POOL]: this.pool
    });
  }
};

// src/deallocate/deallocate.lambda.ts
var MAX_CLEANUP_TIMEOUT_SECONDS = 60 * 60;
var ProxyError = class extends Error {
  constructor(statusCode, message) {
    super(`${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.message = message;
  }
};
var METRIC_NAME = "deallocate";
var METRIC_DIMENSION_STATUS_CODE = "statusCode";
var METRIC_DIMENSION_OUTCOME = "outcome";
var clients = RuntimeClients.getOrCreate();
async function handler(event) {
  return RuntimeMetrics.scoped(async (metrics) => {
    try {
      const response = await doHandler(event, metrics);
      metrics.putDimensions({ [METRIC_DIMENSION_STATUS_CODE]: response.statusCode.toString() });
      return response;
    } finally {
      metrics.delegate.putMetric(METRIC_NAME, 1, import_aws_embedded_metrics2.Unit.Count);
    }
  });
}
async function doHandler(event, metrics) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const id = (event.pathParameters ?? {}).id;
  if (!id) {
    return failure(400, "Missing 'id' path parameter");
  }
  const log = new AllocationLogger({ id, component: "deallocate" });
  try {
    const request = parseRequestBody(event.body);
    const cleanupDurationSeconds = request.cleanupDurationSeconds ?? MAX_CLEANUP_TIMEOUT_SECONDS;
    if (cleanupDurationSeconds > MAX_CLEANUP_TIMEOUT_SECONDS) {
      throw new ProxyError(400, `Maximum cleanup timeout is ${MAX_CLEANUP_TIMEOUT_SECONDS} seconds`);
    }
    const cleanupTimeoutDate = new Date(Date.now() + 1e3 * cleanupDurationSeconds);
    log.info(`Ending allocation with outcome: ${request.outcome}`);
    const allocation = await endAllocation(id, request.outcome);
    metrics.setPool(allocation.pool);
    metrics.putDimensions({ [METRIC_DIMENSION_OUTCOME]: request.outcome });
    log.info(`Scheduling timeout for cleanup of environment 'aws://${allocation.account}/${allocation.region}' to ${cleanupTimeoutDate}`);
    await clients.scheduler.scheduleCleanupTimeout({
      allocationId: allocation.id,
      account: allocation.account,
      region: allocation.region,
      timeoutDate: cleanupTimeoutDate,
      functionArn: Envars.required(CLEANUP_TIMEOUT_FUNCTION_ARN_ENV)
    });
    log.info(`Starting cleanup of 'aws://${allocation.account}/${allocation.region}'`);
    await clients.environments.cleaning(id, allocation.account, allocation.region);
    const taskInstanceArn = await clients.cleanup.start({ allocation, timeoutSeconds: cleanupDurationSeconds });
    log.info(`Successfully started cleanup task: ${taskInstanceArn}`);
    return success({ cleanupDurationSeconds });
  } catch (e) {
    if (e instanceof AllocationAlreadyEndedError) {
      log.info(`Returning success because: ${e.message}`);
      return success({ cleanupDurationSeconds: -1 });
    }
    log.error(e);
    const statusCode = e instanceof ProxyError ? e.statusCode : 500;
    return failure(statusCode, e.message);
  }
}
function success(body) {
  return { statusCode: 200, body: JSON.stringify(body) };
}
function failure(statusCode, message) {
  return { statusCode, body: JSON.stringify({ message }) };
}
function parseRequestBody(body) {
  if (!body) {
    throw new ProxyError(400, "Request body not found");
  }
  const parsed = JSON.parse(body);
  if (!parsed.outcome) {
    throw new ProxyError(400, "'outcome' must be provided in the request body");
  }
  return parsed;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  METRIC_DIMENSION_OUTCOME,
  METRIC_DIMENSION_STATUS_CODE,
  METRIC_NAME,
  doHandler,
  handler
});
/*! Bundled license information:

@datastructures-js/heap/src/heap.js:
  (**
   * @license MIT
   * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
   *
   * @class
   *)

@datastructures-js/heap/src/minHeap.js:
  (**
   * @license MIT
   * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
   *)

@datastructures-js/heap/src/maxHeap.js:
  (**
   * @license MIT
   * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
   *)
*/
