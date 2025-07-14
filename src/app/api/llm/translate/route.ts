import { GoogleGenAI } from '@google/genai'; // Import GenerativeModel and safety enums
import { NextRequest } from 'next/server';

// Import the English source content directly
// This line is crucial, as you stated sourceContent always comes from this file.
import { jsonSchema } from '@/types/locales';
import enSourceContent from '../../../../i18n/locales/en.json';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    return new Response('GENAI_API_KEY is not set in environment variables', { status: 500 });
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  try {
    const body = await request.json();
    const { targetLanguage } = body; // Only targetLanguage is expected from the request body

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return new Response('Missing or invalid targetLanguage in request body', { status: 400 });
    }

    // Use the imported source content
    const sourceContentToTranslate = enSourceContent;

    const prompt = `You are a highly accurate and precise translator.

      Your task is to translate only the string values at these keys in the provided JSON:

      - HomePage: translate the values of "title" and "subtitle".
      - Categories: translate all string values.
      - LocaleLayout: translate the values of "title" and "description".
      - Phrases: for each phrase group (e.g., "greetings", "hotel"), translate:
        - the value of "title"
        - the "base" field inside each item in the "items" array

      Maintain the exact JSON structure, keys, and numeric IDs unchanged.

      Only translate the string values at the above keys.

      The translation should be in the target language: ${targetLanguage}

      Here is the JSON to translate:
      ${JSON.stringify(sourceContentToTranslate, null, 2)}

    `;

    const response = await ai.models.generateContent({ // Use 'model' variable here
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      model: "gemini-2.5-flash",
      config: {
        responseJsonSchema: jsonSchema
      }
    });

    let translatedContentString = response.text;

    translatedContentString = translatedContentString?.trim()
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '');

    if (!translatedContentString) {
      return new Response('Translation failed: No response from model.', { status: 500 });
    }

    let parsedTranslatedContent;
    try {
      parsedTranslatedContent = JSON.parse(translatedContentString);
    } catch (parseError) {
      console.error('Failed to parse translated JSON:', translatedContentString, parseError);
      return new Response('Error: Model returned invalid JSON.', { status: 500 });
    }

    return new Response(JSON.stringify(parsedTranslatedContent), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Translation error:', error); // Log the full error for debugging
      return new Response(`Translation failed: ${error.message}`, { status: 500 });
    }
    console.error('Unknown error during translation:', error);
    return new Response('An unknown error occurred during translation.', { status: 500 });
  }
}