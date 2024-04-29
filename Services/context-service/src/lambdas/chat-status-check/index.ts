import { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { ProjectContext, validateProjectContext } from './schema/context';
import { putContextData, getContextData } from './repository/storeContext';
// Assume there's a function to get context data

export const handler: APIGatewayProxyHandler = async (event) => {
  // Common CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain for production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  };

  try {
    if (event.httpMethod === 'POST') {
      // Existing logic to handle POST request
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('console body', body);
      const validatedData: ProjectContext = validateProjectContext(body);
      await putContextData(validatedData);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Project context saved successfully' }),
        headers: corsHeaders,
      };
    } else if (event.httpMethod === 'GET') {
      // Logic to handle GET request
      const projectId = event.pathParameters.projectId;
      const userId = event.pathParameters.userId;

      console.log('consoling project and user', projectId, userId)

      if (!projectId || !userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing projectId or userId' }),
          headers: corsHeaders,
        };
      }

      const data = await getContextData(projectId, userId);

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: corsHeaders,
      };
    } else {
      // Handle unsupported methods
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
        headers: corsHeaders,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation failed', details: error.errors }),
        headers: corsHeaders,
      };
    }

    console.error('Error handling the request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error }),
      headers: corsHeaders,
    };
  }
};
