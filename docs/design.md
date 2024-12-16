# CDK Atmosphere Service

## Solution

We will provide a publicly accessible HTTP service that manages a collection of pre-existing environments and allocates them to integration tests per request. Once the integration test relinquishes the environment, the service will perform cleanup and reinstate it for addition allocation requests. Timeouts will be imposed to make sure integration tests don’t hold an environment for an undetermined period of time.

### Registration

Registration is the process of adding capacity to the system. Before an environment can be allocated to an integration test, it must first be registered with the service. Registration is a manual process that involves:

1. Creating an account via Isengard.
2. Creating an Admin Role that the service can assume to offer temporary credentials.
3. Manually pushing a configuration update to the service codebase.
4. Deploying the service.

Environments are placed inside pools, where each pool contains a distinct set of environments. When integration tests issue an allocation request, they also specify which pool to allocate from. This allows for creating reserved capacity for specific stages or use cases.

### De-registration

De-registration is the process of removing capacity to the system. It can occur either because a specific environment is no longer needed, or because it requires human maintenance. It consists of:

1. Manually pushing a configuration update to the service codebase.
2. Deploying the service.

Before an environment can be de-registered, it must first be deallocated, as it may be currently in use. Therefore, de-registration is an asynchronous process; the environment is first marked as deregistered to prevent future allocations, and then deallocated in the background once the current allocation expires. Operators can query system state to determine when de-registration has fully completed.

## Detailed Architecture

### Config Layer

#### Registration & De-registration (`config` property)

Environments are added and removed from the service via code using the `config` property of the service construct. It contains a list of all possible environments that the service can select for allocation.

> Note: In order to allocate an environment, it must be both registered and not allocated.

Each environment must be assigned to a specific pool; pools correspond to the various stages integration tests are running in. When tests request an environment, they must specify which pool it should be allocated from. This ensures that different stages cannot interfere with each other. The number of registered environments per pool determines the parallelism limit of of the corresponding stage.

*Registration consists of:*

1. Creating an AWS account.
2. Creating an Admin Role that the service can assume to offer temporary credentials.
3. Adding a record to `config` property.
4. Deploying the service.

*De-registration consists of:*

1. Removing a record from the `config` property.
2. Deploying the service.

**Schema:**

```yaml
# the account id of the environment
account: string | required

# the region of the environment
region: string | required

# which pool this environment belongs to.
# should correspond to an integration test stage
pool: string | required

# Arn of an Admin role that the service
# has permissions to.
admin_role_arn: string | required
```
