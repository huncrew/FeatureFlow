import axios from 'axios';

// Environment variables for the OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper function to make the API call to OpenAI
const callOpenAI = async (prompt: string, max_tokens: number) => {
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-4-0613', // Ensure this is the correct identifier for GPT-4
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

// The Lambda handler for optimizing an existing listing
export const handler = async (event) => {
  // Parse the input from the event body - the existing listing details
  const {
    title: existingTitle,
    description: existingDescription,
    tags: existingTags,
    image,
  } = JSON.parse(event.body);

  // SEO optimization prompt for the title and description
  const seoPrompt = `
    Analyze the following Etsy listing details and suggest a more SEO-optimized title and description that could improve search visibility and attractiveness:

    Current Title: ${existingTitle}
    Current Description: ${existingDescription}
    Current Tags: ${existingTags.join(', ')}
    Image Description: [A description of the image, if available]

    Suggest a better Title and Description:
  `;

  // SEO optimization prompt for tags
  const tagsPrompt = `
    Based on the improved title and description, suggest 13 SEO-friendly tags that could enhance the Etsy listing's search visibility and relevance:
  `;

  try {
    // Call OpenAI to optimize the title and description
    const optimizedTitleDescription = await callOpenAI(seoPrompt, 200);

    // Extract the title and description from the AI's response
    const optimizedParts = optimizedTitleDescription.split('\n');
    const optimizedTitle = optimizedParts[0];
    const optimizedDescription = optimizedParts.slice(1).join('\n');

    // Call OpenAI to generate the optimized tags based on the new title and description
    const combinedText = `${optimizedTitle}\n${optimizedDescription}`;
    const optimizedTags = await callOpenAI(`${tagsPrompt}\n${combinedText}`, 100);

    // Construct the response with the optimized listing details
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: optimizedTitle,
        description: optimizedDescription,
        tags: optimizedTags.split(',').map(tag => tag.trim()), // Assuming tags are comma-separated
      }),
    };

    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error optimizing listing' }),
    };
  }
};
