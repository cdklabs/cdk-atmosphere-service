# CDK Test Envirnoment Allocation Service | Atmosphere

## Glossary

* **Environment:** A combination of an AWS account and region, where resources can be deployed to.
* **Integration Test:** A single execution instance of a test. Two executions (even if parallel) are considered two distinct integration tests.
* **Stage:** Where in the [SDLC](https://aws.amazon.com/what-is/sdlc/) is the integration test executed in. (e.g `release`, `canary`)

## High Level Overview

We will provide a publicly accessible HTTP service that manages a collection of pre-existing
environments and allocates them to integration tests per request. Once the integration test
relinquishes the environment, the service will perform cleanup and reinstate it for addition
allocation requests. Timeouts will be imposed to make sure integration tests don’t hold an
environment for an undetermined period of time.

While the service is publicly available, it will not allow anonymous access. During service deployment,
an operator will configure a list of accounts that will have access to the service. These are the
accounts that test runners will be executed in. (note: these are not the target accounts
where test resources are deployed to).

### Registration

Registration is the process of adding capacity to the system. Before an environment can
be allocated to an integration test, it must first be registered with the service.
Registration is a manual process that involves:

1. Creating an AWS account.
2. Creating an Admin Role that the service can assume to offer temporary credentials.
3. Manually provisioning any desired resources in the account.
4. Manually pushing a configuration update to the service codebase.
5. Deploying the service.

Environments are placed inside pools, where each pool contains a distinct set of environments.
When integration tests issue an allocation request, they also specify which pool to allocate from.
This allows for creating reserved capacity for specific stages or use cases.

### Allocation

Whenever an integration test requires an environment, it issues an environment allocation request
to the service. Most commonly,  allocations will consist of a single standard environment.
However, custom allocations are also supported in order to cater for tests with specific needs:

* Tests that require multiple accounts.
* Tests that require specific resources to be available in an environment.
* Tests that require specific authentication credentials.

Based on the request query, the service will discover available environments and provide the
test with authentication information for each environment, along with its metadata. In case no
environments are available, the service will respond with an error, signaling the integration
test should try again later. Environments allocated to a specific test will be marked as
unavailable until the same test issues an environment deallocation request. This prevents test
interference regardless of where the test is executed from.

Environments are allocated for a fixed session duration of 3 hours. When the session expires,
the service will regain control of the allocated environments by explicitly issuing a deallocation
request on behalf of the integration test.

### Deallocation

Whenever an integration test finishes execution, whether it failed or succeeded, it must
issue an environment deallocation request. Upon receiving such a request, the service begins
cleaning up the environment. In order to guarantee tests are unable to create resources after
they have relinquished their environments, the service also deactivates all provided credentials.

Once cleanup completes successfully, the environment is marked as available and reinstated back
to the list of available environments. This ensures tests are given a fresh environment,
further ensuring no tests interfere with each other. In case of a cleanup failure or timeout,
the environment will be marked as “dirty” and will require human intervention before it can be reinstated.

### De-registration

De-registration is the process of removing capacity to the system. It can occur either
because a specific environment is no longer needed, or because it requires human maintenance.
It consists of:

1. Manually pushing a configuration update to the service codebase.
2. Deploying the service.

Before an environment can be de-registered, it must first be deallocated, as it may be currently in use.
Therefore, de-registration is an asynchronous process; the environment is first marked as deregistered to
prevent future allocations, and then deallocated in the background once the current allocation expires.
Operators can query system state to determine when de-registration has fully completed.

## Detailed Architecture

### Components Diagram

The following diagram describes all components involved in the functional behavior of the proposed service.
Arrows correspond to the direction of access.

![Components Diagram](./images/components-diagram.png)

### Config Layer

#### Configuration (S3 Bucket)

Environments are registered and de-registered from the service via a configuration
option of the service construct. The configuration will be stored in an S3 bucket
so that it can be accessed at runtime by logical components of the service. It contains
a list of all possible environments that the service can select for allocation.

> Note: In order to allocate an environment, it must be both registered and not allocated.

Each environment must be assigned to a specific pool; pools correspond to the various stages integration tests are running in. When tests request an environment, they must specify which pool it should be allocated from. This ensures that different stages cannot interfere with each other. The number of registered environments per pool determines the parallelism limit of of the corresponding stage.

Each environment can expose certain optional capabilities that are recorded in the configuration file. These allow catering for integration tests that require a non standard environment. Capabilities are dynamic and can vary greatly across environments.

> For example, a capability could be providing a hosted zone with a hosted_zone_name attribute.

**Registration consists of:**

1. Creating an AWS account.
2. Creating an Admin Role that the service can assume to offer temporary credentials.
3. Manually provisioning any desired resources in the account.
4. Adding a record to the service configuration.
5. Deploying the service.

**De-registration consists of:**

1. Removing a record from the service configuration.
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
admin_role: string | required
  
# dynamic properties that expose environment 
# specific capabilities
capabilities: {string, any} | optional
```

### Api Layer

Api Gateway will provide the public HTTP endpoint for clients to interact with. Requests are routed to
individual lambda functions using the Lambda Proxy Integration. In addition, the endpoint will handle
authentication and authorization.

**Routes:**

* `POST /allocations` → Allocation (Lambda Function).
* `DELETE /allocations/{id}` → Deallocation (Lambda Function)

![API Diagram](./images/api-diagram.png)