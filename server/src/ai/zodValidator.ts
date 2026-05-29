import { ZodSchema } from 'zod';

/**
 * Strips markdown formatting and parses raw string into a typed object validated by Zod.
 * Protects against malformed LLM outputs (e.g. conversational wrapping, trailing commas).
 * @param raw - The raw JSON string (potentially wrapped in markdown backticks or conversational text)
 * @param schema - The Zod schema to validate against
 * @returns The validated and typed object
 */
export function parseAIJson<T>(raw: string, schema: ZodSchema<T>): T {
  let cleanString = raw.trim();

  // 1. Extract JSON block from markdown code fences if present
  const jsonFenceRegex = /```json([\s\S]*?)```/;
  const match = cleanString.match(jsonFenceRegex);
  if (match) {
    cleanString = match[1].trim();
  } else {
    // try fallback generic code fences
    const genericFenceRegex = /```([\s\S]*?)```/;
    const fallbackMatch = cleanString.match(genericFenceRegex);
    if (fallbackMatch) {
      cleanString = fallbackMatch[1].trim();
    }
  }

  // 2. Extract substring between the first '{' or '[' and the last '}' or ']'
  const firstBrace = cleanString.search(/[{[]/);
  const lastBrace = Math.max(cleanString.lastIndexOf('}'), cleanString.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    // If there is conversational text before or after, extract the exact JSON boundary
    if (firstBrace > 0 || lastBrace < cleanString.length - 1) {
      const candidate = cleanString.slice(firstBrace, lastBrace + 1);
      // Verify if it can be parsed before overriding cleanString
      try {
        JSON.parse(candidate);
        cleanString = candidate;
      } catch (e) {
        // Fallback: only use candidate if it doesn't break parsing, otherwise keep cleanString as is
      }
    }
  }

  // 3. Remove potential trailing commas before closing braces/brackets (common LLM error)
  // e.g. [1, 2, ] -> [1, 2] or { "a": 1, } -> { "a": 1 }
  cleanString = cleanString.replace(/,\s*([}\]])/g, '$1');

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanString);
  } catch (error) {
    throw new Error(`Failed to parse JSON string: ${(error as Error).message}\nRaw string: ${raw}`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Zod validation failed: ${result.error.message}`);
  }

  return result.data;
}
