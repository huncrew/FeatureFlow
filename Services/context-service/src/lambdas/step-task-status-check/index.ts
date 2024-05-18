import { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getTaskData } from './repository/getTaskData';

export const handler: APIGatewayProxyHandler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  };

  try {
    if (event.httpMethod === 'GET') {
      const sessionId = event.pathParameters.sessionId;
      const taskId = event.pathParameters.taskId;

      console.log('Fetching status for session and task:', sessionId, taskId);

      if (!sessionId || !taskId) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Missing sessionId or taskId',
          }),
          headers: corsHeaders,
        };
      }

      const taskData = await getTaskData(sessionId, taskId);

      if (!taskData) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            Status: 'pending',
          }),
          headers: corsHeaders,
        };
      }

      const response = {
        Status: 'completed',
        Result: {
          generatedCode: taskData || '',
        },
      };

      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: corsHeaders,
      };
    } else {
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
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
      headers: corsHeaders,
    };
  }
};
