import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body);

    console.log('the body',JSON.parse(event.body))

    const params = {
      ClientId: process.env.USERPOOL_CLIENT_ID as string,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    await client.send(new SignUpCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  } catch (error) {
    console.error('User registration error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User registration failed' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your actual domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  }
};
