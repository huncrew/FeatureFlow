import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

let DYNAMODB_REGION = '__DYNAMODB_REGION__';
if (process.env.DYNAMODB_REGION && process.env.DYNAMODB_REGION != '') {
  DYNAMODB_REGION = process.env.DYNAMODB_REGION;
}

let DYNAMODB_ENDPOINT = '__DYNAMODB_ENDPOINT__';
if (process.env.DYNAMODB_ENDPOINT && process.env.DYNAMODB_ENDPOINT != '') {
  DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
}

const ddbClient = new DynamoDBClient({
  region: DYNAMODB_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient); // client is DynamoDB client
