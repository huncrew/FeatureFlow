import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Function to update or create the conversation messages in DynamoDB
export const updateConversationMessages = async (sessionId: string, messages: any[]) => {
  try {
    await dynamoDb.send(new PutCommand({
      TableName: 'FeatureFlowContextTable',
      Item: {
        PK: `Session#${sessionId}`, // Use sessionId as part of the partition key
        SK: "Messages", // Use a constant sort key for all messages related to the session
        messages: messages, // messages array
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
        PK: `Session#${sessionId}`, // Construct the PK with sessionId
        SK: "Messages", // Use a constant SK if all messages for a session are stored in a single item
      },
    }));

    return Item ? Item.messages : [];
  } catch (error) {
    console.error('Error retrieving conversation messages:', error);
    throw error;
  }
};
