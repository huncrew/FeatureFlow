const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ETSY_CLIENT_SECRET = process.env.ETSY_CLIENT_SECRET;

import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';

export const authCallback: APIGatewayProxyHandler = async (event, context) => {
  const code = event.queryStringParameters?.code;

  try {
    const response = await axios.post(
      'https://api.etsy.com/v3/oauth/token',
      null,
      {
        params: {
          client_id: ETSY_CLIENT_ID,
          client_secret: ETSY_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
          grant_type: 'authorization_code',
        },
      },
    );
    const { access_token } = response.data;
    return {
      statusCode: 200,
      body: `Authenticated successfully. Your access token is: ${access_token}`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Authentication failed',
    };
  }
};
