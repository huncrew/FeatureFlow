import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function putFootball(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if ('id' in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body);
    const spaceId = event.queryStringParameters.id;
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await dynamodbClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': {S: spaceId}
      },
      UpdateExpression: 'set #old = :new',
      ExpressionAttributeValues: {
        ':new': {
          S: requestBodyValue
        }
      },
      ExpressionAttributeNames: {
        '#old': requestBodyKey
      },
      ReturnValues: 'UPDATED_NEW'
    }));

    return {
      statusCode: 204,
      body: JSON.stringify(updateResult.Attributes)
    }

  }
  return {
    statusCode: 204,
    body: JSON.stringify('Incorrect information provided.')
  }
}