# Contributing the CDK Atmosphere Service

## Integration Tests

Integration tests are located inside [test/integ](./test/integ/). Each directory represents a different test,
and is comporised of:

- `integ.*.ts.snapshot`: Snapshot directory of all test related resources.
- `assert.lambda.ts`: Lambda handler function that performs assertions on the deployed resources.
- `integ.*.ts`: CDK integration test definition file. This is where you define the properties
of the service you need for the test.

The assertion runs within an AWS Lambda that is executed after the service is deployed.

### Running

Integration tests are executed in snapshot mode during project build.

`yarn integ`

Snapshot mode only performs a snapshot diff, and fails if a change is detected. A diff can occur
when either infrastructure or runtime bundles have changed. For example:

```console
Verifying integration test snapshots...

  CHANGED    integ/allocate/integ.allocate 12.067s
      Resources
[~] AWS::Lambda::Function AtmosphereAllocateAtmosphereAllocateFunction60E59FA1
 └─ [~] Environment
     └─ [~] .Variables:
         └─ [-] Removed: .CDK_ATMOSPHERE_ALLOCATIONS_TABLE_NAME

...
...

Snapshot Results: 

Tests:    3 failed, 3 total
Failed: /Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/allocate/integ.allocate.ts
Failed: /Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/deallocate/integ.deallocate.ts
Failed: /Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/dev/integ.dev.ts
Error: Some tests failed!
To re-run failed tests run: integ-runner --update-on-failed
```

When this happens, a [snapshot update](#updating-snapshots) is required.

### Updating Snapshots

Updating integration tests is a local dev task that deploys the test and runs its assertion.

`yarn integ:update`

> Your terminal must have access to AWS credentials for this to work.

Once this command finishes successfully, `git commit` the resulting changes and run `yarn integ` to validate
everything was updated as expected.

### Force Updating Snapshots

Sometimes you may want to redeploy all integration tests regardless of whether the snapshot changed or not.
To do so, you run can:

```console
yarn integ:force
```

> Note that this will always update a snapshot because it leverages salts to trigger redeployments.

### Individual Tests

Each integration test defines its own set of projen tasks that allow you to operate on a single test.

```console
projen integ:test/allocate             Run the test in snapshot mode
projen integ:test/allocate:assert      Run the assertion locally against a deployed service
projen integ:test/allocate:deploy      Deploy and update the snapshot while keeping the service running
projen integ:test/allocate:force       Force update the snapshot by deploying the test
projen integ:test/allocate:snapshot    Update snapshot without deploying (discoureged)
projen integ:test/allocate:update      Deploy and update the snapshot if necessary
```

### Adding

Create a new directory inside [test/integ](./test/integ/) and create the following files:

- `assert.lambda.ts`: Lambda handler function that performs assertions on the deployed resources.
- `integ.*.ts`: CDK integration test definition file.

> Have a look at existing tests to get a sense of these files should look like.

#### Iteration Loop

When adding a new test, your going to iterate over its assertions and the code it tests quite a few
times before getting it right. Having to deploy it each iteration can take a lot of time. Instead, you can run your
assertion locally against an instance of a deployed service. To do so, first deploy the service by running:

```console
yarn integ:test/dev:deploy
```

Then, invoke your assertion locally by running:

```console
yarn integ:test/my-new-test:assert
```

Assertion code will be executed locally using `ts-node`, which will:

- Discover deployed service attribute and make them available to tests via env variables.
- Forward calls to `session.allocate` or `session.deallocate` to the local lambda handlers.

> This means that if you change the `allocate`/`deallocate` lambda handlers, you can just run the local assertion immediately,
without needing to either build or deploy the service.

For example:

```console
 ❯ yarn integ:test/allocate:assert
yarn run v1.22.19
$ npx projen integ:test/allocate:assert
👾 integ:test/allocate:assert | ts-node test/integ/allocate/assert.lambda.ts
[2025-01-05T08:15:12.911Z] [session] [allocate-creates-the-right-resources] Created session with variables: {
  "CDK_ATMOSPHERE_ALLOCATIONS_TABLE_NAME": "atmosphere-integ-dev-AtmosphereAllocationsTable4ECEFD7B-18GGEOKH9VASI",
  "CDK_ATMOSPHERE_ENVIRONMENTS_TABLE_NAME": "atmosphere-integ-dev-AtmosphereEnvironmentsTable430B8CE1-M4NVROOBIL3N",
  "CDK_ATMOSPHERE_CONFIGURATION_FILE_BUCKET": "atmosphere-integ-dev-atmosphereconfigurationbucket-1ffnmqzdhay2",
  "CDK_ATMOSPHERE_CONFIGURATION_FILE_KEY": "configuration.json",
  "CDK_ATMOSPHERE_SCHEDULER_DLQ_ARN": "arn:aws:sqs:us-east-1:185706627232:atmosphere-integ-dev-AtmosphereSchedulerDLQCF6976A3-uID7dpThkmHh",
  "CDK_ATMOSPHERE_SCHEDULER_ROLE_ARN": "arn:aws:iam::185706627232:role/atmosphere-integ-dev-AtmosphereSchedulerRole0116FB5-MMgLRLmArFy2",
  "CDK_ATMOSPHERE_CLEANUP_TIMEOUT_FUNCTION_ARN": "arn:aws:lambda:us-east-1:185706627232:function:atmosphere-integ-dev-AtmosphereSchedulerCleanupTim-woOP12FJIXZV",
  "CDK_ATMOSPHERE_ALLOCATION_TIMEOUT_FUNCTION_ARN": "arn:aws:lambda:us-east-1:185706627232:function:atmosphere-integ-dev-AtmosphereSchedulerAllocation-NNLjg7vxcUps",
  "CDK_ATMOSPHERE_REST_API_ID": "3mlxjlvbze",
  "CDK_ATMOSPHERE_ALLOCATIONS_RESOURCE_ID": "qxuldz",
  "CDK_ATMOSPHERE_ALLOCATION_RESOURCE_ID": "9jrk05",
  "CDK_ATMOSPHERE_DEALLOCATE_FUNCTION_NAME": "atmosphere-integ-dev-AtmosphereDeallocateFunctionB-IttAVkzgK5pA"
}
[2025-01-05T08:15:12.912Z] [session] [allocate-creates-the-right-resources] Clearing state
[2025-01-05T08:15:14.183Z] [assertion] [allocate-creates-the-right-resources] 🎬 Start 🎬
[2025-01-05T08:15:14.183Z] [assertion] [allocate-creates-the-right-resources] Invoking local allocate handler with body: {"pool":"release","requester":"test"}

Event: {
  "body": "{\"pool\":\"release\",\"requester\":\"test\"}"
}
Parsing request body
Acquiring environment from pool 'release'
Found 1 environments in pool 'release'
Acquiring environment 'aws://185706627232/eu-central-1'...
Starting allocation of 'aws://185706627232/eu-central-1'
Grabbing credentials to aws://185706627232/eu-central-1 using role: arn:aws:iam::185706627232:role/atmosphere-integ-dev-AdminC75D2A91-epQH9bqiZcrd
Allocation '172c8c5e-fad6-4ebe-9495-c1ca8a0a58e6' started successfully
Scheduling timeout for allocation '172c8c5e-fad6-4ebe-9495-c1ca8a0a58e6' to Sun Jan 05 2025 11:15:14 GMT+0200 (שעון ישראל (חורף))

[2025-01-05T08:15:17.590Z] [assertion] [allocate-creates-the-right-resources] ✅ Success ✅
[2025-01-05T08:15:17.590Z] [session] [allocate-creates-the-right-resources] Clearing state
[2025-01-05T08:15:17.757Z] [session] [allocate-creates-the-right-resources]   » deleting environment aws://185706627232/eu-central-1
[2025-01-05T08:15:18.087Z] [session] [allocate-creates-the-right-resources]   » deleting allocation 172c8c5e-fad6-4ebe-9495-c1ca8a0a58e6
[2025-01-05T08:15:18.409Z] [session] [allocate-creates-the-right-resources]   » deleting schedule atmosphere.timeout.aloc_172c8c5e-fad6-4ebe-9495-c1ca8a0a58e6
✨  Done in 17.86s.
```

Update your assertion and repeat this command until it passes.
