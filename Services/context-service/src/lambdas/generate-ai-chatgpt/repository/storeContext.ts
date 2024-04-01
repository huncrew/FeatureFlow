import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Function to update or create the conversation messages in DynamoDB
export const updateConversationMessages = async (sessionId: string, messages: any[]) => {
  try {
    await dynamoDb.send(new PutCommand({
      TableName: 'FeatureFlowContextTable',
      Item: {
        sessionId: sessionId,
        messages: messages, // Storing the array directly
      },
    }));
  } catch (error) {
    console.error('Error updating conversation messages:', error);
    throw error;
  }
};

// Function to get the conversation messages from DynamoDB
export const getConversationMessages = async (sessionId: string) => {
  try {
    const { Item } = await dynamoDb.send(new GetCommand({
      TableName: 'FeatureFlowContextTable',
      Key: {
        sessionId: sessionId,
      },
    }));

    return Item ? Item.messages : [];
  } catch (error) {
    console.error('Error retrieving conversation messages:', error);
    throw error;
  }
};
