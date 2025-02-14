import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountPrincipal } from 'aws-cdk-lib/aws-iam';
import * as r53 from 'aws-cdk-lib/aws-route53';
import { AtmosphereService } from '../../../src';

test('default resource policy', () => {

  const app = new App();
  const stack = new Stack(app, 'Stack');

  new AtmosphereService(stack, 'AtmosphereService', {
    config: {
      environments: [{ account: '1111', region: 'us-east-1', pool: 'canary', roleArn: 'arn:aws:iam::1111:role/Admin' }],
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Policy: {
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Principal: {
          AWS: '*',
        },
        Resource: '*',
      }],
    },
  });

});

test('can add principals to resource policy', () => {

  const app = new App();
  const stack = new Stack(app, 'Stack');

  new AtmosphereService(stack, 'AtmosphereService', {
    config: {
      environments: [{ account: '1111', region: 'us-east-1', pool: 'canary', roleArn: 'arn:aws:iam::1111:role/Admin' }],
    },
    endpoint: {
      allowedPrincipals: [new AccountPrincipal('2222')],
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Policy: {
      Statement: [
        {
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
                  ':iam::2222:root',
                ],
              ],
            },
          },
          Resource: [
            'execute-api:/prod/POST/allocations',
            'execute-api:/prod/DELETE/allocations/*',
          ],
        },
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Principal: {
            AWS: '*',
          },
          Resource: '*',
          Condition: {
            'ForAllValues:ArnNotEquals': {
              'aws:PrincipalArn': [
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
          },
        },
      ],
    },
  });

});

test('a custom domain is created if hosted zone is provided', () => {

  const app = new App();
  const stack = new Stack(app, 'Stack');

  new AtmosphereService(stack, 'AtmosphereService', {
    config: {
      environments: [{ account: '1111', region: 'us-east-1', pool: 'canary', roleArn: 'arn:aws:iam::1111:role/Admin' }],
    },
    endpoint: {
      allowedPrincipals: [new AccountPrincipal('2222')],
      hostedZone: r53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: '123456',
        zoneName: 'example.com',
      }),
    },
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ApiGateway::DomainName', {});

});