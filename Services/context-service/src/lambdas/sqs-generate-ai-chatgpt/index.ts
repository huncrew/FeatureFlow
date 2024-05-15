import OpenAI from "openai";
import config from "../../../envConstants";
import { getConversationMessages, updateConversationMessages, updateTaskData } from './repository/storeContext';

console.log(config.OPENAI_KEY)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const handler = async (event) => {

  try {
  const { taskId, sessionId, projectContext, techContext, featureObjective, eventDetails, step } = JSON.parse(event.body.MessageBody || '{}');

  console.log('in here and the event is', event.body);

  let conversationState = await getConversationMessages(sessionId);

  if (!conversationState.length) {
    // Reset for a new feature and set initial context
    conversationState = [];
    const systemMessage = `You are a programming assistant familiar with modern web development practices, including React, Node.js, Typescript and AWS services including IaC CDK. You will help by providing code that matches the exact style and technical standards provided by the user. The aim is to assist a developer in building features for a web application called FeatureFlow, which automates development by focussing on events, a json event will go through steps, each step is a message sent to you, with the objective of the step, along with example code so you can produce the code to complete the feature. Each step you will be given outlines a specific feature or function that needs coding. Please provide clear, concise, and syntactically correct code snippets and explanations for those steps.`;
    conversationState.push({ role: "system", content: systemMessage });

    // Here, you might add more 'system' context about the app's current technical setup, if it's consistent across features
    conversationState.push({ role: "system", content: projectContext });

    // Then, a 'user' message to introduce the feature being worked on in this session
    conversationState.push({ role: "system", content: techContext });

    // an initial user message to add the feature context, we don't actually capture the response on this, its just more setup.
    const featureObjectiveMessage = `The feature you are working on is: ${featureObjective}`;
    conversationState.push({ role: "user", content: featureObjectiveMessage });

    // Step completion. 
    const firstStepMessage = `The first step is ${step.objective}. please add in the code in the same style as the example code, and use the tech stack / standards.
    Here is the example code: ${step.exampleCode}. Here is the event details: ${eventDetails}. Tech stack/standards: ${techContext}`;
    conversationState.push({ role: "user", content: firstStepMessage });
  } else {
    // subsequent step completion. 
    const nextStepMessage = `The next step is ${step.objective}. please add in the code in the same style as the example code, and use the tech stack / standards.
    Here is the example code: ${step.exampleCode}. Here is the event details: ${eventDetails}. Tech stack/standards: ${techContext}`;
    conversationState.push({ role: "user", content: nextStepMessage });

  }

  console.log('conversation should be created....', conversationState);

  // Generate response from ChatGPT
  const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: conversationState.map(msg => ({ role: msg.role, content: msg.content })),
  });

  console.log('response from chatgpt', response.choices[0].message.content);

  // Append generated code to conversation
  conversationState.push({ role: "assistant", content: response.choices[0].message.content });

  // Update DynamoDB with the latest conversation state
  await updateConversationMessages(sessionId, conversationState);

  // update task data ID for retrieval by the FE
  await updateTaskData(sessionId, taskId, conversationState )

  console.log('conversation state updated in dynamo', conversationState)


} catch (error) {
  console.log('error in lambda', error);
}
};

