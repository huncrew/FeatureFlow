import OpenAI from 'openai';
import { SQSEvent } from 'aws-lambda';
import config from '../../../envConstants';
import {
  getConversationMessages,
  updateConversationMessages,
  updateTaskData,
} from './repository/storeContext';

console.log(config.OPENAI_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const handler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      console.log(record);
      const messageBody = JSON.parse(record.body);

      console.log('message body', messageBody);
      const {
        taskId,
        sessionId,
        projectContext,
        techContext,
        featureObjective,
        eventDetails,
        step,
      } = messageBody;

      console.log('Processing taskId:', taskId);

      let conversationState = await getConversationMessages(sessionId);

      if (!conversationState.length) {
        conversationState = [];
        const systemMessage = `You are a programming assistant familiar with modern web development practices, including React, Node.js, Typescript and AWS services including IaC CDK. You will help by providing code that matches the exact style and technical standards provided by the user. The aim is to assist a developer in building features for a web application called FeatureFlow, which automates development by focussing on events, a json event will go through steps, each step is a message sent to you, with the objective of the step, along with example code so you can produce the code to complete the feature. Each step you will be given outlines a specific feature or function that needs coding. Please provide clear, concise, and syntactically correct code snippets and explanations for those steps.`;
        conversationState.push({ role: 'system', content: systemMessage });
        conversationState.push({ role: 'system', content: projectContext });
        conversationState.push({ role: 'system', content: techContext });
        const featureObjectiveMessage = `The feature you are working on is: ${featureObjective}`;
        conversationState.push({
          role: 'user',
          content: featureObjectiveMessage,
        });
        const firstStepMessage = `The first step is ${step.objective}. please add in the code in the same style, and use the tech stack / standards. Here is the example code: ${step.exampleCode}. Here is the event details: ${eventDetails}. Tech standards: ${techContext}`;
        conversationState.push({ role: 'user', content: firstStepMessage });
      } else {
        const nextStepMessage = `The next step is ${step.objective}. please add in the code in the same style, and use the tech stack / standards. Here is the example code: ${step.exampleCode}. Here is the event details: ${eventDetails}. Tech standards: ${techContext}`;
        conversationState.push({ role: 'user', content: nextStepMessage });
      }

      console.log('conversation should be created....', conversationState);

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationState.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      console.log('response from chatgpt', response.choices[0].message.content);

      conversationState.push({
        role: 'assistant',
        content: response.choices[0].message.content,
      });

      await updateConversationMessages(sessionId, conversationState);

      console.log('conversation state updated in dynamo', conversationState);

      // update task data ID for retrieval by the FE
      await updateTaskData(
        sessionId,
        taskId,
        response.choices[0].message.content,
      );

      console.log('update task data', conversationState);
    }
  } catch (error) {
    console.log('error in lambda', error);
  }
};
