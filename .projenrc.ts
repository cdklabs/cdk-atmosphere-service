import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';
import { JsonPatch } from 'projen';
import { JestReporter } from 'projen/lib/javascript';
import { IntegTests } from './projenrc/integ-tests';

const coverageThreshold = 95;

const project = new CdklabsConstructLibrary({
  author: 'AWS',
  authorAddress: 'aws-cdk-dev@amazon.com',
  cdkVersion: '2.173.1',
  defaultReleaseBranch: 'main',
  devDeps: [
    'cdklabs-projen-project-types',
    'aws-cdk',
    '@aws-sdk/client-s3',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/client-api-gateway',
    '@aws-sdk/client-sts',
    '@aws-sdk/client-scheduler',
    '@aws-sdk/client-cloudformation',
    '@aws-sdk/client-lambda',
    '@aws-sdk/client-ecs',
    '@aws-sdk/client-ecr',
    '@aws-sdk/credential-providers',
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