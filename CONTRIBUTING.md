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

When adding a new test, your going to iterate over its assertions quite a few times before getting it right.
Having to deploy your assertion on each iteration can take a lot of time. Instead, you can run your
assertion locally against an instance of a deployed service. To do so, first deploy the service by running:

```console
yarn integ:dev
```

Then, invoke your assertion locally by running:

```console
yarn integ:test/my-new-test:assert
```

The assertion auto discovers the deployed service and issues requests against it. For example:

```console
 ❯ yarn integ:test/allocate:assert
yarn run v1.22.19
$ npx projen integ:test/allocate:assert
👾 integ:test/allocate:assert | ts-node test/integ/allocate/assert.lambda.ts
[2024-12-30T20:11:15.140Z] [session] Clearing state
[2024-12-30T20:11:15.489Z] [session] 🎬 Start 🎬
[2024-12-30T20:11:15.489Z] [assertion] Sending allocation request with body: {"pool":"release","requester":"test"}
[2024-12-30T20:11:18.400Z] [assertion] Sending allocation request with body: {"pool":"release","requester":"test"}
[2024-12-30T20:11:18.759Z] [session] ✅ Success ✅
[2024-12-30T20:11:18.759Z] [session] Clearing state
[2024-12-30T20:11:18.930Z] [session]   » deleting environment aws://185706627232/us-west-2
[2024-12-30T20:11:19.273Z] [session]   » deleting allocation 05ac1047-869c-4387-9344-251ff371185b
✨  Done in 11.76s.
```

Update your assertion and repeat this command until it passes.
