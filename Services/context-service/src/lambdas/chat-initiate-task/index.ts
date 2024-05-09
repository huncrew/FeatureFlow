import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { validateEvent } from './schema/context';

const sqs = new SQS();
const queueUrl = process.env.SQS_QUEUE_URL;  // Ensure your SQS queue URL is stored in the Lambda environment variables

export const handler: APIGatewayProxyHandler = async (event) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain for production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    };

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
                headers: corsHeaders,
            };
        }

        const body = event.body ? JSON.parse(event.body) : {};
        const validatedData = validateEvent(body); 

        const taskId = uuidv4();  
        await sqs.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
                taskId,
                ...validatedData
            }),
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ taskId, message: 'Request received and is being processed' }),
            headers: corsHeaders,
        };

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
            body: JSON.stringify({ message: 'Internal server error', error }),
            headers: corsHeaders,
        };
    }
};
