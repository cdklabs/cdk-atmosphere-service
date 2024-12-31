import * as fs from 'fs';
import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct, IConstruct } from 'constructs';
import { SUCCESS_PAYLOAD } from './service.session';
import { ASSERT_HANDLER_FILE } from '../../projenrc/integ-tests';
import { AtmosphereService } from '../../src';
import * as envars from '../../src/envars';

/**
 * Properties for `IntegTestAtmosphereService`. Its a scoped down
 * version of the actual properties.
 */
export interface IntegTestAtmosphereServiceProps {
  /**
   * A map of regions for each pool. These will translate to the available environment pools.
   * Note that the account will always be the current account (because otherwise the test isn't portable)
   */
  readonly pools: Record<string, string[]>;

  /**
   * Directory of the test, relative to the 'integ' directory.
   * It must contain a file named `assert.lambda.ts`.
   */
  readonly dir: string;
}

/**
 * Integration test for the service.
 */
export class AtmosphereIntegTest extends Construct {

  public readonly integ: IntegTest;

  constructor(scope: Construct, id: string, props: IntegTestAtmosphereServiceProps) {
    super(scope, id);

    const adminRole = new iam.Role(scope, 'Admin', {
      assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
    });

    const environments = Object.entries(props.pools).flatMap(([pool, regions]) =>
      regions.map(region => ({ account: cdk.Aws.ACCOUNT_ID, region, adminRoleArn: adminRole.roleArn, pool })),
    );

    const service = new AtmosphereService(this, 'Atmosphere', {
      config: { environments },
    });

    const assertionPath = path.join(__dirname, props.dir, ASSERT_HANDLER_FILE);
    const bundlePath = path.join(__dirname, `../../assets/test/integ/${props.dir}/index.js`);

    if (!fs.existsSync(assertionPath)) {
      throw new Error(`Assertion handler not found: ${assertionPath}. Please make sure to name it '${ASSERT_HANDLER_FILE}'.`);
    }

    if (!fs.existsSync(bundlePath)) {
      throw new Error(`Bundle not found: ${bundlePath}. Add your test to .projenrc.ts so that a bundle will be created during build.`);
    }

    const assert = new lambda.Function(this, 'Assert', {
      description: `test/integ/${props.dir}/assert.lambda.ts`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      timeout: Duration.minutes(1),
      code: lambda.Code.fromAsset(path.dirname(bundlePath)),
    });
    assert.addEnvironment('CDK_ATMOSPHERE_INTEG', 'true');

    assert.node.addDependency(service);

    const envVariables: envars.EnvironmentVariables = {
      [envars.ENVIRONMENTS_TABLE_NAME_ENV]: service.environments.table.tableName,
      [envars.ALLOCATIONS_TABLE_NAME_ENV]: service.allocations.table.tableName,
      [envars.CONFIGURATION_BUCKET_ENV]: service.config.bucket.bucketName,
      [envars.CONFIGURATION_KEY_ENV]: service.config.key,
      [envars.REST_API_ID_ENV]: service.endpoint.api.restApiId,
      [envars.ALLOCATIONS_RESOURCE_ID_ENV]: service.endpoint.allocationsResource.resourceId,
      [envars.ALLOCATION_RESOURCE_ID_ENV]: service.endpoint.allocationResource.resourceId,
    };

    for (const [key, value] of Object.entries(envVariables)) {
      // for running deployed assertions
      assert.addEnvironment(key, value);

      // for running local assertions
      new cdk.CfnOutput(assert, key, { value, key: key.replace(/_/g, '0') });
    }

    // give the assert function the necessary permissions
    assert.addToRolePolicy(iam.PolicyStatement.fromJson({
      Effect: 'Allow',
      Action: 'apigateway:*',
      Resource: ['*'],
    }));
    assert.addToRolePolicy(iam.PolicyStatement.fromJson({
      Effect: 'Allow',
      Action: 'dynamodb:*',
      Resource: ['*'],
    }));

    cdk.Aspects.of(cdk.Stack.of(this)).add(new DestroyAspect());

    this.integ = new IntegTest(cdk.App.of(this)!, 'IntegTest', {
      testCases: [cdk.Stack.of(this)],
      assertionStack: new cdk.Stack(cdk.App.of(this), `${cdk.Stack.of(this).stackName}-assertions`),
      diffAssets: true,
    });

    // invoke the api and assert it didn't fail on an assertion error
    const assertCall = this.integ.assertions.invokeFunction({ functionName: assert.functionName });
    assertCall.expect(ExpectedResult.objectLike({ Payload: `"${SUCCESS_PAYLOAD}"` }));

  }
}

class DestroyAspect implements cdk.IAspect {
  visit(node: IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }
}
