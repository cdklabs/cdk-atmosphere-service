import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';
import { JsonPatch } from 'projen';

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
    'uuid',
    '@smithy/util-stream',
    '@types/aws-lambda',
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
  ],
  name: '@cdklabs/cdk-atmosphere-service',
  projenrcTs: true,
  release: false,
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
    },
  },
});

project.package.file.patch(JsonPatch.add('/jest/randomize', true));

project.synth();