# Atmosphere Service

> [API Reference](./API.md)

An HTTP service that manages a collection of pre-existing environments and allocates them to integration tests per request.

## Usage

```ts
import { AtmosphereService } from '@cdklabs/cdk-atmosphere-service';

new AtmosphereService(stack, 'AtmosphereService', {
  config: {
    environments: [
      {
        account: '1111',
        region: 'us-east-1',
        pool: 'release',
        adminRoleArn: 'arn:aws:iam::1111:role/Admin'
      }
    ]
  }
});
```
