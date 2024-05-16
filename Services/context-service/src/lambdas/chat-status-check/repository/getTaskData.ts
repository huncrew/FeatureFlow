import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ProjectContext } from '../schema/context';

interface Step {
  id: string;
  title: string;
  objective: string;
  exampleCode: string;
}


export const getTaskData = async (
  sessionId: string,
  taskId: string,
): Promise<ProjectContext | null> => {
  const pk = `SESSION#${sessionId}`;
  const sk = `TASK#${taskId}`

  console.log('project pk and sk', pk, sk);

  try {
    // Query the project context
    const taskResult = await dynamoDb.send(
      new QueryCommand({
        TableName: 'FeatureFlowContextTable',
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':sk': sk,
        },
      }),
    );

    console.log('project result', taskResult);

    if (taskResult.Items.length === 0) {
      return null;
    }

    const latestMessage = taskResult
      .Items[0].LatestMessage

    console.log(latestMessage);

    return latestMessage;
  } catch (error) {
    console.error('Error retrieving project context:', error);
    throw error;
  }
};
