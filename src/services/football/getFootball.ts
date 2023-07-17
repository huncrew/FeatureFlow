import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function getFootball(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters) {
    console.log(event.queryStringParameters);
    const footballId = event.queryStringParameters['id'];
    console.log(footballId);
    const singleItemResponse = await dynamodbClient.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': {S: footballId}
      }
    }));
    console.log(singleItemResponse.Item);
    return {
      statusCode: 201,
      body: JSON.stringify({message: 'hi Dale', item: singleItemResponse.Item})
    }
  }

  const result = await dynamodbClient.send(new ScanCommand({
    TableName: process.env.TABLE_NAME,
    }));

  console.log(result);

  return { 
    statusCode: 201,
    body: JSON.stringify({items: result.Items, dale: 'you did it'})
  }
}