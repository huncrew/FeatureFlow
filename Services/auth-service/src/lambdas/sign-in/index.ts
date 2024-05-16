import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.USERPOOL_CLIENT_ID, // The same client ID as for the SignUp
    AuthParameters: {
      USERNAME: email, // Use email here instead of username
      PASSWORD: password,
    },
  };

  try {
    const { AuthenticationResult } = await client.send(
      new InitiateAuthCommand(params),
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User authenticated successfully',
        tokens: AuthenticationResult,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  } catch (error) {
    console.error('User sign-in error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'User sign-in failed',
        error: error.message,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  }
};
