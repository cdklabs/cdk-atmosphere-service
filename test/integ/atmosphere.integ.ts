import * as fs from 'fs';
import * as path from 'path';
import { ExpectedResult, IApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';
import { IConstruct } from 'constructs';
import * as runner from './atmosphere.runner';
import * as runtime from './atmosphere.runtime';
import { INTEG_RUNNER_REGIONS, ASSERT_HANDLER_FILE } from '../../projenrc/integ-tests';
import { AtmosphereService, Environment } from '../../src';
import * as envars from '../../src/envars';

/**
 * Properties for `AtmosphereIntegTest`.
 */
export interface AtmosphereIntegTestProps {
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
export class AtmosphereIntegTest {

  public readonly integ: IntegTest;

  constructor(props: AtmosphereIntegTestProps) {

    const app = new cdk.App();
    const serviceStack = new cdk.Stack(app, `atmosphere-integ-${props.dir}`);
    const assertionsStack = new cdk.Stack(app, `${serviceStack.stackName}-assertions`);

    const adminRole = new iam.Role(serviceStack, 'Admin', {
      assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
    });
    // because the cleaner passes this role to CloudFormation when deleting stacks
    adminRole.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      principals: [new iam.ServicePrincipal('cloudformation.amazonaws.com')],
    }));

    const environments: Environment[] = [];
    for (const [pool, regions] of Object.entries(props.pools)) {
      for (const region of regions) {
        if (INTEG_RUNNER_REGIONS.includes(region)) {
          // environments cannot be the same as the one running
          // the test because the test will delete all stacks being tested
          throw new Error(`Invalid region '${region}': Cannot be one of ${INTEG_RUNNER_REGIONS}`);
        }
        environments.push({
          account: cdk.Aws.ACCOUNT_ID,
          region,
          adminRoleArn: adminRole.roleArn,
          pool,
        });
      }
    }

    const service = new AtmosphereService(serviceStack, 'Atmosphere', {
      config: { environments },
      endpoint: {
        // allow any role in the deployment account to access the service
        // during integ tests so we can run assertions locally.
        allowedPrincipals: [new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID)],
      },
    });

    const assertionPath = path.join(__dirname, props.dir, ASSERT_HANDLER_FILE);
    const bundlePath = path.join(__dirname, `../../assets/test/integ/${props.dir}/index.js`);
    const stacksPath = path.join(__dirname, props.dir, 'stacks');

    if (!fs.existsSync(assertionPath)) {
      throw new Error(`Assertion handler not found: ${assertionPath}. Please make sure to name it '${ASSERT_HANDLER_FILE}'.`);
    }

    if (!fs.existsSync(bundlePath)) {
      throw new Error(`Bundle not found: ${bundlePath}. Add your test to .projenrc.ts so that a bundle will be created during build.`);
    }

    const assert = new lambda.Function(assertionsStack, 'Assert', {
      description: `test/integ/${props.dir}/assert.lambda.ts`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      code: lambda.Code.fromAsset(path.dirname(bundlePath)),
    });
    assert.role!.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // this prevents the assertion from running as a script
    assert.addEnvironment(runner.CDK_ATMOSPHERE_INTEG_LOCAL_ASSERT_ENV, 'false');

    // this redirects all runtime invocations to the live service components
    assert.addEnvironment(runtime.CDK_ATMOSPHERE_INTEG_LOCAL_RUNTIME_ENV, 'false');

    if (fs.existsSync(stacksPath)) {
      // the test has stacks it intends to deploy so we need to make them
      // available as an asset to the assertion lambda
      const stacksAsset = new s3Assets.Asset(assertionsStack, 'Stacks', {
        path: stacksPath,
      });
      // the session takes care of downloading this before the test begins.
      assert.addEnvironment(runner.CDK_ATMOSPHERE_INTEG_STACKS_BUCKET_ENV, stacksAsset.s3BucketName);
      assert.addEnvironment(runner.CDK_ATMOSPHERE_INTEG_STACKS_KEY_ENV, stacksAsset.s3ObjectKey);
      stacksAsset.grantRead(assert);
    }

    assert.node.addDependency(service);

    const envVariables: envars.EnvironmentVariables = {
      [envars.ENVIRONMENTS_TABLE_NAME_ENV]: service.environments.table.tableName,
      [envars.ALLOCATIONS_TABLE_NAME_ENV]: service.allocations.table.tableName,
      [envars.CONFIGURATION_BUCKET_ENV]: service.config.bucket.bucketName,
      [envars.CONFIGURATION_KEY_ENV]: service.config.key,
      [envars.ALLOCATION_TIMEOUT_DLQ_ARN_ENV]: service.scheduler.allocationTimeout.dlq.queueArn,
      [envars.CLEANUP_TIMEOUT_DLQ_ARN_ENV]: service.scheduler.cleanupTimeout.dlq.queueArn,
      [envars.SCHEDULER_ROLE_ARN_ENV]: service.scheduler.role.roleArn,
      [envars.ALLOCATION_TIMEOUT_FUNCTION_ARN_ENV]: service.scheduler.allocationTimeout.function.functionArn,
      [envars.CLEANUP_TIMEOUT_FUNCTION_ARN_ENV]: service.scheduler.cleanupTimeout.function.functionArn,
      [envars.REST_API_ID_ENV]: service.endpoint.api.restApiId,
      [envars.ALLOCATIONS_RESOURCE_ID_ENV]: service.endpoint.allocationsResource.resourceId,
      [envars.ALLOCATION_RESOURCE_ID_ENV]: service.endpoint.allocationResource.resourceId,
      [envars.DEALLOCATE_FUNCTION_NAME_ENV]: service.deallocate.function.functionName,
      [envars.CLEANUP_CLUSTER_ARN_ENV]: service.cleanup.cluster.clusterArn,
      [envars.CLEANUP_TASK_DEFINITION_ARN_ENV]: service.cleanup.task.taskDefinitionArn,
      [envars.CLEANUP_TASK_SUBNET_ID_ENV]: service.cleanup.subnetId,
      [envars.CLEANUP_TASK_SECURITY_GROUP_ID_ENV]: service.cleanup.securityGroupId,
      [envars.CLEANUP_TASK_CONTAINER_NAME_ENV]: service.cleanup.containerName,
    };

    for (const [key, value] of Object.entries(envVariables)) {
      // for running deployed assertions
      assert.addEnvironment(key, value);

      // for running local assertions
      new cdk.CfnOutput(assert, key, { value, key: key.replace(/_/g, '0') });
    }
    cdk.Aspects.of(cdk.Stack.of(serviceStack)).add(new DestroyAspect());

    this.integ = new IntegTest(app, 'IntegTest', {
      testCases: [serviceStack],
      assertionStack: assertionsStack,
      diffAssets: true,
    });

    // invoke the api and assert it didn't fail on an assertion error
    const assertCall = this.integ.assertions.invokeFunction({ functionName: assert.functionName });

    // the timeout of the function invoking our assertion should match the assertion timeout
    // because its a synchronous call.
    const lambdaProvider = this.findLambdaProvider(assertCall);
    lambdaProvider.addPropertyOverride('Timeout', assert.timeout?.toSeconds() ?? 120);

    assertCall.expect(ExpectedResult.objectLike({ Payload: `"${runner.SUCCESS_PAYLOAD}"` }));

  }

  private findLambdaProvider(assertCall: IApiCall): cdk.CfnResource {
    const providers = cdk.Stack.of(assertCall.provider).node.findAll().filter((n) => {
      return cdk.CfnResource.isCfnResource(n)
        && n.cfnResourceType === 'AWS::Lambda::Function'
        && n.node.path.includes('SingletonFunction');
    });
    if (providers.length !== 1) {
      throw new Error(`Expected to find exactly one lambda provider, found ${providers.length}`);
    }
    return providers[0] as cdk.CfnResource;
  }
}

export class DestroyAspect implements cdk.IAspect {
  visit(node: IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }
}
