# Contributing the CDK Atmosphere Service

## Integration Tests

Integration tests are located inside [test/integ](./test/integ/). Each directory represents a different test,
and is comporised of:

- `integ.*.ts.snapshot`: Snapshot directory of all test related resources.
- `assert.lambda.ts`: Lambda handler function that performs assertions on the deployed resources.
- `integ.*.ts`: CDK integration test definition file.

### Running all tests

Before creating a PR

1. Obtain credentials to an AWS account.
2. `yarn integ`

tests and compare the output against the comitted snapshot. If a difference is detected, you'll
need to update snapshot of the test by running `yarn integ:update`.

> You can also run individual tests. For example: `yarn integ:test/allocate`

### Adding Tests

To add a test, create a new directory inside [test/integ](./test/integ/) and follow existing patterns. A recommended workflow to author tests is:

1. `yarn integ:test/my-new-test:deploy`. This will deploy the resources and keep them running.
2. `yarn integ:test/my-new-test:assert`. This will run just the assertion lambda against the deployed resources. Iterate on your assertions until this command succeeds.
3. `yarn integ:test/my-new-test:update`. This will update the snapshot to the working version.
