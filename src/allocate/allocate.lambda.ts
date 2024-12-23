// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success allocated' }),
  };
}