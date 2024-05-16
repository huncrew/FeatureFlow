import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Function to update or create the conversation messages in DynamoDB
export const updateConversationMessages = async (
  sessionId: string,
  messages: any[],
) => {
  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: 'FeatureFlowContextTable',
        Item: {
          PK: `SESSION#${sessionId}`,
          SK: 'Messages',
          Messages: messages,
        },
      }),
    );
  } catch (error) {
    console.error('Error updating conversation messages:', error);
    throw error;
  }
};

// Function to get the conversation messages from DynamoDB
export const getConversationMessages = async (sessionId: string) => {
  try {
    const { Item } = await dynamoDb.send(
      new GetCommand({
        TableName: 'FeatureFlowContextTable',
        Key: {
          PK: `SESSION#${sessionId}`,
          SK: 'Messages',
        },
      }),
    );

    return Item ? Item.messages : [];
  } catch (error) {
    console.error('Error retrieving conversation messages:', error);
    throw error;
  }
};

export const updateTaskData = async (
  sessionId: string,
  taskId: string,
  message: string,
) => {
  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: 'FeatureFlowContextTable',
        Item: {
          PK: `SESSION#${sessionId}`,
          SK: `TASK#${taskId}`,
          LatestMessage: message,
        },
      }),
    );
  } catch (error) {
    console.error('Error updating task data:', error);
    throw error;
  }
};
