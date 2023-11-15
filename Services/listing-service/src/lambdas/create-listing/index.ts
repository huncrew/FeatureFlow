import axios from 'axios';

// Environment variables for the OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper function to make the API call to OpenAI
const callOpenAI = async (prompt: string, max_tokens: number) => {
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-4-0613', // Updated to use GPT-4
      prompt,
      temperature: 0.7,
      max_tokens,
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return openaiResponse.data.choices[0].text.trim();
};

// The Lambda handler
export const handler = async (event) => {
  // Parse the input from the event body
  const {
    category,
    materialAndProcess,
    dimensions,
    intendedUse,
    uniqueFeatures,
  } = JSON.parse(event.body);

  // Create a prompt for the title and description
  const titleDescriptionPrompt = `
    Create an engaging title and description for an Etsy listing based on the following details:
    Category: ${category}
    Material and Making Process: ${materialAndProcess}
    Dimensions and Physical Attributes: ${dimensions}
    Intended Use or Target Audience: ${intendedUse}
    Unique Features or Selling Points: ${uniqueFeatures}

    Title:
  `;

  // Create a prompt for the tags
  const tagsPrompt = `
    Generate 13 SEO-friendly tags for an Etsy listing based on the following details:
    Category: ${category}
    Material and Making Process: ${materialAndProcess}
    Dimensions and Physical Attributes: ${dimensions}
    Intended Use or Target Audience: ${intendedUse}
    Unique Features or Selling Points: ${uniqueFeatures}
  `;

  try {
    // Call OpenAI to generate the title and description
    const titleDescription = await callOpenAI(titleDescriptionPrompt, 150);

    // Call OpenAI to generate the tags
    const tags = await callOpenAI(tagsPrompt, 60);

    // Split the title and description based on a delimiter if necessary
    // For example, you might choose to have the AI include "Title: ..." in the response
    const title = titleDescription.split('\n')[0];
    const description = titleDescription.split('\n').slice(1).join('\n');

    // Construct the response
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()), // Assuming tags are comma-separated
      }),
    };

    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating text' }),
    };
  }
};
