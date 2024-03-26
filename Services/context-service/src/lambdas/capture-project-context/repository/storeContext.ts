import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ProjectContext } from '../schema/context';
import { v4 as uuidv4 } from 'uuid';


 // Function to store the data in DynamoDB using DynamoDBDocumentClient
export const putContextData = async (data: ProjectContext) => {
    const projectId = uuidv4(); // Generate a UUID for the new project
    const params = {
      TableName: 'FeatureFlowContextTable', // Replace with your DynamoDB table name
      Item: {
        projectId,
        ...data,
      },
    };

    // Using the DynamoDB Document Client to put the item
    await dynamoDb.send(new PutCommand(params));
  };