import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ProjectContext } from '../schema/context';

interface Step {
  id: string;
  title: string;
  objective: string;
  exampleCode: string;
}

export const putContextData = async (data: ProjectContext) => {
  const projectId = `PROJECT#${data.projectTitle
    .replace(/\s+/g, '-')
    .toLowerCase()}`; // Ensure uniqueness and facilitate querying
  const userId = `USER#${data.user}`;

  try {
    // Prepare the project context item
    const projectContextItem = {
      PK: userId,
      SK: `METADATA#${projectId}`,
      ...data,
      steps: undefined, // Exclude the steps array from the project context item
    };

    // Prepare items for each step
    const stepItems = data.steps.map((step, index) => ({
      PK: projectId,
      SK: `STEP#${index + 1}`, // or generate a unique ID for each step
      ...step,
    }));

    // Store the project context
    await dynamoDb.send(
      new PutCommand({
        TableName: 'FeatureFlowContextTable',
        Item: projectContextItem,
      }),
    );

    // Store each step separately
    // BatchWriteCommand ?
    for (const stepItem of stepItems) {
      await dynamoDb.send(
        new PutCommand({
          TableName: 'FeatureFlowContextTable',
          Item: stepItem,
        }),
      );
    }
  } catch (error) {
    console.error('Error handling the request:', error);
    throw error;
  }
};

export const getContextData = async (
  projectTitle: string,
  userId: string,
): Promise<ProjectContext | null> => {
  console.log('projectTitle', projectTitle);
  const projectPk = `USER#${userId}`;
  const projectSk = `METADATA#PROJECT#${projectTitle
    .replace(/\s+/g, '-')
    .toLowerCase()}`;

  console.log('project pk and sk', projectPk, projectSk);

  try {
    // Query the project context
    const projectResult = await dynamoDb.send(
      new QueryCommand({
        TableName: 'FeatureFlowContextTable',
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': projectPk,
          ':sk': projectSk,
        },
      }),
    );

    console.log('project result', projectResult);

    if (projectResult.Items.length === 0) {
      // No project found for the given projectId and userId
      return null;
    }

    // Assuming only one item is returned for a unique projectId and userId
    const projectContext: ProjectContext = projectResult
      .Items[0] as ProjectContext;

    // Optionally, query the steps for the project
    const stepsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: 'FeatureFlowContextTable',
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `PROJECT#${projectTitle.replace(/\s+/g, '-').toLowerCase()}`,
        },
      }),
    );

    const steps: Step[] = stepsResult.Items as Step[];
    projectContext.steps = steps;

    return projectContext;
  } catch (error) {
    console.error('Error retrieving project context:', error);
    throw error;
  }
};
