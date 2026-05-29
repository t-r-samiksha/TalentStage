import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export let lastLatencyMs = 0;

/**
 * Calls the Gemini API with the given prompt and optional system prompt.
 * Uses gemini-2.5-flash model and includes retry logic with exponential backoff.
 * @param prompt - The user prompt to send to Gemini
 * @param systemPrompt - Optional system instruction
 * @returns The generated text response
 */
export async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const client = getGenAI();
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    ...(systemPrompt && { systemInstruction: systemPrompt }),
  });

  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const startTime = Date.now();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      lastLatencyMs = Date.now() - startTime;
      
      return response.text();
    } catch (error) {
      retries--;
      if (retries === 0) {
        throw new Error(`Gemini API call failed after 3 retries: ${error}`);
      }
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error('Unexpected error in callGemini');
}
