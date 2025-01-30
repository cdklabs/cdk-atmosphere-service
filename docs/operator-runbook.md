# 🦺 Operator Runbook

> This document aims at helping operators navigate a CDK Atmosphere service deployment
> to diagnose (and where possible, solve) problems. As much as possible, articles should be
> self-contained, to reduce the need for cross-referencing documents.

## 🚨 Alarms

### `Atmosphere/Allocate/UnexpectedFailure`

#### Description

Fires when the `Allocate` Lambda function throws an error. Note that the function is
configured as an HTTP proxy to our `APIGateway` endpoint, this means that the function
returns a 500 status code in case of a failure, and should never throw.

The alarm indicates the lambda handler code did not run as expected, i.e the encoutered
error was not explicitly caught and converted to a 500 response.

#### Impact

Integration tests may start failing as they will not be able to acquire environments.

#### Investigation

Dive into the `CloudWatch` logs of the function to see the errors.

#### Resolution

The alarm will automatically go back to green once the Lambda function stops failing.

### `Atmosphere/Allocate/${pool}/StatusCode/500`

#### Description

Fires when the `Allocate` Lambda function returns 500 errors. This alarm is
sectioned by the pool passed in the allocation request.

It means an exception was thrown (and caught) somewhere in the handler code.

#### Impact

Integration tests may start failing as they will not be able to acquire environments.

#### Investigation

Dive into the `CloudWatch` logs of the function to see the errors.

#### Resolution

The alarm will automatically go back to green once the Lambda function stops failing.

### `Atmosphere/Deallocate/UnexpectedFailure`

#### Description

Fires when the `Deallocate` Lambda function throws an error. Note that the function is
configured as an HTTP proxy to our `APIGateway` endpoint, this means that the function
returns a 500 status code in case of a failure, and should never throw.

The alarm indicates the lambda handler code did not run as expected, i.e the encoutered
error was not explicitly caught and converted to a 500 response.

#### Impact

Integration tests won't be able to release environments. This won't fail the test,
but may cause environment depletion that can lead to failures in subsequent tests.

#### Investigation

Dive into the `CloudWatch` logs of the function to see the errors.

#### Resolution

The alarm will automatically go back to green once the Lambda function stops failing.

### `Atmosphere/Deallocate/${pool}/StatusCode/500`

### `Atmosphere/Cleanup/${pool}/ExitCode/1`

### `Atmosphere/Environments/${pool}/Dirty`

### `Atmosphere/Scheduler/DLQ/NotEmpty`

## 📜 Logs

## ❔ FAQ
