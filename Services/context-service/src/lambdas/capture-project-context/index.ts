import { ProjectContext, validateProjectContext } from './schema/context';
import { putContextData } from './repository/storeContext';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';


export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse the incoming event body
    const body = event.body ? JSON.parse(event.body) : {};

    console.log('console body', body);

    // Validate the event body with the schema and infer the TypeScript type
    const validatedData: ProjectContext = validateProjectContext(body);

    // Store the project context data in DynamoDB
    await putContextData(validatedData);

    // return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Project context saved successfully' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation failed', details: error.errors }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
      };
    }

    // Handle other errors
    console.error('Error handling the request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    };
  }
};
