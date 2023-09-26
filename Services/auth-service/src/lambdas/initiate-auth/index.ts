import { APIGatewayProxyHandler } from 'aws-lambda';

const ETSY_CLIENT_ID = 'YOUR_ETSY_APP_CLIENT_ID';
const REDIRECT_URI = 'YOUR_APIGATEWAY_ENDPOINT/auth/callback';

export const auth: APIGatewayProxyHandler = async (event, context) => {
    const authURL = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${ETSY_CLIENT_ID}`;
    return {
        statusCode: 302,
        headers: {
            'Location': authURL
        },
        body: ''
    };
};
