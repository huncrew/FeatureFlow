import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function putFootball(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters) {

  }
}