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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.grantQueryLogs">grantQueryLogs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate.metricStatusCode">metricStatusCode</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Allocate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantQueryLogs` <a name="grantQueryLogs" id="@cdklabs/cdk-atmosphere-service.Allocate.grantQueryLogs"></a>

```typescript
public grantQueryLogs(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.Allocate.grantQueryLogs.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricStatusCode` <a name="metricStatusCode" id="@cdklabs/cdk-atmosphere-service.Allocate.metricStatusCode"></a>

```typescript
public metricStatusCode(pool: string, statusCode: number): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Allocate.metricStatusCode.parameter.pool"></a>

- *Type:* string

---

###### `statusCode`<sup>Required</sup> <a name="statusCode" id="@cdklabs/cdk-atmosphere-service.Allocate.metricStatusCode.parameter.statusCode"></a>

- *Type:* number

---

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.grantRead">grantRead</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite">grantReadWrite</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.metricFailure">metricFailure</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.metricInProgress">metricInProgress</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.metricSuccess">metricSuccess</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.metricTimeout">metricTimeout</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Allocations.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantRead` <a name="grantRead" id="@cdklabs/cdk-atmosphere-service.Allocations.grantRead"></a>

```typescript
public grantRead(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Allocations.grantRead.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantReadWrite` <a name="grantReadWrite" id="@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite"></a>

```typescript
public grantReadWrite(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Allocations.grantReadWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricFailure` <a name="metricFailure" id="@cdklabs/cdk-atmosphere-service.Allocations.metricFailure"></a>

```typescript
public metricFailure(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Allocations.metricFailure.parameter.pool"></a>

- *Type:* string

---

##### `metricInProgress` <a name="metricInProgress" id="@cdklabs/cdk-atmosphere-service.Allocations.metricInProgress"></a>

```typescript
public metricInProgress(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Allocations.metricInProgress.parameter.pool"></a>

- *Type:* string

---

##### `metricSuccess` <a name="metricSuccess" id="@cdklabs/cdk-atmosphere-service.Allocations.metricSuccess"></a>

```typescript
public metricSuccess(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Allocations.metricSuccess.parameter.pool"></a>

- *Type:* string

---

##### `metricTimeout` <a name="metricTimeout" id="@cdklabs/cdk-atmosphere-service.Allocations.metricTimeout"></a>

```typescript
public metricTimeout(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Allocations.metricTimeout.parameter.pool"></a>

- *Type:* string

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.property.monitor">monitor</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor">AllocationsMonitor</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations.property.table">table</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Allocations.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `monitor`<sup>Required</sup> <a name="monitor" id="@cdklabs/cdk-atmosphere-service.Allocations.property.monitor"></a>

```typescript
public readonly monitor: AllocationsMonitor;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor">AllocationsMonitor</a>

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/cdk-atmosphere-service.Allocations.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---


### AllocationsMonitor <a name="AllocationsMonitor" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer"></a>

```typescript
import { AllocationsMonitor } from '@cdklabs/cdk-atmosphere-service'

new AllocationsMonitor(scope: Construct, id: string, props: AllocationsMonitorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps">AllocationsMonitorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps">AllocationsMonitorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.isConstruct"></a>

```typescript
import { AllocationsMonitor } from '@cdklabs/cdk-atmosphere-service'

AllocationsMonitor.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitor.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `period`<sup>Required</sup> <a name="period" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitor.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


### AllocationTimeout <a name="AllocationTimeout" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer"></a>

```typescript
import { AllocationTimeout } from '@cdklabs/cdk-atmosphere-service'

new AllocationTimeout(scope: Construct, id: string, props: AllocationTimeoutProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps">AllocationTimeoutProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps">AllocationTimeoutProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantInvoke">grantInvoke</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantQueryLogs">grantQueryLogs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricError">metricError</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricSuccess">metricSuccess</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantInvoke` <a name="grantInvoke" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantQueryLogs` <a name="grantQueryLogs" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantQueryLogs"></a>

```typescript
public grantQueryLogs(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.grantQueryLogs.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricError` <a name="metricError" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricError"></a>

```typescript
public metricError(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricError.parameter.pool"></a>

- *Type:* string

---

##### `metricSuccess` <a name="metricSuccess" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricSuccess"></a>

```typescript
public metricSuccess(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.metricSuccess.parameter.pool"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.isConstruct"></a>

```typescript
import { AllocationTimeout } from '@cdklabs/cdk-atmosphere-service'

AllocationTimeout.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="@cdklabs/cdk-atmosphere-service.AllocationTimeout.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.cleanup">cleanup</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a></code> | Provides access to the cleanup task. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Provides access to the service configuration file. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.deallocate">deallocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a></code> | Provides access to the deaclloce function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.endpoint">endpoint</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint">Endpoint</a></code> | Provides access to the API gateway endpoint. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Provides access to the environments table. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AtmosphereService.property.scheduler">scheduler</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a></code> | Provides access to the scheduler. |

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

##### `cleanup`<sup>Required</sup> <a name="cleanup" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.cleanup"></a>

```typescript
public readonly cleanup: Cleanup;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a>

Provides access to the cleanup task.

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

##### `scheduler`<sup>Required</sup> <a name="scheduler" id="@cdklabs/cdk-atmosphere-service.AtmosphereService.property.scheduler"></a>

```typescript
public readonly scheduler: Scheduler;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a>

Provides access to the scheduler.

---


### Cleanup <a name="Cleanup" id="@cdklabs/cdk-atmosphere-service.Cleanup"></a>

Provides a cleanup task.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Cleanup.Initializer"></a>

```typescript
import { Cleanup } from '@cdklabs/cdk-atmosphere-service'

new Cleanup(scope: Construct, id: string, props: CleanupProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupProps">CleanupProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Cleanup.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.CleanupProps">CleanupProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.grantQueryLogs">grantQueryLogs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.grantRun">grantRun</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.metricExitCode">metricExitCode</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.metricOutcome">metricOutcome</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Cleanup.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantQueryLogs` <a name="grantQueryLogs" id="@cdklabs/cdk-atmosphere-service.Cleanup.grantQueryLogs"></a>

```typescript
public grantQueryLogs(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.Cleanup.grantQueryLogs.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantRun` <a name="grantRun" id="@cdklabs/cdk-atmosphere-service.Cleanup.grantRun"></a>

```typescript
public grantRun(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.Cleanup.grantRun.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricExitCode` <a name="metricExitCode" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricExitCode"></a>

```typescript
public metricExitCode(pool: string, exitCode: number): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricExitCode.parameter.pool"></a>

- *Type:* string

---

###### `exitCode`<sup>Required</sup> <a name="exitCode" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricExitCode.parameter.exitCode"></a>

- *Type:* number

---

##### `metricOutcome` <a name="metricOutcome" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricOutcome"></a>

```typescript
public metricOutcome(pool: string, outcome: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricOutcome.parameter.pool"></a>

- *Type:* string

---

###### `outcome`<sup>Required</sup> <a name="outcome" id="@cdklabs/cdk-atmosphere-service.Cleanup.metricOutcome.parameter.outcome"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Cleanup.isConstruct"></a>

```typescript
import { Cleanup } from '@cdklabs/cdk-atmosphere-service'

Cleanup.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Cleanup.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.Cluster</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.containerName">containerName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.LogGroup</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.securityGroupId">securityGroupId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.subnetId">subnetId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup.property.task">task</a></code> | <code>aws-cdk-lib.aws_ecs.FargateTaskDefinition</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.cluster"></a>

```typescript
public readonly cluster: Cluster;
```

- *Type:* aws-cdk-lib.aws_ecs.Cluster

---

##### `containerName`<sup>Required</sup> <a name="containerName" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.containerName"></a>

```typescript
public readonly containerName: string;
```

- *Type:* string

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.logGroup"></a>

```typescript
public readonly logGroup: LogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.LogGroup

---

##### `securityGroupId`<sup>Required</sup> <a name="securityGroupId" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.securityGroupId"></a>

```typescript
public readonly securityGroupId: string;
```

- *Type:* string

---

##### `subnetId`<sup>Required</sup> <a name="subnetId" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.subnetId"></a>

```typescript
public readonly subnetId: string;
```

- *Type:* string

---

##### `task`<sup>Required</sup> <a name="task" id="@cdklabs/cdk-atmosphere-service.Cleanup.property.task"></a>

```typescript
public readonly task: FargateTaskDefinition;
```

- *Type:* aws-cdk-lib.aws_ecs.FargateTaskDefinition

---


### CleanupTimeout <a name="CleanupTimeout" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer"></a>

```typescript
import { CleanupTimeout } from '@cdklabs/cdk-atmosphere-service'

new CleanupTimeout(scope: Construct, id: string, props: CleanupTimeoutProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps">CleanupTimeoutProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps">CleanupTimeoutProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantInvoke">grantInvoke</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantQueryLogs">grantQueryLogs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricError">metricError</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricSuccess">metricSuccess</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantInvoke` <a name="grantInvoke" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantQueryLogs` <a name="grantQueryLogs" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantQueryLogs"></a>

```typescript
public grantQueryLogs(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.grantQueryLogs.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricError` <a name="metricError" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricError"></a>

```typescript
public metricError(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricError.parameter.pool"></a>

- *Type:* string

---

##### `metricSuccess` <a name="metricSuccess" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricSuccess"></a>

```typescript
public metricSuccess(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.metricSuccess.parameter.pool"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.isConstruct"></a>

```typescript
import { CleanupTimeout } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeout.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="@cdklabs/cdk-atmosphere-service.CleanupTimeout.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### CleanupTimeoutFunction <a name="CleanupTimeoutFunction" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction"></a>

An AWS Lambda function which executes src/cleanup-timeout/cleanup-timeout.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

new CleanupTimeoutFunction(scope: Construct, id: string, props?: CleanupTimeoutFunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps">CleanupTimeoutFunctionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps">CleanupTimeoutFunctionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSource">addEventSource</a></code> | Adds an event source to this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSourceMapping">addEventSourceMapping</a></code> | Adds an event source that maps to this AWS Lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addFunctionUrl">addFunctionUrl</a></code> | Adds a url to this lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addPermission">addPermission</a></code> | Adds a permission to the Lambda resource policy. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addToRolePolicy">addToRolePolicy</a></code> | Adds a statement to the IAM role assumed by the instance. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.configureAsyncInvoke">configureAsyncInvoke</a></code> | Configures options for asynchronous invocation. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.considerWarningOnInvokeFunctionPermissions">considerWarningOnInvokeFunctionPermissions</a></code> | A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvoke">grantInvoke</a></code> | Grant the given identity permissions to invoke this Lambda. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeCompositePrincipal">grantInvokeCompositePrincipal</a></code> | Grant multiple principals the ability to invoke this Lambda via CompositePrincipal. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeLatestVersion">grantInvokeLatestVersion</a></code> | Grant the given identity permissions to invoke the $LATEST version or unqualified version of this Lambda. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeUrl">grantInvokeUrl</a></code> | Grant the given identity permissions to invoke this Lambda Function URL. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeVersion">grantInvokeVersion</a></code> | Grant the given identity permissions to invoke the given version of this Lambda. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metric">metric</a></code> | Return the given named metric for this Function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricDuration">metricDuration</a></code> | How long execution of this Lambda takes. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricErrors">metricErrors</a></code> | How many invocations of this Lambda fail. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricInvocations">metricInvocations</a></code> | How often this Lambda is invoked. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricThrottles">metricThrottles</a></code> | How often this Lambda is throttled. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addAlias">addAlias</a></code> | Defines an alias for this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEnvironment">addEnvironment</a></code> | Adds an environment variable to this Lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addLayers">addLayers</a></code> | Adds one or more Lambda Layers to this Lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.invalidateVersionBasedOn">invalidateVersionBasedOn</a></code> | Mix additional information into the hash of the Version object. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addEventSource` <a name="addEventSource" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSource"></a>

```typescript
public addEventSource(source: IEventSource): void
```

Adds an event source to this function.

Event sources are implemented in the aws-cdk-lib/aws-lambda-event-sources module.

The following example adds an SQS Queue as an event source:
```
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
myFunction.addEventSource(new SqsEventSource(myQueue));
```

###### `source`<sup>Required</sup> <a name="source" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSource.parameter.source"></a>

- *Type:* aws-cdk-lib.aws_lambda.IEventSource

---

##### `addEventSourceMapping` <a name="addEventSourceMapping" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSourceMapping"></a>

```typescript
public addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping
```

Adds an event source that maps to this AWS Lambda function.

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSourceMapping.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEventSourceMapping.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventSourceMappingOptions

---

##### `addFunctionUrl` <a name="addFunctionUrl" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addFunctionUrl"></a>

```typescript
public addFunctionUrl(options?: FunctionUrlOptions): FunctionUrl
```

Adds a url to this lambda function.

###### `options`<sup>Optional</sup> <a name="options" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addFunctionUrl.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionUrlOptions

---

##### `addPermission` <a name="addPermission" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addPermission"></a>

```typescript
public addPermission(id: string, permission: Permission): void
```

Adds a permission to the Lambda resource policy.

> [Permission for details.](Permission for details.)

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addPermission.parameter.id"></a>

- *Type:* string

The id for the permission construct.

---

###### `permission`<sup>Required</sup> <a name="permission" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addPermission.parameter.permission"></a>

- *Type:* aws-cdk-lib.aws_lambda.Permission

The permission to grant to this Lambda function.

---

##### `addToRolePolicy` <a name="addToRolePolicy" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addToRolePolicy"></a>

```typescript
public addToRolePolicy(statement: PolicyStatement): void
```

Adds a statement to the IAM role assumed by the instance.

###### `statement`<sup>Required</sup> <a name="statement" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addToRolePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `configureAsyncInvoke` <a name="configureAsyncInvoke" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.configureAsyncInvoke"></a>

```typescript
public configureAsyncInvoke(options: EventInvokeConfigOptions): void
```

Configures options for asynchronous invocation.

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.configureAsyncInvoke.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventInvokeConfigOptions

---

##### `considerWarningOnInvokeFunctionPermissions` <a name="considerWarningOnInvokeFunctionPermissions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.considerWarningOnInvokeFunctionPermissions"></a>

```typescript
public considerWarningOnInvokeFunctionPermissions(scope: Construct, action: string): void
```

A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function.

function.currentVersion is invoked before or after the permission is created.

This applies only to permissions on Lambda functions, not versions or aliases.
This function is overridden as a noOp for QualifiedFunctionBase.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.considerWarningOnInvokeFunctionPermissions.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `action`<sup>Required</sup> <a name="action" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.considerWarningOnInvokeFunctionPermissions.parameter.action"></a>

- *Type:* string

---

##### `grantInvoke` <a name="grantInvoke" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeCompositePrincipal` <a name="grantInvokeCompositePrincipal" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeCompositePrincipal"></a>

```typescript
public grantInvokeCompositePrincipal(compositePrincipal: CompositePrincipal): Grant[]
```

Grant multiple principals the ability to invoke this Lambda via CompositePrincipal.

###### `compositePrincipal`<sup>Required</sup> <a name="compositePrincipal" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeCompositePrincipal.parameter.compositePrincipal"></a>

- *Type:* aws-cdk-lib.aws_iam.CompositePrincipal

---

##### `grantInvokeLatestVersion` <a name="grantInvokeLatestVersion" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeLatestVersion"></a>

```typescript
public grantInvokeLatestVersion(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke the $LATEST version or unqualified version of this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeLatestVersion.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeUrl` <a name="grantInvokeUrl" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeUrl"></a>

```typescript
public grantInvokeUrl(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda Function URL.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeUrl.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeVersion` <a name="grantInvokeVersion" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeVersion"></a>

```typescript
public grantInvokeVersion(grantee: IGrantable, version: IVersion): Grant
```

Grant the given identity permissions to invoke the given version of this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeVersion.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `version`<sup>Required</sup> <a name="version" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.grantInvokeVersion.parameter.version"></a>

- *Type:* aws-cdk-lib.aws_lambda.IVersion

---

##### `metric` <a name="metric" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Function.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricDuration` <a name="metricDuration" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricDuration"></a>

```typescript
public metricDuration(props?: MetricOptions): Metric
```

How long execution of this Lambda takes.

Average over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricErrors` <a name="metricErrors" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricErrors"></a>

```typescript
public metricErrors(props?: MetricOptions): Metric
```

How many invocations of this Lambda fail.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricInvocations` <a name="metricInvocations" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricInvocations"></a>

```typescript
public metricInvocations(props?: MetricOptions): Metric
```

How often this Lambda is invoked.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricThrottles` <a name="metricThrottles" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricThrottles"></a>

```typescript
public metricThrottles(props?: MetricOptions): Metric
```

How often this Lambda is throttled.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `addAlias` <a name="addAlias" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addAlias"></a>

```typescript
public addAlias(aliasName: string, options?: AliasOptions): Alias
```

Defines an alias for this function.

The alias will automatically be updated to point to the latest version of
the function as it is being updated during a deployment.

```ts
declare const fn: lambda.Function;

fn.addAlias('Live');

// Is equivalent to

new lambda.Alias(this, 'AliasLive', {
  aliasName: 'Live',
  version: fn.currentVersion,
});
```

###### `aliasName`<sup>Required</sup> <a name="aliasName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addAlias.parameter.aliasName"></a>

- *Type:* string

The name of the alias.

---

###### `options`<sup>Optional</sup> <a name="options" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addAlias.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.AliasOptions

Alias options.

---

##### `addEnvironment` <a name="addEnvironment" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEnvironment"></a>

```typescript
public addEnvironment(key: string, value: string, options?: EnvironmentOptions): Function
```

Adds an environment variable to this Lambda function.

If this is a ref to a Lambda function, this operation results in a no-op.

###### `key`<sup>Required</sup> <a name="key" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEnvironment.parameter.key"></a>

- *Type:* string

The environment variable key.

---

###### `value`<sup>Required</sup> <a name="value" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEnvironment.parameter.value"></a>

- *Type:* string

The environment variable's value.

---

###### `options`<sup>Optional</sup> <a name="options" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addEnvironment.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EnvironmentOptions

Environment variable options.

---

##### `addLayers` <a name="addLayers" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addLayers"></a>

```typescript
public addLayers(layers: ...ILayerVersion[]): void
```

Adds one or more Lambda Layers to this Lambda function.

###### `layers`<sup>Required</sup> <a name="layers" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.addLayers.parameter.layers"></a>

- *Type:* ...aws-cdk-lib.aws_lambda.ILayerVersion[]

the layers to be added.

---

##### `invalidateVersionBasedOn` <a name="invalidateVersionBasedOn" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.invalidateVersionBasedOn"></a>

```typescript
public invalidateVersionBasedOn(x: string): void
```

Mix additional information into the hash of the Version object.

The Lambda Function construct does its best to automatically create a new
Version when anything about the Function changes (its code, its layers,
any of the other properties).

However, you can sometimes source information from places that the CDK cannot
look into, like the deploy-time values of SSM parameters. In those cases,
the CDK would not force the creation of a new Version object when it actually
should.

This method can be used to invalidate the current Version object. Pass in
any string into this method, and make sure the string changes when you know
a new Version needs to be created.

This method may be called more than once.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.invalidateVersionBasedOn.parameter.x"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.classifyVersionProperty">classifyVersionProperty</a></code> | Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionArn">fromFunctionArn</a></code> | Import a lambda function into the CDK using its ARN. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionAttributes">fromFunctionAttributes</a></code> | Creates a Lambda function object which represents a function not defined within this stack. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionName">fromFunctionName</a></code> | Import a lambda function into the CDK using its name. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAll">metricAll</a></code> | Return the given named metric for this Lambda. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllConcurrentExecutions">metricAllConcurrentExecutions</a></code> | Metric for the number of concurrent executions across all Lambdas. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllDuration">metricAllDuration</a></code> | Metric for the Duration executing all Lambdas. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllErrors">metricAllErrors</a></code> | Metric for the number of Errors executing all Lambdas. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllInvocations">metricAllInvocations</a></code> | Metric for the number of invocations of all Lambdas. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllThrottles">metricAllThrottles</a></code> | Metric for the number of throttled invocations of all Lambdas. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllUnreservedConcurrentExecutions">metricAllUnreservedConcurrentExecutions</a></code> | Metric for the number of unreserved concurrent executions across all Lambdas. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isConstruct"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isOwnedResource"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isResource"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `classifyVersionProperty` <a name="classifyVersionProperty" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.classifyVersionProperty"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.classifyVersionProperty(propertyName: string, locked: boolean)
```

Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource.

See 'currentVersion' section in the module README for more details.

###### `propertyName`<sup>Required</sup> <a name="propertyName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.classifyVersionProperty.parameter.propertyName"></a>

- *Type:* string

The property to classify.

---

###### `locked`<sup>Required</sup> <a name="locked" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.classifyVersionProperty.parameter.locked"></a>

- *Type:* boolean

whether the property should be associated to the version or not.

---

##### `fromFunctionArn` <a name="fromFunctionArn" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionArn"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.fromFunctionArn(scope: Construct, id: string, functionArn: string)
```

Import a lambda function into the CDK using its ARN.

For `Function.addPermissions()` to work on this imported lambda, make sure that is
in the same account and region as the stack you are importing it into.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionArn.parameter.id"></a>

- *Type:* string

---

###### `functionArn`<sup>Required</sup> <a name="functionArn" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionArn.parameter.functionArn"></a>

- *Type:* string

---

##### `fromFunctionAttributes` <a name="fromFunctionAttributes" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionAttributes"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.fromFunctionAttributes(scope: Construct, id: string, attrs: FunctionAttributes)
```

Creates a Lambda function object which represents a function not defined within this stack.

For `Function.addPermissions()` to work on this imported lambda, set the sameEnvironment property to true
if this imported lambda is in the same account and region as the stack you are importing it into.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionAttributes.parameter.id"></a>

- *Type:* string

The name of the lambda construct.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionAttributes

the attributes of the function to import.

---

##### `fromFunctionName` <a name="fromFunctionName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionName"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.fromFunctionName(scope: Construct, id: string, functionName: string)
```

Import a lambda function into the CDK using its name.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionName.parameter.id"></a>

- *Type:* string

---

###### `functionName`<sup>Required</sup> <a name="functionName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.fromFunctionName.parameter.functionName"></a>

- *Type:* string

---

##### `metricAll` <a name="metricAll" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAll"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAll(metricName: string, props?: MetricOptions)
```

Return the given named metric for this Lambda.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAll.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAll.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllConcurrentExecutions` <a name="metricAllConcurrentExecutions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllConcurrentExecutions"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllDuration` <a name="metricAllDuration" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllDuration"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllDuration(props?: MetricOptions)
```

Metric for the Duration executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllErrors` <a name="metricAllErrors" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllErrors"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllErrors(props?: MetricOptions)
```

Metric for the number of Errors executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllInvocations` <a name="metricAllInvocations" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllInvocations"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllInvocations(props?: MetricOptions)
```

Metric for the number of invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllThrottles` <a name="metricAllThrottles" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllThrottles"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllThrottles(props?: MetricOptions)
```

Metric for the number of throttled invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllUnreservedConcurrentExecutions` <a name="metricAllUnreservedConcurrentExecutions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllUnreservedConcurrentExecutions"></a>

```typescript
import { CleanupTimeoutFunction } from '@cdklabs/cdk-atmosphere-service'

CleanupTimeoutFunction.metricAllUnreservedConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of unreserved concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.metricAllUnreservedConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64). |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | Access the Connections object. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.functionArn">functionArn</a></code> | <code>string</code> | ARN of this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.functionName">functionName</a></code> | <code>string</code> | Name of this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal this Lambda Function is running as. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.isBoundToVpc">isBoundToVpc</a></code> | <code>boolean</code> | Whether or not this Lambda function was bound to a VPC. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.latestVersion">latestVersion</a></code> | <code>aws-cdk-lib.aws_lambda.IVersion</code> | The `$LATEST` version of this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.permissionsNode">permissionsNode</a></code> | <code>constructs.Node</code> | The construct node where permissions are attached. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.resourceArnsForGrantInvoke">resourceArnsForGrantInvoke</a></code> | <code>string[]</code> | The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke(). |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Execution role associated with this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.currentVersion">currentVersion</a></code> | <code>aws-cdk-lib.aws_lambda.Version</code> | Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The LogGroup where the Lambda function's logs are made available. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | The runtime configured for this lambda. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The DLQ (as queue) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.deadLetterTopic">deadLetterTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The DLQ (as topic) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The timeout configured for this lambda. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `architecture`<sup>Required</sup> <a name="architecture" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).

---

##### `connections`<sup>Required</sup> <a name="connections" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

Access the Connections object.

Will fail if not a VPC-enabled Lambda Function

---

##### `functionArn`<sup>Required</sup> <a name="functionArn" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.functionArn"></a>

```typescript
public readonly functionArn: string;
```

- *Type:* string

ARN of this function.

---

##### `functionName`<sup>Required</sup> <a name="functionName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string

Name of this function.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal this Lambda Function is running as.

---

##### `isBoundToVpc`<sup>Required</sup> <a name="isBoundToVpc" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.isBoundToVpc"></a>

```typescript
public readonly isBoundToVpc: boolean;
```

- *Type:* boolean

Whether or not this Lambda function was bound to a VPC.

If this is is `false`, trying to access the `connections` object will fail.

---

##### `latestVersion`<sup>Required</sup> <a name="latestVersion" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.latestVersion"></a>

```typescript
public readonly latestVersion: IVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.IVersion

The `$LATEST` version of this function.

Note that this is reference to a non-specific AWS Lambda version, which
means the function this version refers to can return different results in
different invocations.

To obtain a reference to an explicit version which references the current
function configuration, use `lambdaFunction.currentVersion` instead.

---

##### `permissionsNode`<sup>Required</sup> <a name="permissionsNode" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.permissionsNode"></a>

```typescript
public readonly permissionsNode: Node;
```

- *Type:* constructs.Node

The construct node where permissions are attached.

---

##### `resourceArnsForGrantInvoke`<sup>Required</sup> <a name="resourceArnsForGrantInvoke" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.resourceArnsForGrantInvoke"></a>

```typescript
public readonly resourceArnsForGrantInvoke: string[];
```

- *Type:* string[]

The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke().

---

##### `role`<sup>Optional</sup> <a name="role" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

Execution role associated with this function.

---

##### `currentVersion`<sup>Required</sup> <a name="currentVersion" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.currentVersion"></a>

```typescript
public readonly currentVersion: Version;
```

- *Type:* aws-cdk-lib.aws_lambda.Version

Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes.

You can specify options for this version using the `currentVersionOptions`
prop when initializing the `lambda.Function`.

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

The LogGroup where the Lambda function's logs are made available.

If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
period (never expire, by default).

Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
to never expire even if it was configured with a different value.

---

##### `runtime`<sup>Required</sup> <a name="runtime" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.runtime"></a>

```typescript
public readonly runtime: Runtime;
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime

The runtime configured for this lambda.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The DLQ (as queue) associated with this Lambda Function (this is an optional attribute).

---

##### `deadLetterTopic`<sup>Optional</sup> <a name="deadLetterTopic" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.deadLetterTopic"></a>

```typescript
public readonly deadLetterTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The DLQ (as topic) associated with this Lambda Function (this is an optional attribute).

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunction.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

The timeout configured for this lambda.

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.grantQueryLogs">grantQueryLogs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.metricOutcome">metricOutcome</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate.metricStatusCode">metricStatusCode</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Deallocate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantQueryLogs` <a name="grantQueryLogs" id="@cdklabs/cdk-atmosphere-service.Deallocate.grantQueryLogs"></a>

```typescript
public grantQueryLogs(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.Deallocate.grantQueryLogs.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricOutcome` <a name="metricOutcome" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricOutcome"></a>

```typescript
public metricOutcome(pool: string, outcome: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricOutcome.parameter.pool"></a>

- *Type:* string

---

###### `outcome`<sup>Required</sup> <a name="outcome" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricOutcome.parameter.outcome"></a>

- *Type:* string

---

##### `metricStatusCode` <a name="metricStatusCode" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricStatusCode"></a>

```typescript
public metricStatusCode(pool: string, statusCode: number): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricStatusCode.parameter.pool"></a>

- *Type:* string

---

###### `statusCode`<sup>Required</sup> <a name="statusCode" id="@cdklabs/cdk-atmosphere-service.Deallocate.metricStatusCode.parameter.statusCode"></a>

- *Type:* number

---

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.property.allocationResource">allocationResource</a></code> | <code>aws-cdk-lib.aws_apigateway.Resource</code> | Allocation sub resource. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.property.allocationsResource">allocationsResource</a></code> | <code>aws-cdk-lib.aws_apigateway.Resource</code> | Allocations sub resource. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Endpoint.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | Api Gateway rest api. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Endpoint.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `allocationResource`<sup>Required</sup> <a name="allocationResource" id="@cdklabs/cdk-atmosphere-service.Endpoint.property.allocationResource"></a>

```typescript
public readonly allocationResource: Resource;
```

- *Type:* aws-cdk-lib.aws_apigateway.Resource

Allocation sub resource.

---

##### `allocationsResource`<sup>Required</sup> <a name="allocationsResource" id="@cdklabs/cdk-atmosphere-service.Endpoint.property.allocationsResource"></a>

```typescript
public readonly allocationsResource: Resource;
```

- *Type:* aws-cdk-lib.aws_apigateway.Resource

Allocations sub resource.

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

new Environments(scope: Construct, id: string, props: EnvironmentsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsProps">EnvironmentsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Environments.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsProps">EnvironmentsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.grantRead">grantRead</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite">grantReadWrite</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.metricCleaning">metricCleaning</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.metricDirty">metricDirty</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.metricFree">metricFree</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.metricInUse">metricInUse</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.metricRegistered">metricRegistered</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Environments.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantRead` <a name="grantRead" id="@cdklabs/cdk-atmosphere-service.Environments.grantRead"></a>

```typescript
public grantRead(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Environments.grantRead.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantReadWrite` <a name="grantReadWrite" id="@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite"></a>

```typescript
public grantReadWrite(identity: IGrantable): void
```

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-atmosphere-service.Environments.grantReadWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricCleaning` <a name="metricCleaning" id="@cdklabs/cdk-atmosphere-service.Environments.metricCleaning"></a>

```typescript
public metricCleaning(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environments.metricCleaning.parameter.pool"></a>

- *Type:* string

---

##### `metricDirty` <a name="metricDirty" id="@cdklabs/cdk-atmosphere-service.Environments.metricDirty"></a>

```typescript
public metricDirty(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environments.metricDirty.parameter.pool"></a>

- *Type:* string

---

##### `metricFree` <a name="metricFree" id="@cdklabs/cdk-atmosphere-service.Environments.metricFree"></a>

```typescript
public metricFree(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environments.metricFree.parameter.pool"></a>

- *Type:* string

---

##### `metricInUse` <a name="metricInUse" id="@cdklabs/cdk-atmosphere-service.Environments.metricInUse"></a>

```typescript
public metricInUse(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environments.metricInUse.parameter.pool"></a>

- *Type:* string

---

##### `metricRegistered` <a name="metricRegistered" id="@cdklabs/cdk-atmosphere-service.Environments.metricRegistered"></a>

```typescript
public metricRegistered(pool: string): Metric
```

###### `pool`<sup>Required</sup> <a name="pool" id="@cdklabs/cdk-atmosphere-service.Environments.metricRegistered.parameter.pool"></a>

- *Type:* string

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.property.monitor">monitor</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor">EnvironmentsMonitor</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Environments.property.table">table</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Environments.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `monitor`<sup>Required</sup> <a name="monitor" id="@cdklabs/cdk-atmosphere-service.Environments.property.monitor"></a>

```typescript
public readonly monitor: EnvironmentsMonitor;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor">EnvironmentsMonitor</a>

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/cdk-atmosphere-service.Environments.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---


### EnvironmentsMonitor <a name="EnvironmentsMonitor" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer"></a>

```typescript
import { EnvironmentsMonitor } from '@cdklabs/cdk-atmosphere-service'

new EnvironmentsMonitor(scope: Construct, id: string, props: EnvironmentsMonitorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps">EnvironmentsMonitorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps">EnvironmentsMonitorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.isConstruct"></a>

```typescript
import { EnvironmentsMonitor } from '@cdklabs/cdk-atmosphere-service'

EnvironmentsMonitor.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `period`<sup>Required</sup> <a name="period" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitor.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


### GlobalDashboard <a name="GlobalDashboard" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer"></a>

```typescript
import { GlobalDashboard } from '@cdklabs/cdk-atmosphere-service'

new GlobalDashboard(scope: Construct, id: string, props: GlobalDashboardProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps">GlobalDashboardProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps">GlobalDashboardProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.isConstruct"></a>

```typescript
import { GlobalDashboard } from '@cdklabs/cdk-atmosphere-service'

GlobalDashboard.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboard.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.GlobalDashboard.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### PoolsDashboard <a name="PoolsDashboard" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer"></a>

```typescript
import { PoolsDashboard } from '@cdklabs/cdk-atmosphere-service'

new PoolsDashboard(scope: Construct, id: string, props: PoolsDashboardProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps">PoolsDashboardProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps">PoolsDashboardProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.isConstruct"></a>

```typescript
import { PoolsDashboard } from '@cdklabs/cdk-atmosphere-service'

PoolsDashboard.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboard.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.PoolsDashboard.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### Scheduler <a name="Scheduler" id="@cdklabs/cdk-atmosphere-service.Scheduler"></a>

Scheduler layer.

#### Initializers <a name="Initializers" id="@cdklabs/cdk-atmosphere-service.Scheduler.Initializer"></a>

```typescript
import { Scheduler } from '@cdklabs/cdk-atmosphere-service'

new Scheduler(scope: Construct, id: string, props: SchedulerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.SchedulerProps">SchedulerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-atmosphere-service.Scheduler.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.SchedulerProps">SchedulerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.grantSchedule">grantSchedule</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.metricDlqSize">metricDlqSize</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-atmosphere-service.Scheduler.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantSchedule` <a name="grantSchedule" id="@cdklabs/cdk-atmosphere-service.Scheduler.grantSchedule"></a>

```typescript
public grantSchedule(grantee: IGrantable): void
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/cdk-atmosphere-service.Scheduler.grantSchedule.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metricDlqSize` <a name="metricDlqSize" id="@cdklabs/cdk-atmosphere-service.Scheduler.metricDlqSize"></a>

```typescript
public metricDlqSize(): MathExpression
```

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-atmosphere-service.Scheduler.isConstruct"></a>

```typescript
import { Scheduler } from '@cdklabs/cdk-atmosphere-service'

Scheduler.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-atmosphere-service.Scheduler.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.property.allocationTimeout">allocationTimeout</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout">AllocationTimeout</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.property.cleanupTimeout">cleanupTimeout</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout">CleanupTimeout</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.property.dlq">dlq</a></code> | <code>aws-cdk-lib.aws_sqs.Queue</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-atmosphere-service.Scheduler.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `allocationTimeout`<sup>Required</sup> <a name="allocationTimeout" id="@cdklabs/cdk-atmosphere-service.Scheduler.property.allocationTimeout"></a>

```typescript
public readonly allocationTimeout: AllocationTimeout;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeout">AllocationTimeout</a>

---

##### `cleanupTimeout`<sup>Required</sup> <a name="cleanupTimeout" id="@cdklabs/cdk-atmosphere-service.Scheduler.property.cleanupTimeout"></a>

```typescript
public readonly cleanupTimeout: CleanupTimeout;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeout">CleanupTimeout</a>

---

##### `dlq`<sup>Required</sup> <a name="dlq" id="@cdklabs/cdk-atmosphere-service.Scheduler.property.dlq"></a>

```typescript
public readonly dlq: Queue;
```

- *Type:* aws-cdk-lib.aws_sqs.Queue

---

##### `role`<sup>Required</sup> <a name="role" id="@cdklabs/cdk-atmosphere-service.Scheduler.property.role"></a>

```typescript
public readonly role: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocateProps.property.scheduler">scheduler</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a></code> | Scheduler. |

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

##### `scheduler`<sup>Required</sup> <a name="scheduler" id="@cdklabs/cdk-atmosphere-service.AllocateProps.property.scheduler"></a>

```typescript
public readonly scheduler: Scheduler;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a>

Scheduler.

---

### AllocationsMonitorProps <a name="AllocationsMonitorProps" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps.Initializer"></a>

```typescript
import { AllocationsMonitorProps } from '@cdklabs/cdk-atmosphere-service'

const allocationsMonitorProps: AllocationsMonitorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | *No description.* |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.AllocationsMonitorProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

---

### AllocationTimeoutProps <a name="AllocationTimeoutProps" id="@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps.Initializer"></a>

```typescript
import { AllocationTimeoutProps } from '@cdklabs/cdk-atmosphere-service'

const allocationTimeoutProps: AllocationTimeoutProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps.property.dlq">dlq</a></code> | <code>aws-cdk-lib.aws_sqs.Queue</code> | *No description.* |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

---

##### `dlq`<sup>Required</sup> <a name="dlq" id="@cdklabs/cdk-atmosphere-service.AllocationTimeoutProps.property.dlq"></a>

```typescript
public readonly dlq: Queue;
```

- *Type:* aws-cdk-lib.aws_sqs.Queue

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

### CleanupProps <a name="CleanupProps" id="@cdklabs/cdk-atmosphere-service.CleanupProps"></a>

Properties for `Cleanup`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.CleanupProps.Initializer"></a>

```typescript
import { CleanupProps } from '@cdklabs/cdk-atmosphere-service'

const cleanupProps: CleanupProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | Allocations storage. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupProps.property.configuration">configuration</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Service configuration. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Environments storage. |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.CleanupProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Allocations storage.

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@cdklabs/cdk-atmosphere-service.CleanupProps.property.configuration"></a>

```typescript
public readonly configuration: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

Service configuration.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.CleanupProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Environments storage.

---

### CleanupTimeoutFunctionProps <a name="CleanupTimeoutFunctionProps" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps"></a>

Props for CleanupTimeoutFunction.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.Initializer"></a>

```typescript
import { CleanupTimeoutFunctionProps } from '@cdklabs/cdk-atmosphere-service'

const cleanupTimeoutFunctionProps: CleanupTimeoutFunctionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.maxEventAge">maxEventAge</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum age of a request that Lambda sends to a function for processing. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.onFailure">onFailure</a></code> | <code>aws-cdk-lib.aws_lambda.IDestination</code> | The destination for failed invocations. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.onSuccess">onSuccess</a></code> | <code>aws-cdk-lib.aws_lambda.IDestination</code> | The destination for successful invocations. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.retryAttempts">retryAttempts</a></code> | <code>number</code> | The maximum number of times to retry when the function returns an error. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.adotInstrumentation">adotInstrumentation</a></code> | <code>aws-cdk-lib.aws_lambda.AdotInstrumentationConfig</code> | Specify the configuration of AWS Distro for OpenTelemetry (ADOT) instrumentation. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowAllIpv6Outbound">allowAllIpv6Outbound</a></code> | <code>boolean</code> | Whether to allow the Lambda to send all ipv6 network traffic. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowAllOutbound">allowAllOutbound</a></code> | <code>boolean</code> | Whether to allow the Lambda to send all network traffic (except ipv6). |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowPublicSubnet">allowPublicSubnet</a></code> | <code>boolean</code> | Lambda Functions in a public subnet can NOT access the internet. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.applicationLogLevel">applicationLogLevel</a></code> | <code>string</code> | Sets the application log level for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.applicationLogLevelV2">applicationLogLevelV2</a></code> | <code>aws-cdk-lib.aws_lambda.ApplicationLogLevel</code> | Sets the application log level for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The system architectures compatible with this lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.codeSigningConfig">codeSigningConfig</a></code> | <code>aws-cdk-lib.aws_lambda.ICodeSigningConfig</code> | Code signing config associated with this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.currentVersionOptions">currentVersionOptions</a></code> | <code>aws-cdk-lib.aws_lambda.VersionOptions</code> | Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue to use if DLQ is enabled. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterQueueEnabled">deadLetterQueueEnabled</a></code> | <code>boolean</code> | Enabled DLQ. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterTopic">deadLetterTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic to use as a DLQ. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.description">description</a></code> | <code>string</code> | A description of the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.environment">environment</a></code> | <code>{[ key: string ]: string}</code> | Key-value pairs that Lambda caches and makes available for your Lambda functions. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.environmentEncryption">environmentEncryption</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The AWS KMS key that's used to encrypt your function's environment variables. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.ephemeralStorageSize">ephemeralStorageSize</a></code> | <code>aws-cdk-lib.Size</code> | The size of the function’s /tmp directory in MiB. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.events">events</a></code> | <code>aws-cdk-lib.aws_lambda.IEventSource[]</code> | Event sources for this function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.filesystem">filesystem</a></code> | <code>aws-cdk-lib.aws_lambda.FileSystem</code> | The filesystem configuration for the lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.functionName">functionName</a></code> | <code>string</code> | A name for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.initialPolicy">initialPolicy</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | Initial policy statements to add to the created Lambda Role. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.insightsVersion">insightsVersion</a></code> | <code>aws-cdk-lib.aws_lambda.LambdaInsightsVersion</code> | Specify the version of CloudWatch Lambda insights to use for monitoring. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.ipv6AllowedForDualStack">ipv6AllowedForDualStack</a></code> | <code>boolean</code> | Allows outbound IPv6 traffic on VPC functions that are connected to dual-stack subnets. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.layers">layers</a></code> | <code>aws-cdk-lib.aws_lambda.ILayerVersion[]</code> | A list of layers to add to the function's execution environment. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logFormat">logFormat</a></code> | <code>string</code> | Sets the logFormat for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.loggingFormat">loggingFormat</a></code> | <code>aws-cdk-lib.aws_lambda.LoggingFormat</code> | Sets the loggingFormat for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The log group the function sends logs to. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetention">logRetention</a></code> | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | The number of days log events are kept in CloudWatch Logs. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetentionRetryOptions">logRetentionRetryOptions</a></code> | <code>aws-cdk-lib.aws_lambda.LogRetentionRetryOptions</code> | When log retention is specified, a custom resource attempts to create the CloudWatch log group. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetentionRole">logRetentionRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The IAM role for the Lambda function associated with the custom resource that sets the retention policy. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.memorySize">memorySize</a></code> | <code>number</code> | The amount of memory, in MB, that is allocated to your Lambda function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.paramsAndSecrets">paramsAndSecrets</a></code> | <code>aws-cdk-lib.aws_lambda.ParamsAndSecretsLayerVersion</code> | Specify the configuration of Parameters and Secrets Extension. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.profiling">profiling</a></code> | <code>boolean</code> | Enable profiling. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.profilingGroup">profilingGroup</a></code> | <code>aws-cdk-lib.aws_codeguruprofiler.IProfilingGroup</code> | Profiling Group. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.recursiveLoop">recursiveLoop</a></code> | <code>aws-cdk-lib.aws_lambda.RecursiveLoop</code> | Sets the Recursive Loop Protection for Lambda Function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.reservedConcurrentExecutions">reservedConcurrentExecutions</a></code> | <code>number</code> | The maximum of concurrent executions you want to reserve for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Lambda execution role. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.runtimeManagementMode">runtimeManagementMode</a></code> | <code>aws-cdk-lib.aws_lambda.RuntimeManagementMode</code> | Sets the runtime management configuration for a function's version. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | The list of security groups to associate with the Lambda's network interfaces. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.snapStart">snapStart</a></code> | <code>aws-cdk-lib.aws_lambda.SnapStartConf</code> | Enable SnapStart for Lambda Function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.systemLogLevel">systemLogLevel</a></code> | <code>string</code> | Sets the system log level for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.systemLogLevelV2">systemLogLevelV2</a></code> | <code>aws-cdk-lib.aws_lambda.SystemLogLevel</code> | Sets the system log level for the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The function execution time (in seconds) after which Lambda terminates the function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.tracing">tracing</a></code> | <code>aws-cdk-lib.aws_lambda.Tracing</code> | Enable AWS X-Ray Tracing for Lambda Function. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC network to place Lambda network interfaces. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Where to place the network interfaces within the VPC. |

---

##### `maxEventAge`<sup>Optional</sup> <a name="maxEventAge" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.maxEventAge"></a>

```typescript
public readonly maxEventAge: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.hours(6)

The maximum age of a request that Lambda sends to a function for processing.

Minimum: 60 seconds
Maximum: 6 hours

---

##### `onFailure`<sup>Optional</sup> <a name="onFailure" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.onFailure"></a>

```typescript
public readonly onFailure: IDestination;
```

- *Type:* aws-cdk-lib.aws_lambda.IDestination
- *Default:* no destination

The destination for failed invocations.

---

##### `onSuccess`<sup>Optional</sup> <a name="onSuccess" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.onSuccess"></a>

```typescript
public readonly onSuccess: IDestination;
```

- *Type:* aws-cdk-lib.aws_lambda.IDestination
- *Default:* no destination

The destination for successful invocations.

---

##### `retryAttempts`<sup>Optional</sup> <a name="retryAttempts" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.retryAttempts"></a>

```typescript
public readonly retryAttempts: number;
```

- *Type:* number
- *Default:* 2

The maximum number of times to retry when the function returns an error.

Minimum: 0
Maximum: 2

---

##### `adotInstrumentation`<sup>Optional</sup> <a name="adotInstrumentation" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.adotInstrumentation"></a>

```typescript
public readonly adotInstrumentation: AdotInstrumentationConfig;
```

- *Type:* aws-cdk-lib.aws_lambda.AdotInstrumentationConfig
- *Default:* No ADOT instrumentation

Specify the configuration of AWS Distro for OpenTelemetry (ADOT) instrumentation.

> [https://aws-otel.github.io/docs/getting-started/lambda](https://aws-otel.github.io/docs/getting-started/lambda)

---

##### `allowAllIpv6Outbound`<sup>Optional</sup> <a name="allowAllIpv6Outbound" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowAllIpv6Outbound"></a>

```typescript
public readonly allowAllIpv6Outbound: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to allow the Lambda to send all ipv6 network traffic.

If set to true, there will only be a single egress rule which allows all
outbound ipv6 traffic. If set to false, you must individually add traffic rules to allow the
Lambda to connect to network targets using ipv6.

Do not specify this property if the `securityGroups` or `securityGroup` property is set.
Instead, configure `allowAllIpv6Outbound` directly on the security group.

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="allowAllOutbound" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to allow the Lambda to send all network traffic (except ipv6).

If set to false, you must individually add traffic rules to allow the
Lambda to connect to network targets.

Do not specify this property if the `securityGroups` or `securityGroup` property is set.
Instead, configure `allowAllOutbound` directly on the security group.

---

##### `allowPublicSubnet`<sup>Optional</sup> <a name="allowPublicSubnet" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.allowPublicSubnet"></a>

```typescript
public readonly allowPublicSubnet: boolean;
```

- *Type:* boolean
- *Default:* false

Lambda Functions in a public subnet can NOT access the internet.

Use this property to acknowledge this limitation and still place the function in a public subnet.

> [https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841](https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841)

---

##### ~~`applicationLogLevel`~~<sup>Optional</sup> <a name="applicationLogLevel" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.applicationLogLevel"></a>

- *Deprecated:* Use `applicationLogLevelV2` as a property instead.

```typescript
public readonly applicationLogLevel: string;
```

- *Type:* string
- *Default:* "INFO"

Sets the application log level for the function.

---

##### `applicationLogLevelV2`<sup>Optional</sup> <a name="applicationLogLevelV2" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.applicationLogLevelV2"></a>

```typescript
public readonly applicationLogLevelV2: ApplicationLogLevel;
```

- *Type:* aws-cdk-lib.aws_lambda.ApplicationLogLevel
- *Default:* ApplicationLogLevel.INFO

Sets the application log level for the function.

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture
- *Default:* Architecture.X86_64

The system architectures compatible with this lambda function.

---

##### `codeSigningConfig`<sup>Optional</sup> <a name="codeSigningConfig" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.codeSigningConfig"></a>

```typescript
public readonly codeSigningConfig: ICodeSigningConfig;
```

- *Type:* aws-cdk-lib.aws_lambda.ICodeSigningConfig
- *Default:* Not Sign the Code

Code signing config associated with this function.

---

##### `currentVersionOptions`<sup>Optional</sup> <a name="currentVersionOptions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.currentVersionOptions"></a>

```typescript
public readonly currentVersionOptions: VersionOptions;
```

- *Type:* aws-cdk-lib.aws_lambda.VersionOptions
- *Default:* default options as described in `VersionOptions`

Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue
- *Default:* SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`

The SQS queue to use if DLQ is enabled.

If SNS topic is desired, specify `deadLetterTopic` property instead.

---

##### `deadLetterQueueEnabled`<sup>Optional</sup> <a name="deadLetterQueueEnabled" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterQueueEnabled"></a>

```typescript
public readonly deadLetterQueueEnabled: boolean;
```

- *Type:* boolean
- *Default:* false unless `deadLetterQueue` is set, which implies DLQ is enabled.

Enabled DLQ.

If `deadLetterQueue` is undefined,
an SQS queue with default options will be defined for your Function.

---

##### `deadLetterTopic`<sup>Optional</sup> <a name="deadLetterTopic" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.deadLetterTopic"></a>

```typescript
public readonly deadLetterTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic
- *Default:* no SNS topic

The SNS topic to use as a DLQ.

Note that if `deadLetterQueueEnabled` is set to `true`, an SQS queue will be created
rather than an SNS topic. Using an SNS topic as a DLQ requires this property to be set explicitly.

---

##### `description`<sup>Optional</sup> <a name="description" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the function.

---

##### `environment`<sup>Optional</sup> <a name="environment" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.environment"></a>

```typescript
public readonly environment: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* No environment variables.

Key-value pairs that Lambda caches and makes available for your Lambda functions.

Use environment variables to apply configuration changes, such
as test and production environment configurations, without changing your
Lambda function source code.

---

##### `environmentEncryption`<sup>Optional</sup> <a name="environmentEncryption" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.environmentEncryption"></a>

```typescript
public readonly environmentEncryption: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey
- *Default:* AWS Lambda creates and uses an AWS managed customer master key (CMK).

The AWS KMS key that's used to encrypt your function's environment variables.

---

##### `ephemeralStorageSize`<sup>Optional</sup> <a name="ephemeralStorageSize" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.ephemeralStorageSize"></a>

```typescript
public readonly ephemeralStorageSize: Size;
```

- *Type:* aws-cdk-lib.Size
- *Default:* 512 MiB

The size of the function’s /tmp directory in MiB.

---

##### `events`<sup>Optional</sup> <a name="events" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.events"></a>

```typescript
public readonly events: IEventSource[];
```

- *Type:* aws-cdk-lib.aws_lambda.IEventSource[]
- *Default:* No event sources.

Event sources for this function.

You can also add event sources using `addEventSource`.

---

##### `filesystem`<sup>Optional</sup> <a name="filesystem" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.filesystem"></a>

```typescript
public readonly filesystem: FileSystem;
```

- *Type:* aws-cdk-lib.aws_lambda.FileSystem
- *Default:* will not mount any filesystem

The filesystem configuration for the lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="functionName" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string
- *Default:* AWS CloudFormation generates a unique physical ID and uses that ID for the function's name. For more information, see Name Type.

A name for the function.

---

##### `initialPolicy`<sup>Optional</sup> <a name="initialPolicy" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.initialPolicy"></a>

```typescript
public readonly initialPolicy: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]
- *Default:* No policy statements are added to the created Lambda role.

Initial policy statements to add to the created Lambda Role.

You can call `addToRolePolicy` to the created lambda to add statements post creation.

---

##### `insightsVersion`<sup>Optional</sup> <a name="insightsVersion" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.insightsVersion"></a>

```typescript
public readonly insightsVersion: LambdaInsightsVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LambdaInsightsVersion
- *Default:* No Lambda Insights

Specify the version of CloudWatch Lambda insights to use for monitoring.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html)

---

##### `ipv6AllowedForDualStack`<sup>Optional</sup> <a name="ipv6AllowedForDualStack" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.ipv6AllowedForDualStack"></a>

```typescript
public readonly ipv6AllowedForDualStack: boolean;
```

- *Type:* boolean
- *Default:* false

Allows outbound IPv6 traffic on VPC functions that are connected to dual-stack subnets.

Only used if 'vpc' is supplied.

---

##### `layers`<sup>Optional</sup> <a name="layers" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* aws-cdk-lib.aws_lambda.ILayerVersion[]
- *Default:* No layers.

A list of layers to add to the function's execution environment.

You can configure your Lambda function to pull in
additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
that can be used by multiple functions.

---

##### ~~`logFormat`~~<sup>Optional</sup> <a name="logFormat" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logFormat"></a>

- *Deprecated:* Use `loggingFormat` as a property instead.

```typescript
public readonly logFormat: string;
```

- *Type:* string
- *Default:* "Text"

Sets the logFormat for the function.

---

##### `loggingFormat`<sup>Optional</sup> <a name="loggingFormat" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.loggingFormat"></a>

```typescript
public readonly loggingFormat: LoggingFormat;
```

- *Type:* aws-cdk-lib.aws_lambda.LoggingFormat
- *Default:* LoggingFormat.TEXT

Sets the loggingFormat for the function.

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup
- *Default:* `/aws/lambda/${this.functionName}` - default log group created by Lambda

The log group the function sends logs to.

By default, Lambda functions send logs to an automatically created default log group named /aws/lambda/\<function name\>.
However you cannot change the properties of this auto-created log group using the AWS CDK, e.g. you cannot set a different log retention.

Use the `logGroup` property to create a fully customizable LogGroup ahead of time, and instruct the Lambda function to send logs to it.

Providing a user-controlled log group was rolled out to commercial regions on 2023-11-16.
If you are deploying to another type of region, please check regional availability first.

---

##### `logRetention`<sup>Optional</sup> <a name="logRetention" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetention"></a>

```typescript
public readonly logRetention: RetentionDays;
```

- *Type:* aws-cdk-lib.aws_logs.RetentionDays
- *Default:* logs.RetentionDays.INFINITE

The number of days log events are kept in CloudWatch Logs.

When updating
this property, unsetting it doesn't remove the log retention policy. To
remove the retention policy, set the value to `INFINITE`.

This is a legacy API and we strongly recommend you move away from it if you can.
Instead create a fully customizable log group with `logs.LogGroup` and use the `logGroup` property
to instruct the Lambda function to send logs to it.
Migrating from `logRetention` to `logGroup` will cause the name of the log group to change.
Users and code and referencing the name verbatim will have to adjust.

In AWS CDK code, you can access the log group name directly from the LogGroup construct:
```ts
import * as logs from 'aws-cdk-lib/aws-logs';

declare const myLogGroup: logs.LogGroup;
myLogGroup.logGroupName;
```

---

##### `logRetentionRetryOptions`<sup>Optional</sup> <a name="logRetentionRetryOptions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetentionRetryOptions"></a>

```typescript
public readonly logRetentionRetryOptions: LogRetentionRetryOptions;
```

- *Type:* aws-cdk-lib.aws_lambda.LogRetentionRetryOptions
- *Default:* Default AWS SDK retry options.

When log retention is specified, a custom resource attempts to create the CloudWatch log group.

These options control the retry policy when interacting with CloudWatch APIs.

This is a legacy API and we strongly recommend you migrate to `logGroup` if you can.
`logGroup` allows you to create a fully customizable log group and instruct the Lambda function to send logs to it.

---

##### `logRetentionRole`<sup>Optional</sup> <a name="logRetentionRole" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.logRetentionRole"></a>

```typescript
public readonly logRetentionRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A new role is created.

The IAM role for the Lambda function associated with the custom resource that sets the retention policy.

This is a legacy API and we strongly recommend you migrate to `logGroup` if you can.
`logGroup` allows you to create a fully customizable log group and instruct the Lambda function to send logs to it.

---

##### `memorySize`<sup>Optional</sup> <a name="memorySize" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number
- *Default:* 128

The amount of memory, in MB, that is allocated to your Lambda function.

Lambda uses this value to proportionally allocate the amount of CPU
power. For more information, see Resource Model in the AWS Lambda
Developer Guide.

---

##### `paramsAndSecrets`<sup>Optional</sup> <a name="paramsAndSecrets" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.paramsAndSecrets"></a>

```typescript
public readonly paramsAndSecrets: ParamsAndSecretsLayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.ParamsAndSecretsLayerVersion
- *Default:* No Parameters and Secrets Extension

Specify the configuration of Parameters and Secrets Extension.

> [https://docs.aws.amazon.com/systems-manager/latest/userguide/ps-integration-lambda-extensions.html](https://docs.aws.amazon.com/systems-manager/latest/userguide/ps-integration-lambda-extensions.html)

---

##### `profiling`<sup>Optional</sup> <a name="profiling" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.profiling"></a>

```typescript
public readonly profiling: boolean;
```

- *Type:* boolean
- *Default:* No profiling.

Enable profiling.

> [https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html)

---

##### `profilingGroup`<sup>Optional</sup> <a name="profilingGroup" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.profilingGroup"></a>

```typescript
public readonly profilingGroup: IProfilingGroup;
```

- *Type:* aws-cdk-lib.aws_codeguruprofiler.IProfilingGroup
- *Default:* A new profiling group will be created if `profiling` is set.

Profiling Group.

> [https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html)

---

##### `recursiveLoop`<sup>Optional</sup> <a name="recursiveLoop" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.recursiveLoop"></a>

```typescript
public readonly recursiveLoop: RecursiveLoop;
```

- *Type:* aws-cdk-lib.aws_lambda.RecursiveLoop
- *Default:* RecursiveLoop.Terminate

Sets the Recursive Loop Protection for Lambda Function.

It lets Lambda detect and terminate unintended recursive loops.

---

##### `reservedConcurrentExecutions`<sup>Optional</sup> <a name="reservedConcurrentExecutions" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.reservedConcurrentExecutions"></a>

```typescript
public readonly reservedConcurrentExecutions: number;
```

- *Type:* number
- *Default:* No specific limit - account limit.

The maximum of concurrent executions you want to reserve for the function.

> [https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html](https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html)

---

##### `role`<sup>Optional</sup> <a name="role" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A unique role will be generated for this lambda function. Both supplied and generated roles can always be changed by calling `addToRolePolicy`.

Lambda execution role.

This is the role that will be assumed by the function upon execution.
It controls the permissions that the function will have. The Role must
be assumable by the 'lambda.amazonaws.com' service principal.

The default Role automatically has permissions granted for Lambda execution. If you
provide a Role, you must add the relevant AWS managed policies yourself.

The relevant managed policies are "service-role/AWSLambdaBasicExecutionRole" and
"service-role/AWSLambdaVPCAccessExecutionRole".

---

##### `runtimeManagementMode`<sup>Optional</sup> <a name="runtimeManagementMode" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.runtimeManagementMode"></a>

```typescript
public readonly runtimeManagementMode: RuntimeManagementMode;
```

- *Type:* aws-cdk-lib.aws_lambda.RuntimeManagementMode
- *Default:* Auto

Sets the runtime management configuration for a function's version.

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]
- *Default:* If the function is placed within a VPC and a security group is not specified, either by this or securityGroup prop, a dedicated security group will be created for this function.

The list of security groups to associate with the Lambda's network interfaces.

Only used if 'vpc' is supplied.

---

##### `snapStart`<sup>Optional</sup> <a name="snapStart" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.snapStart"></a>

```typescript
public readonly snapStart: SnapStartConf;
```

- *Type:* aws-cdk-lib.aws_lambda.SnapStartConf
- *Default:* No snapstart

Enable SnapStart for Lambda Function.

SnapStart is currently supported for Java 11, Java 17, Python 3.12, Python 3.13, and .NET 8 runtime

---

##### ~~`systemLogLevel`~~<sup>Optional</sup> <a name="systemLogLevel" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.systemLogLevel"></a>

- *Deprecated:* Use `systemLogLevelV2` as a property instead.

```typescript
public readonly systemLogLevel: string;
```

- *Type:* string
- *Default:* "INFO"

Sets the system log level for the function.

---

##### `systemLogLevelV2`<sup>Optional</sup> <a name="systemLogLevelV2" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.systemLogLevelV2"></a>

```typescript
public readonly systemLogLevelV2: SystemLogLevel;
```

- *Type:* aws-cdk-lib.aws_lambda.SystemLogLevel
- *Default:* SystemLogLevel.INFO

Sets the system log level for the function.

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.seconds(3)

The function execution time (in seconds) after which Lambda terminates the function.

Because the execution time affects cost, set this value
based on the function's expected execution time.

---

##### `tracing`<sup>Optional</sup> <a name="tracing" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.tracing"></a>

```typescript
public readonly tracing: Tracing;
```

- *Type:* aws-cdk-lib.aws_lambda.Tracing
- *Default:* Tracing.Disabled

Enable AWS X-Ray Tracing for Lambda Function.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc
- *Default:* Function is not placed within a VPC.

VPC network to place Lambda network interfaces.

Specify this if the Lambda function needs to access resources in a VPC.
This is required when `vpcSubnets` is specified.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* the Vpc default strategy if not specified

Where to place the network interfaces within the VPC.

This requires `vpc` to be specified in order for interfaces to actually be
placed in the subnets. If `vpc` is not specify, this will raise an error.

Note: Internet access for Lambda Functions requires a NAT Gateway, so picking
public subnets is not allowed (unless `allowPublicSubnet` is set to `true`).

---

### CleanupTimeoutProps <a name="CleanupTimeoutProps" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.Initializer"></a>

```typescript
import { CleanupTimeoutProps } from '@cdklabs/cdk-atmosphere-service'

const cleanupTimeoutProps: CleanupTimeoutProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.dlq">dlq</a></code> | <code>aws-cdk-lib.aws_sqs.Queue</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | *No description.* |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

---

##### `dlq`<sup>Required</sup> <a name="dlq" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.dlq"></a>

```typescript
public readonly dlq: Queue;
```

- *Type:* aws-cdk-lib.aws_sqs.Queue

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.CleanupTimeoutProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

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
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.cleanup">cleanup</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a></code> | Cleanup. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.configuration">configuration</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | Configuration. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Environments storage. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.DeallocateProps.property.scheduler">scheduler</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a></code> | Scheduler. |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Allocations storage.

---

##### `cleanup`<sup>Required</sup> <a name="cleanup" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.cleanup"></a>

```typescript
public readonly cleanup: Cleanup;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a>

Cleanup.

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.configuration"></a>

```typescript
public readonly configuration: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

Configuration.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Environments storage.

---

##### `scheduler`<sup>Required</sup> <a name="scheduler" id="@cdklabs/cdk-atmosphere-service.DeallocateProps.property.scheduler"></a>

```typescript
public readonly scheduler: Scheduler;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a>

Scheduler.

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

### EnvironmentsMonitorProps <a name="EnvironmentsMonitorProps" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps.Initializer"></a>

```typescript
import { EnvironmentsMonitorProps } from '@cdklabs/cdk-atmosphere-service'

const environmentsMonitorProps: EnvironmentsMonitorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps.property.configuration">configuration</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | *No description.* |

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps.property.configuration"></a>

```typescript
public readonly configuration: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.EnvironmentsMonitorProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

---

### EnvironmentsProps <a name="EnvironmentsProps" id="@cdklabs/cdk-atmosphere-service.EnvironmentsProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.EnvironmentsProps.Initializer"></a>

```typescript
import { EnvironmentsProps } from '@cdklabs/cdk-atmosphere-service'

const environmentsProps: EnvironmentsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.EnvironmentsProps.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | *No description.* |

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.EnvironmentsProps.property.config"></a>

```typescript
public readonly config: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

---

### GlobalDashboardProps <a name="GlobalDashboardProps" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.Initializer"></a>

```typescript
import { GlobalDashboardProps } from '@cdklabs/cdk-atmosphere-service'

const globalDashboardProps: GlobalDashboardProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.allocate">allocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.cleanup">cleanup</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.deallocate">deallocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.scheduler">scheduler</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a></code> | *No description.* |

---

##### `allocate`<sup>Required</sup> <a name="allocate" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.allocate"></a>

```typescript
public readonly allocate: Allocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a>

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

---

##### `cleanup`<sup>Required</sup> <a name="cleanup" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.cleanup"></a>

```typescript
public readonly cleanup: Cleanup;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a>

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.config"></a>

```typescript
public readonly config: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

---

##### `deallocate`<sup>Required</sup> <a name="deallocate" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.deallocate"></a>

```typescript
public readonly deallocate: Deallocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a>

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

---

##### `scheduler`<sup>Required</sup> <a name="scheduler" id="@cdklabs/cdk-atmosphere-service.GlobalDashboardProps.property.scheduler"></a>

```typescript
public readonly scheduler: Scheduler;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a>

---

### PoolsDashboardProps <a name="PoolsDashboardProps" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.Initializer"></a>

```typescript
import { PoolsDashboardProps } from '@cdklabs/cdk-atmosphere-service'

const poolsDashboardProps: PoolsDashboardProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.allocate">allocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.cleanup">cleanup</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.config">config</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.deallocate">deallocate</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.scheduler">scheduler</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a></code> | *No description.* |

---

##### `allocate`<sup>Required</sup> <a name="allocate" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.allocate"></a>

```typescript
public readonly allocate: Allocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocate">Allocate</a>

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

---

##### `cleanup`<sup>Required</sup> <a name="cleanup" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.cleanup"></a>

```typescript
public readonly cleanup: Cleanup;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Cleanup">Cleanup</a>

---

##### `config`<sup>Required</sup> <a name="config" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.config"></a>

```typescript
public readonly config: Configuration;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Configuration">Configuration</a>

---

##### `deallocate`<sup>Required</sup> <a name="deallocate" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.deallocate"></a>

```typescript
public readonly deallocate: Deallocate;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Deallocate">Deallocate</a>

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

---

##### `scheduler`<sup>Required</sup> <a name="scheduler" id="@cdklabs/cdk-atmosphere-service.PoolsDashboardProps.property.scheduler"></a>

```typescript
public readonly scheduler: Scheduler;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Scheduler">Scheduler</a>

---

### SchedulerProps <a name="SchedulerProps" id="@cdklabs/cdk-atmosphere-service.SchedulerProps"></a>

Properties for `Scheduler`.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-atmosphere-service.SchedulerProps.Initializer"></a>

```typescript
import { SchedulerProps } from '@cdklabs/cdk-atmosphere-service'

const schedulerProps: SchedulerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-atmosphere-service.SchedulerProps.property.allocations">allocations</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a></code> | Allocations storage. |
| <code><a href="#@cdklabs/cdk-atmosphere-service.SchedulerProps.property.environments">environments</a></code> | <code><a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a></code> | Environments storage. |

---

##### `allocations`<sup>Required</sup> <a name="allocations" id="@cdklabs/cdk-atmosphere-service.SchedulerProps.property.allocations"></a>

```typescript
public readonly allocations: Allocations;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Allocations">Allocations</a>

Allocations storage.

---

##### `environments`<sup>Required</sup> <a name="environments" id="@cdklabs/cdk-atmosphere-service.SchedulerProps.property.environments"></a>

```typescript
public readonly environments: Environments;
```

- *Type:* <a href="#@cdklabs/cdk-atmosphere-service.Environments">Environments</a>

Environments storage.

---



