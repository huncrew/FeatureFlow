import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function deleteFootball(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if ('id' in event.queryStringParameters) {
    const spaceId = event.queryStringParameters.id;

    await dynamodbClient.send(new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': {S: spaceId}
      }
    }));

    return {
      statusCode: 204,
      body: JSON.stringify(`Deleted this id spaceId - ${spaceId}`)
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify('Incorrect information provided.')
  }
}