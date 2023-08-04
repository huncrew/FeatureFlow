import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { v4 } from 'uuid';

export async function postFootball(
  event: APIGatewayProxyEvent,
  dynamodbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body);

  const result = await dynamodbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: {
          S: randomId,
        },
        name: {
          S: item.name,
        },
      },
    }),
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId, dale: 'you did it' }),
  };
}
