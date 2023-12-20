import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
  const { email, confirmationCode } = JSON.parse(event.body);
  const params = {
    ClientId: process.env.USERPOOL_CLIENT_ID, // The same client ID as for the SignUp
    Username: email,
    ConfirmationCode: confirmationCode,
  };

    await client.send(new ConfirmSignUpCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User confirmed successfully',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  } catch (error) {
    console.error('User confirmation error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User confirmation failed', error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  }
};
