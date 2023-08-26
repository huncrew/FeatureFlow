import { handler } from '../src/lambdas/sms/handler';

process.env.AWS_REGION = 'eu-west-2';
process.env.TABLE_NAME = 'FootballStack-0a96e72d7ba2';

handler(
  {
    httpMethod: 'GET',
    queryStringParameters: {
      id: '37fbefb1-2e72-4454-a078-8df1ced5dc84',
    },
    body: JSON.stringify({
      name: 'JAMES',
    }),
  } as any,
  {} as any,
);
