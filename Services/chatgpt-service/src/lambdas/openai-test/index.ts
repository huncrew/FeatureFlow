import config from '../../../envConstants'


// Assuming OpenAI SDK has TypeScript support or you have type definitions set up
import OpenAI from 'openai';
import { ChatCompletionTool, ChatCompletionMessageParam } from 'openai/resources';

// Adjust the OpenAI initialization based on actual usage and configuration in TypeScript
const openai = new OpenAI({
  apiKey: config.OPENAI_KEY,
});

// Function to get current weather - kept as is with TypeScript typing
function getCurrentWeather(location: string, unit: 'celsius' | 'fahrenheit' = 'fahrenheit'): string {
  if (location.toLowerCase().includes("tokyo")) {
    return JSON.stringify({ location: "Tokyo", temperature: "10", unit: "celsius" });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({ location: "San Francisco", temperature: "72", unit: "fahrenheit" });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({ location: "Paris", temperature: "22", unit: "fahrenheit" });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }}

// The main function to run the conversation
export async function runConversation(): Promise<any> {

  console.log('hello');
  console.log('...............', config.OPENAI_KEY)
  // Setup for messages and tools not shown here - ensure tools are defined if used
  const messages: ChatCompletionMessageParam[] = [
    { role: "user", content: "What's the weather like in San Francisco, Tokyo, and Paris?" },
  ];
  
  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];

  // Assuming 'tools' variable is defined elsewhere based on the provided code structure
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: messages,
    tools: tools, // Ensure 'tools' is correctly defined and passed if necessary
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  console.log(' first responseMessage', responseMessage)

  // Parsing the response and handling tool calls - Ensure you adapt based on actual API response structure
  const toolCalls = responseMessage.tool_calls;

  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions = {
      get_current_weather: getCurrentWeather,
    }; // only one function in this example, but you can have multiple
    messages.push(responseMessage); // extend conversation with assistant's reply
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(
        functionArgs.location,
        functionArgs.unit
      );
      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        content: functionResponse,
        name: functionName, // TypeScript will ignore this, thanks to the assertion
      } as any);// extend conversation with function response
    }
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: messages,
    }); // get a new response from the model where it can see the function response
    return secondResponse.choices;
  }

  // Further logic to handle the conversation based on tool responses
}

runConversation().then(console.log).catch(console.error);