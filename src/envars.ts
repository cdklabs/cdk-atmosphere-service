const ENV_PREFIX = 'CDK_ATMOSPHERE_';

// static infrastructure information
export const ALLOCATIONS_TABLE_NAME_ENV = `${ENV_PREFIX}ALLOCATIONS_TABLE_NAME`;
export const ENVIRONMENTS_TABLE_NAME_ENV = `${ENV_PREFIX}ENVIRONMENTS_TABLE_NAME`;
export const CONFIGURATION_BUCKET_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_BUCKET`;
export const CONFIGURATION_KEY_ENV = `${ENV_PREFIX}CONFIGURATION_FILE_KEY`;
export const SCHEDULER_DLQ_ARN_ENV = `${ENV_PREFIX}SCHEDULER_DLQ_ARN`;
export const SCHEDULER_ROLE_ARN_ENV = `${ENV_PREFIX}SCHEDULER_ROLE_ARN`;
export const CLEANUP_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TIMEOUT_FUNCTION_ARN`;
export const ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV = `${ENV_PREFIX}ALLOCATION_TIMEOUT_FUNCTION_ARN`;
export const REST_API_ID_ENV = `${ENV_PREFIX}REST_API_ID`;
export const ALLOCATIONS_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATIONS_RESOURCE_ID`;
export const ALLOCATION_RESOURCE_ID_ENV = `${ENV_PREFIX}ALLOCATION_RESOURCE_ID`;
export const DEALLOCATE_FUNCTION_NAME_ENV = `${ENV_PREFIX}DEALLOCATE_FUNCTION_NAME`;
export const CLEANUP_CLUSTER_ARN_ENV = `${ENV_PREFIX}CLEANUP_CLUSTER_ARN`;
export const CLEANUP_TASK_DEFINITION_ARN_ENV = `${ENV_PREFIX}CLEANUP_TASK_DEFINITION_ARN`;
export const CLEANUP_TASK_SUBNET_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SUBNET_ID`;
export const CLEANUP_TASK_SECURITY_GROUP_ID_ENV = `${ENV_PREFIX}CLEANUP_TASK_SECURITY_GROUP_ID`;
export const CLEANUP_TASK_CONTAINER_NAME_ENV = `${ENV_PREFIX}CLEANUP_TASK_CONTAINER_NAME`;

// runtime information for specific operations
// intentionally not modeled in the `EnvironmentVariables` because it cannot be;
// its values are operation specific and available only at runtime.
export const CLEANUP_TASK_ALLOCATION_ID = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_ALLOCATION_ID`;
export const CLEANUP_TASK_TIMEOUT_SECONDS = `${ENV_PREFIX}RUNTIME_CLEANUP_TASK_TIMEOUT_SECONDS`;

export type EnvironmentVariables = {
  [ALLOCATIONS_TABLE_NAME_ENV]: string;
  [ENVIRONMENTS_TABLE_NAME_ENV]: string;
  [CONFIGURATION_BUCKET_ENV]: string;
  [CONFIGURATION_KEY_ENV]: string;
  [SCHEDULER_DLQ_ARN_ENV]: string;
  [SCHEDULER_ROLE_ARN_ENV]: string;
  [CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: string;
  [ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: string;
  [REST_API_ID_ENV]: string;
  [ALLOCATIONS_RESOURCE_ID_ENV]: string;
  [ALLOCATION_RESOURCE_ID_ENV]: string;
  [DEALLOCATE_FUNCTION_NAME_ENV]: string;
  [CLEANUP_CLUSTER_ARN_ENV]: string;
  [CLEANUP_TASK_DEFINITION_ARN_ENV]: string;
  [CLEANUP_TASK_SUBNET_ID_ENV]: string;
  [CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: string;
  [CLEANUP_TASK_CONTAINER_NAME_ENV]: string;
}

export class Envars {

  public static required(name: keyof EnvironmentVariables): string {
    const value = Envars.optional(name);
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }

  public static optional(name: keyof EnvironmentVariables): string | undefined {
    return process.env[name];
  }
}
