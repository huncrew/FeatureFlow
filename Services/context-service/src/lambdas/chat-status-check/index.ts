import { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getTaskData } from './repository/getTaskData';
// Assume there's a function to get context data

export const handler: APIGatewayProxyHandler = async (event) => {
  // Common CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain for production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  };

  try {
    if (event.httpMethod === 'GET') {
      // Logic to handle GET request
      const projectId = event.pathParameters.projectId;
      const sessionId = event.pathParameters.sessionId;
      const taskId = event.pathParameters.taskId;

      console.log('consoling project and task', projectId, taskId);

      if (!projectId || !sessionId || !taskId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing projectId or userId or taskId' }),
          headers: corsHeaders,
        };
      }

      const taskMessage = await getTaskData(sessionId, taskId);

      return {
        statusCode: 200,
        body: JSON.stringify(taskMessage),
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
        body: JSON.stringify({
          message: 'Validation failed',
          details: error.errors,
        }),
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
