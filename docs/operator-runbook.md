# 🦺 Operator Runbook

> This document aims at helping operators navigate a CDK Atmosphere service deployment to diagnose (and where possible, solve) problems.
> The table of contents of this file should always allow an operator to directly jump to the relevant article.
> As much as possible, articles should be self-contained, to reduce the need for cross-referencing documents.

## 🚨 Alarms

### `Atmosphere/Allocate/UnexpectedFailure`

#### Description

Fires when the `Allocate` Lambda function throws an error. Note that the function is
configured as an HTTP proxy to our `APIGateway` endpoint, this means that the function
returns a 500 status code in case of a failure, and should never throw.

The alarm indicates the lambda handler code did not run as expected, i.e the encoutered
error was not explicitly caught and converted to a 500 response.

#### Impact

Degredaded 

#### Investigation

Dive into the `CloudWatch` logs of the function to see the errors.

#### Resolution

The alarm will automatically go back to green once the Lambda function stops failing.

### `Atmosphere/Allocate/${pool}/StatusCode/500`

#### Description

#### Investigation

#### Resolution

### `Atmosphere/Deallocate/UnexpectedFailure`

#### Description

#### Investigation

#### Resolution

### `Atmosphere/Deallocate/${pool}/StatusCode/500`

### `Atmosphere/Cleanup/ExitCode/1`

### `Atmosphere/Environments/${pool}/Dirty`

## 📜 Logs

## ❔ FAQ
