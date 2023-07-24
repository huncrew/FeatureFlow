import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postFootball } from "./postFootball";
import { getFootball } from "./getFootball";
import { putFootball } from "./putFootball";
import { deleteFootball } from "./deleteFootball";

const dynamodbClient = new DynamoDBClient({})

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getFootball(event, dynamodbClient);
        console.log(getResponse);
        return getResponse;
      case 'POST':
        const postResponse = await postFootball(event, dynamodbClient);
        return postResponse;
      case 'PUT':
        const putResponse = await putFootball(event, dynamodbClient);
        console.log(putResponse);
      case 'DELETE':
        const deleteResponse = await deleteFootball(event, dynamodbClient);
        console.log(deleteResponse);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    }
  }

  const response: APIGatewayProxyResult = { 
    statusCode: 200,
    body: JSON.stringify(message)
  }
  console.log(event);

  return response;
}

export { handler };