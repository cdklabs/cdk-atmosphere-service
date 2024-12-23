// eslint-disable-next-line import/no-extraneous-dependencies
import { DynamoDB } from '@aws-sdk/client-dynamodb';

async function main() {

  const dynamo = new DynamoDB({ region: 'us-east-1' });
  // const response = await dynamo.getItem({
  //   TableName: 'integ-service-stack-AtmosphereServiceEnvironmentsTable2E9F23CB-164ZEB8SG8Z3G',
  //   Key: {
  //     account: { S: '1111' },
  //     region: { S: 'us-east-1' },
  //   },
  // });

  const tableName = 'integ-service-stack-AtmosphereServiceEnvironmentsTable2E9F23CB-A49MDO7IM4GB';

  const response = await dynamo.batchGetItem({
    RequestItems: {
      [tableName]: {
        Keys: [
          {
            account: { S: '1111' },
            region: { S: 'us-east-1' },
          },
          {
            account: { S: '2222' },
            region: { S: 'us-east-1' },
          },
        ],
      },
    },
  });

  console.log(response.UnprocessedKeys);
  console.log(response.Responses![tableName]);

}

void main();