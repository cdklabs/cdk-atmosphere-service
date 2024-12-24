import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AtmosphereService } from '../../../src';

test('default resource policy', () => {

  const app = new App();
  const stack = new Stack(app, 'Stack');

  new AtmosphereService(stack, 'AtmosphereService', {
    config: {
      environments: [{ account: '1111', region: 'us-east-1', pool: 'canary', adminRoleArn: 'arn:aws:iam::1111:role/Admin' }],
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Policy: {
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Principal: {
          AWS: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::',
                {
                  Ref: 'AWS::AccountId',
                },
                ':root',
              ],
            ],
          },
        },
        Resource: [
          'execute-api:/prod/POST/allocations',
          'execute-api:/prod/DELETE/allocations/{id}',
        ],
      }],
    },
  });

});

test('can add accounts to resource policy', () => {

  const app = new App();
  const stack = new Stack(app, 'Stack');

  new AtmosphereService(stack, 'AtmosphereService', {
    config: {
      environments: [{ account: '1111', region: 'us-east-1', pool: 'canary', adminRoleArn: 'arn:aws:iam::1111:role/Admin' }],
    },
    endpoint: {
      allowedAccounts: ['2222'],
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Policy: {
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Principal: {
          AWS: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::2222:root',
                ],
              ],
            },
          ],
        },
        Resource: [
          'execute-api:/prod/POST/allocations',
          'execute-api:/prod/DELETE/allocations/{id}',
        ],
      }],
    },
  });

});