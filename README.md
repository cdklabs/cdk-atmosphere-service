# Atmosphere Service

> [API Reference](./API.md)

An HTTP service that manages a collection of pre-existing environments and allocates them to integration tests per request.

## Usage

```ts
import * as cdk from 'aws-cdk-lib';
import { AtmosphereService } from '@cdklabs/cdk-atmosphere-service';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');
new AtmosphereService(stack, 'AtmosphereService', {
  config: {
    environments: [
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'release',
        roleArn: 'arn:aws:iam::1111:role/Admin'
      }
    ]
  }
});
```
