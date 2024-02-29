import { runConversation } from "../../src/lambdas/openai-test";

// const testEvent = {
//   queryStringParameters: {
//     code: 'testCodeFromEtsy',
//   },
// };

// Simulate context if needed
// const context = {};

runConversation()
  .then(response => console.log(response))
  .catch(error => console.error(error));
