// use middy

import middy from '@middy/core';
import httpRouterHandler, { Route } from '@middy/http-router';
import * as twilio from 'twilio';


// credentials (move to env)
const accountSid = 'AC3eaaeea1e9485e5d724d930e2d126afb';
const authToken = '[AuthToken]';
const client = new twilio.Twilio(accountSid, authToken);




const lambdaHandler = async () => {
    client.messages
    .create({
        body: 'hello',
        from: '+447480802337',
        to: '+447769280766'
    })
    .then(message => console.log(message.sid));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify('test'),
  };
};

const handlerMiddy = middy().handler(lambdaHandler);

const routes: Route<object>[] = [
  {
    method: 'GET',
    path: 'sms',
    handler: handlerMiddy,
  },
];

export const handler = middy().handler(httpRouterHandler(routes));

