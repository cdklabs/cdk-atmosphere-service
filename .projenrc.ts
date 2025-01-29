import { CdklabsConstructLibrary, JsiiLanguage } from 'cdklabs-projen-project-types';
import { JsonPatch } from 'projen';
import { JestReporter } from 'projen/lib/javascript';
import { IntegTests } from './projenrc/integ-tests';

const coverageThreshold = 95;

// pinning sdk version because upgrading it requires
// updating integration test snapshosts, which cannot be done
// automatically, and thus prevents automatic upgrades of other dependencies.
const sdkVersion = '3.734.0';

const project = new CdklabsConstructLibrary({
  author: 'AWS',
  authorAddress: 'aws-cdk-dev@amazon.com',
  cdkVersion: '2.173.1',
  defaultReleaseBranch: 'main',
  devDeps: [
    'cdklabs-projen-project-types',
    'aws-cdk',
    `@aws-sdk/client-s3@${sdkVersion}`,
    `@aws-sdk/client-dynamodb@${sdkVersion}`,
    `@aws-sdk/client-api-gateway@${sdkVersion}`,
    `@aws-sdk/client-sts@${sdkVersion}`,
    `@aws-sdk/client-scheduler@${sdkVersion}`,
    `@aws-sdk/client-cloudformation@${sdkVersion}`,
    `@aws-sdk/client-lambda@${sdkVersion}`,
    `@aws-sdk/client-ecs@${sdkVersion}`,
    `@aws-sdk/client-ecr@${sdkVersion}`,
    `@aws-sdk/credential-providers@${sdkVersion}`,
    'unzipper',
    '@smithy/util-stream',
    '@smithy/types',
    '@types/aws-lambda',
    '@types/unzipper',
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
  ],
  name: '@cdklabs/cdk-atmosphere-service',
  projenrcTs: true,
  release: true,
  private: false,
  enablePRAutoMerge: true,
  cdklabsPublishingDefaults: true,
  jsiiTargetLanguages: [JsiiLanguage.PYTHON],
  jestOptions: {
    jestConfig: {
      coverageThreshold: {
        statements: coverageThreshold,
        lines: coverageThreshold,
        functions: coverageThreshold,
        branches: coverageThreshold,
      },
      coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/test/',
      ],
      coverageReporters: ['text-summary'],
      reporters: [new JestReporter('default', { summaryThreshold: 1 })],
    },

    // we just want our own custom reporter that prints
    // a summary at the end.
    preserveDefaultReporters: false,
  },
  // this would have been nice but it doesn't
  // actually work with integ-runner.
  // we have our own mini discovery framework.
  // TODO - possibly pull our framework upstream if it proves useful.
  integrationTestAutoDiscover: false,
});

project.package.file.patch(JsonPatch.add('/jest/randomize', true));

IntegTests.discover(project);

const bundleAll = project.tasks.tryFind('bundle')!;
const cleanupBundle = project.tasks.addTask('bundle:cleanup');
const taskPath = 'src/cleanup/cleanup.task.ts';
const outfile = 'src/cleanup/image/index.js';
const command = [
  'esbuild',
  '--bundle',
  taskPath,
  '--target=\"node18\"',
  '--platform=\"node\"',
  `--outfile=\"${outfile}\"`,
  '--tsconfig=\"tsconfig.dev.json\"',
];
cleanupBundle.exec(command.join(' '));
bundleAll.spawn(cleanupBundle);

project.gitignore.exclude(outfile);

// we sometimes run `cdk` commands directly from the root
// for dev/testing purposes
project.gitignore.exclude('cdk.out');

project.synth();