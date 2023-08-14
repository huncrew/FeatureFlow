import middy from "@middy/core";
import httpRouterHandler, { Route } from '@middy/http-router';

// const baseURI = '__MESSAGES_API_BASE_URI__';

const lambdaHandler = async () => {

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify('test')
  }
};

const handlerMiddy = middy()
.handler(lambdaHandler)

const routes: Route<object>[] = [
  {
    method: 'GET',
    path: '/sms',
    handler: handlerMiddy
  }
];

export const handler = middy()
.handler(httpRouterHandler(routes));

