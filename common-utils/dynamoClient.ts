import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize the low-level DynamoDB Client
const dynamoDBClient = new DynamoDBClient({});

// Create a DynamoDB Document Client from the low-level DynamoDB Client
export const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);
