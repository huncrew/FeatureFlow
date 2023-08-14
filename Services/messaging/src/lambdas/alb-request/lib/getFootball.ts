import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';

export async function getFootball(
  event: APIGatewayProxyEvent,
  dynamodbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    const footballId = event.queryStringParameters['id'];
    const singleItemResponse = await dynamodbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: footballId },
        },
      }),
    );

    const unmarshResp = unmarshall(singleItemResponse.Item);
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'hi Dale', item: unmarshResp }),
    };
  }

  const result = await dynamodbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    }),
  );

  const unmarshAllItems = result.Items.map((item) => unmarshall(item));

  return {
    statusCode: 201,
    body: JSON.stringify({ items: unmarshAllItems, dale: 'you did it' }),
  };
}
