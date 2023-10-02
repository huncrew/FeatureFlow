// use middy

import middy from '@middy/core';
import * as twilio from 'twilio';


// credentials (move to env)
const accountSid = 'AC3eaaeea1e9485e5d724d930e2d126afb';
const authToken = '178abd6ffec718871057b2cebfc9c3cd';
const client = new twilio.Twilio(accountSid, authToken);


const lambdaHandler = async () => {
   await client.messages
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

export const handler = middy().handler(lambdaHandler);

