# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Allocate <a name="Allocate" id="@cdklabs/cdk-atmosphere-service.Allocate"></a>

Allocate function.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Allocate.Initializer"></a>

```typescript
import { Allocate } from '@cdklabs/cdk-atmosphere-service'

new Allocate(scope: Construct, id: string, props: AllocateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AllocateProps">AllocateProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Allocate.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AllocateProps">AllocateProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Allocate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Allocate.isConstruct"></a>

```typescript
import { Allocate } from '@cdklabs/cdk-atmosphere-service'

Allocate.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Allocate.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Allocate.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="@cdklabs/cdk-atmosphere-service.Allocate.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### Allocations <a name="Allocations" id="@cdklabs/cdk-atmosphere-service.Allocations"></a>

Allocations table.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Allocations.Initializer"></a>

```typescript
import { Allocations } from '@cdklabs/cdk-atmosphere-service'

new Allocations(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Allocations.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Allocations.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite">grantReadWrite</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Allocations.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantReadWrite` <a name="grantReadWrite" id="@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite"></a>

```typescript
public grantReadWrite(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Allocations.isConstruct"></a>

```typescript
import { Allocations } from '@cdklabs/cdk-atmosphere-service'

Allocations.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Allocations.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.property.table">table</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Allocations.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/cdk-atmosphere-service.Allocations.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---


### AtmosphereService <a name="AtmosphereService" id="@cdklabs/cdk-atmosphere-service.AtmosphereService"></a>

Atmosphere service to allocate AWS environments on-demand.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer"></a>

```typescript
import { AtmosphereService } from '@cdklabs/cdk-atmosphere-service'

new AtmosphereService(scope: Construct, id: string, props: AtmosphereServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps">AtmosphereServiceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps">AtmosphereServiceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.isConstruct"></a>

```typescript
import { AtmosphereService } from '@cdklabs/cdk-atmosphere-service'

AtmosphereService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.allocate">allocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a></code> | Provides access to the allocate function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | Provides access to the allocations table. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Provides access to the service configuration file. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.deallocate">deallocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a></code> | Provides access to the deaclloce function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.endpoint">endpoint</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint">Endpoint</a></code> | Provides access to the API gateway endpoint. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Provides access to the environments table. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `allocate`<sup>Required</sup> <a name="allocate" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.allocate"></a>

```typescript
public readonly allocate: Allocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a>

Provides access to the allocate function.

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Provides access to the allocations table.

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.config"></a>

```typescript
public readonly config: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

Provides access to the service configuration file.

---

##### `deallocate`<sup>Required</sup> <a name="deallocate" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.deallocate"></a>

```typescript
public readonly deallocate: Deallocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a>

Provides access to the deaclloce function.

---

##### `endpoint`<sup>Required</sup> <a name="endpoint" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.endpoint"></a>

```typescript
public readonly endpoint: Endpoint;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Endpoint">Endpoint</a>

Provides access to the API gateway endpoint.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Provides access to the environments table.

---


### Configuration <a name="Configuration" id="@cdklabs/cdk-atmosphere-service.Configuration"></a>

Service configuration construct.

Configuration data will be written to a JSON file and stored in a dedicated s3 bucket.
Logical components that needs access should use the `grantRead` method and then
download the file whenever they need to.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Configuration.Initializer"></a>

```typescript
import { Configuration } from '@cdklabs/cdk-atmosphere-service'

new Configuration(scope: Construct, id: string, props: ConfigurationProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationProps">ConfigurationProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Configuration.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.ConfigurationProps">ConfigurationProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.grantRead">grantRead</a></code> | Allow the given identity to download the configuration file(s). |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Configuration.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantRead` <a name="grantRead" id="@cdklabs/cdk-atmosphere-service.Configuration.grantRead"></a>

```typescript
public grantRead(identity: IGrantable): void
```

Allow the given identity to download the configuration file(s).

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Configuration.grantRead.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Configuration.isConstruct"></a>

```typescript
import { Configuration } from '@cdklabs/cdk-atmosphere-service'

Configuration.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Configuration.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | S3 Bucket where the configuration file is stored. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.property.data">data</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a></code> | Configuration data. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration.property.key">key</a></code> | <code>string</code> | S3 Object key of configuration file. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Configuration.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@cdklabs/cdk-atmosphere-service.Configuration.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

S3 Bucket where the configuration file is stored.

---

##### `data`<sup>Required</sup> <a name="data" id="@cdklabs/cdk-atmosphere-service.Configuration.property.data"></a>

```typescript
public readonly data: ConfigurationData;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a>

Configuration data.

---

##### `key`<sup>Required</sup> <a name="key" id="@cdklabs/cdk-atmosphere-service.Configuration.property.key"></a>

```typescript
public readonly key: string;
```

- *Type:* string

S3 Object key of configuration file.

---


### Deallocate <a name="Deallocate" id="@cdklabs/cdk-atmosphere-service.Deallocate"></a>

Deallocate function.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Deallocate.Initializer"></a>

```typescript
import { Deallocate } from '@cdklabs/cdk-atmosphere-service'

new Deallocate(scope: Construct, id: string, props: DeallocateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps">DeallocateProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Deallocate.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps">DeallocateProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Deallocate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Deallocate.isConstruct"></a>

```typescript
import { Deallocate } from '@cdklabs/cdk-atmosphere-service'

Deallocate.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Deallocate.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Deallocate.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="@cdklabs/cdk-atmosphere-service.Deallocate.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### Endpoint <a name="Endpoint" id="@cdklabs/cdk-atmosphere-service.Endpoint"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Endpoint.Initializer"></a>

```typescript
import { Endpoint } from '@cdklabs/cdk-atmosphere-service'

new Endpoint(scope: Construct, id: string, props: EndpointProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointProps">EndpointProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Endpoint.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.EndpointProps">EndpointProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Endpoint.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Endpoint.isConstruct"></a>

```typescript
import { Endpoint } from '@cdklabs/cdk-atmosphere-service'

Endpoint.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Endpoint.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | Api Gateway rest api. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Endpoint.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `api`<sup>Required</sup> <a name="api" id="@cdklabs/cdk-atmosphere-service.Endpoint.property.api"></a>

```typescript
public readonly api: RestApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApi

Api Gateway rest api.

---


### Environments <a name="Environments" id="@cdklabs/cdk-atmosphere-service.Environments"></a>

Environments table.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer"></a>

```typescript
import { Environments } from '@cdklabs/cdk-atmosphere-service'

new Environments(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite">grantReadWrite</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Environments.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantReadWrite` <a name="grantReadWrite" id="@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite"></a>

```typescript
public grantReadWrite(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Environments.isConstruct"></a>

```typescript
import { Environments } from '@cdklabs/cdk-atmosphere-service'

Environments.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Environments.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.property.table">table</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Environments.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/cdk-atmosphere-service.Environments.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---


## Structs <a name="Structs" id="Structs"></a>

### AllocateProps <a name="AllocateProps" id="@cdklabs/cdk-atmosphere-service.AllocateProps"></a>

Properties for `Allocate`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.AllocateProps.Initializer"></a>

```typescript
import { AllocateProps } from '@cdklabs/cdk-atmosphere-service'

const allocateProps: AllocateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocateProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | Allocations storage. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocateProps.property.configuration">configuration</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Service configuration. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocateProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Environments storage. |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.AllocateProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Allocations storage.

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@cdklabs/cdk-atmosphere-service.AllocateProps.property.configuration"></a>

```typescript
public readonly configuration: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

Service configuration.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.AllocateProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Environments storage.

---

### AtmosphereServiceProps <a name="AtmosphereServiceProps" id="@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps"></a>

Properties for `AtmosphereService`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.Initializer"></a>

```typescript
import { AtmosphereServiceProps } from '@cdklabs/cdk-atmosphere-service'

const atmosphereServiceProps: AtmosphereServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a></code> | Service Configuration, stored in a dedicated s3 bucket. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.property.endpoint">endpoint</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointOptions">EndpointOptions</a></code> | Options for the API endpoint. |

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.property.config"></a>

```typescript
public readonly config: ConfigurationData;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a>

Service Configuration, stored in a dedicated s3 bucket.

---

##### `endpoint`<sup>Optional</sup> <a name="endpoint" id="@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.property.endpoint"></a>

```typescript
public readonly endpoint: EndpointOptions;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.EndpointOptions">EndpointOptions</a>

Options for the API endpoint.

---

### ConfigurationData <a name="ConfigurationData" id="@cdklabs/cdk-atmosphere-service.ConfigurationData"></a>

Configuration Data.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.ConfigurationData.Initializer"></a>

```typescript
import { ConfigurationData } from '@cdklabs/cdk-atmosphere-service'

const configurationData: ConfigurationData = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environment">Environment</a>[]</code> | List of environments, configured by the service operator. |

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.ConfigurationData.property.environments"></a>

```typescript
public readonly environments: Environment[];
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environment">Environment</a>[]

List of environments, configured by the service operator.

---

### ConfigurationProps <a name="ConfigurationProps" id="@cdklabs/cdk-atmosphere-service.ConfigurationProps"></a>

Properties of `Configuration`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.ConfigurationProps.Initializer"></a>

```typescript
import { ConfigurationProps } from '@cdklabs/cdk-atmosphere-service'

const configurationProps: ConfigurationProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationProps.property.data">data</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a></code> | Data of the configuration file. |

---

##### `data`<sup>Required</sup> <a name="data" id="@cdklabs/cdk-atmosphere-service.ConfigurationProps.property.data"></a>

```typescript
public readonly data: ConfigurationData;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a>

Data of the configuration file.

---

### DeallocateProps <a name="DeallocateProps" id="@cdklabs/cdk-atmosphere-service.DeallocateProps"></a>

Properties for `Deallocate`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.Initializer"></a>

```typescript
import { DeallocateProps } from '@cdklabs/cdk-atmosphere-service'

const deallocateProps: DeallocateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | Allocations storage. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Environments storage. |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Allocations storage.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Environments storage.

---

### EndpointOptions <a name="EndpointOptions" id="@cdklabs/cdk-atmosphere-service.EndpointOptions"></a>

Options for `Endpoint`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.EndpointOptions.Initializer"></a>

```typescript
import { EndpointOptions } from '@cdklabs/cdk-atmosphere-service'

const endpointOptions: EndpointOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointOptions.property.allowedAccounts">allowedAccounts</a></code> | <code>string[]</code> | List of accounts that are allowed to access the endpoint. |

---

##### `allowedAccounts`<sup>Optional</sup> <a name="allowedAccounts" id="@cdklabs/cdk-atmosphere-service.EndpointOptions.property.allowedAccounts"></a>

```typescript
public readonly allowedAccounts: string[];
```

- *Type:* string[]
- *Default:* only the service account is allowed.

List of accounts that are allowed to access the endpoint.

---

### EndpointProps <a name="EndpointProps" id="@cdklabs/cdk-atmosphere-service.EndpointProps"></a>

Properties `Endpoint`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.EndpointProps.Initializer"></a>

```typescript
import { EndpointProps } from '@cdklabs/cdk-atmosphere-service'

const endpointProps: EndpointProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointProps.property.allowedAccounts">allowedAccounts</a></code> | <code>string[]</code> | List of accounts that are allowed to access the endpoint. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointProps.property.allocate">allocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a></code> | Allocate function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EndpointProps.property.deallocate">deallocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a></code> | Deallocate function. |

---

##### `allowedAccounts`<sup>Optional</sup> <a name="allowedAccounts" id="@cdklabs/cdk-atmosphere-service.EndpointProps.property.allowedAccounts"></a>

```typescript
public readonly allowedAccounts: string[];
```

- *Type:* string[]
- *Default:* only the service account is allowed.

List of accounts that are allowed to access the endpoint.

---

##### `allocate`<sup>Required</sup> <a name="allocate" id="@cdklabs/cdk-atmosphere-service.EndpointProps.property.allocate"></a>

```typescript
public readonly allocate: Allocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a>

Allocate function.

---

##### `deallocate`<sup>Required</sup> <a name="deallocate" id="@cdklabs/cdk-atmosphere-service.EndpointProps.property.deallocate"></a>

```typescript
public readonly deallocate: Deallocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a>

Deallocate function.

---

### Environment <a name="Environment" id="@cdklabs/cdk-atmosphere-service.Environment"></a>

Environment Configuration.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.Environment.Initializer"></a>

```typescript
import { Environment } from '@cdklabs/cdk-atmosphere-service'

const environment: Environment = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environment.property.account">account</a></code> | <code>string</code> | Account ID. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environment.property.adminRoleArn">adminRoleArn</a></code> | <code>string</code> | ARN of an Admin role in the account. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environment.property.pool">pool</a></code> | <code>string</code> | Which pool does this environment belong to. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environment.property.region">region</a></code> | <code>string</code> | Region. |

---

##### `account`<sup>Required</sup> <a name="account" id="@cdklabs/cdk-atmosphere-service.Environment.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

Account ID.

---

##### `adminRoleArn`<sup>Required</sup> <a name="adminRoleArn" id="@cdklabs/cdk-atmosphere-service.Environment.property.adminRoleArn"></a>

```typescript
public readonly adminRoleArn: string;
```

- *Type:* string

ARN of an Admin role in the account.

This role must be pre-created
and allow the service to assume it.

---

##### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environment.property.pool"></a>

```typescript
public readonly pool: string;
```

- *Type:* string

Which pool does this environment belong to.

---

##### `region`<sup>Required</sup> <a name="region" id="@cdklabs/cdk-atmosphere-service.Environment.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

Region.

---



