# Contributing the CDK Atmosphere Service

## Integration Tests

Integration tests are located inside [test/integ](./test/integ/). Each directory represents a different test,
and is comporised of:

- `integ.*.ts.snapshot`: Snapshot directory of all test related resources.
- `assert.lambda.ts`: Lambda handler function that performs assertions on the deployed resources.
- `integ.*.ts`: CDK integration test definition file.

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
yarn integ:dev
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
[2024-12-31T14:36:47.629Z] [session] Created session with variables:
{
  "CDK_ATMOSPHERE_ALLOCATIONS_TABLE_NAME": "atmosphere-integ-dev-AtmosphereIntegTestAtmosphereAllocationsTable724969BB-1KCIN3TALIL7W",
  "CDK_ATMOSPHERE_ENVIRONMENTS_TABLE_NAME": "atmosphere-integ-dev-AtmosphereIntegTestAtmosphereEnvironmentsTableA3B14751-1FLJPKLNW0NY3",
  "CDK_ATMOSPHERE_CONFIGURATION_FILE_BUCKET": "atmosphere-integ-dev-atmosphereintegtestatmosphere-dbs98ifmvur4",
  "CDK_ATMOSPHERE_CONFIGURATION_FILE_KEY": "configuration.json",
  "CDK_ATMOSPHERE_REST_API_ID": "taguvtqka5",
  "CDK_ATMOSPHERE_ALLOCATIONS_RESOURCE_ID": "5fn6ba",
  "CDK_ATMOSPHERE_ALLOCATION_RESOURCE_ID": "6toc3p"
}
[2024-12-31T14:36:47.630Z] [session] Clearing state
[2024-12-31T14:36:48.459Z] [session] 🎬 Start 🎬
[2024-12-31T14:36:48.459Z] [assertion] Invoking local allocate handler with body: {"pool":"release","requester":"test"}

Event: {
  "body": "{\"pool\":\"release\",\"requester\":\"test\"}"
}
Parsing request body
Acquiring environment from pool 'release'
Found 1 environments in pool 'release'
Acquiring environment 'aws://185706627232/us-west-2'...
Starting allocation of 'aws://185706627232/us-west-2'
Grabbing credentials to aws://185706627232/us-west-2 using role: arn:aws:iam::185706627232:role/atmosphere-integ-dev-AdminC75D2A91-5xlocylmXxan
Allocation '7bf74bda-c5fb-4433-9011-2016fbdf63a2' started successfully

[2024-12-31T14:36:51.361Z] [assertion] Invoking local allocate handler with body: {"pool":"release","requester":"test"}

Event: {
  "body": "{\"pool\":\"release\",\"requester\":\"test\"}"
}
Parsing request body
Acquiring environment from pool 'release'
Found 1 environments in pool 'release'
Acquiring environment 'aws://185706627232/us-west-2'...
Environment 'aws://185706627232/us-west-2' already acquired. Trying the next one.
ProxyError: No environments available in pool 'release'
    at acquireEnvironment (/Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/src/allocate/allocate.lambda.ts:109:9)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Object.handler (/Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/src/allocate/allocate.lambda.ts:46:25)
    at async Object.env (/Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/with.ts:10:12)
    at async Session.allocate (/Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/service.session.ts:101:24)
    at async /Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/allocate/assert.lambda.ts:21:14
    at async Function.assert (/Users/epolon/dev/src/github.com/cdklabs/cdk-atmosphere-service/test/integ/service.session.ts:40:7) {
  statusCode: 423
}

[2024-12-31T14:36:51.531Z] [session] ✅ Success ✅
[2024-12-31T14:36:51.531Z] [session] Clearing state
[2024-12-31T14:36:51.712Z] [session]   » deleting environment aws://185706627232/us-west-2
[2024-12-31T14:36:52.064Z] [session]   » deleting allocation 7bf74bda-c5fb-4433-9011-2016fbdf63a2
✨  Done in 11.76s.
```

Update your assertion and repeat this command until it passes.
