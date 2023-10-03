export const authCallback: APIGatewayProxyHandler = async (event, _context) => {
  const { code } = event.queryStringParameters;

  try {
      const response = await axios.post('https://api.etsy.com/v3/oauth/token', null, {
          params: {
              client_id: ETSY_CLIENT_ID,
              client_secret: ETSY_CLIENT_SECRET,
              redirect_uri: REDIRECT_URI,
              code,
              grant_type: 'authorization_code'
          }
      });
      const { access_token } = response.data;
      return {
          statusCode: 200,
          body: `Authenticated successfully. Your access token is: ${access_token}`
      };
  } catch (error) {
      return {
          statusCode: 500,
          body: 'Authentication failed'
      };
  }
};