import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ProjectContext } from '../schema/context';
import { v4 as uuidv4 } from 'uuid';

export const putContextData = async (data: ProjectContext) => {
    const projectId = `PROJECT#${uuidv4()}`; // Ensure uniqueness and facilitate querying

    // Prepare the project context item
    const projectContextItem = {
      PK: projectId,
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
    await dynamoDb.send(new PutCommand({
      TableName: 'FeatureFlowContextTable',
      Item: projectContextItem,
    }));

    // Store each step separately
    // BatchWriteCommand ? 
    for (const stepItem of stepItems) {
      await dynamoDb.send(new PutCommand({
        TableName: 'FeatureFlowContextTable',
        Item: stepItem,
      }));
    }
};
