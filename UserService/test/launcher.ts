import { handler } from "../src/services/football/handler";

// process.env.AWS_REGION = "eu-west-2";
// process.env.TABLE_NAME = "FootballStack-0a96e72d7ba2"

handler({
  httpMethod: 'DELETE',
  queryStringParameters: {
    id: '37fbefb1-2e72-4454-a078-8df1ced5dc84'
  },
  // body: JSON.stringify({
  //   name: 'DUDE'
  // })
} as any, {} as any);