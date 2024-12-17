# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Provides access to the service configuration file. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.config"></a>

```typescript
public readonly config: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

Provides access to the service configuration file.

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

##### `key`<sup>Required</sup> <a name="key" id="@cdklabs/cdk-atmosphere-service.Configuration.property.key"></a>

```typescript
public readonly key: string;
```

- *Type:* string

S3 Object key of configuration file.

---


## Structs <a name="Structs" id="Structs"></a>

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

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.AtmosphereServiceProps.property.config"></a>

```typescript
public readonly config: ConfigurationData;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.ConfigurationData">ConfigurationData</a>

Service Configuration, stored in a dedicated s3 bucket.

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



