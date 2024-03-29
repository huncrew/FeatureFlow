import { Event, validateEvent } from './schema/context';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';

// Placeholder function to simulate a call to the ChatGPT service
export const sendMessageToChatGPT = (eventData: Event): string => {
  // Here you'd have the logic to construct the message and send it to the ChatGPT service
  // and return the response from ChatGPT.
  // For now, we're just simulating with a dummy response.
  return JSON.stringify({ message: 'Response from ChatGPT', eventData });
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse the incoming event body
    const body = event.body ? JSON.parse(event.body) : {};

    // Validate the event body with the schema and infer the TypeScript type
    const validatedData: Event = validateEvent(body);

    // Send the message to the ChatGPT service
    const chatGptResponse = await sendMessageToChatGPT(validatedData);

    // Return a success response with the ChatGPT message
    return {
      statusCode: 200,
      body: chatGptResponse,
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
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
