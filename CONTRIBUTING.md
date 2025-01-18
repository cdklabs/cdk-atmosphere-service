# Contributing the CDK Atmosphere Service

## Integration Tests

Integration tests are located inside [test/integ](./test/integ/). Each directory represents a different test,
and is comporised of:

- `integ.*.ts.snapshot`: Snapshot directory of all test related resources.
- `assert.lambda.ts`: Lambda handler function that performs assertions on the deployed resources.
- `integ.*.ts`: CDK integration test definition file. This is where you define the properties
- `stacks`: A directory containing CloudFormation template that can be deployed as part of tests.
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
projen integ:test/allocate             Deploy -> Update Snapshot -> Destroy
projen integ:test/allocate:assert      Run the assertion locally
projen integ:test/allocate:force       Force Deploy -> Update Snapshot -> Destroy
projen integ:test/allocate:deploy      Force Deploy -> Update Snapshot -> Dont Destroy
projen integ:test/allocate:snapshot    Dont Deploy -> Update snapshot (discoureged)
projen integ:test/allocate:update      Deploy -> Update Snapshot (if needed)
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
- Forward runtime code invocations to the local handlers on disk.

This means that if you change the runtime code of any component, you can just run the assertion immediately,
without needing to either build or deploy the service.

> To run local assertions against the remote runtime set `CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME=false`
before running the projen task. Remember that in this case you will need to redeploy the service.
