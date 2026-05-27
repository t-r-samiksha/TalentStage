import { ZodSchema } from 'zod';

/**
 * Strips markdown formatting and parses raw string into a typed object validated by Zod.
 * @param raw - The raw JSON string (potentially wrapped in markdown backticks)
 * @param schema - The Zod schema to validate against
 * @returns The validated and typed object
 */
export function parseAIJson<T>(raw: string, schema: ZodSchema<T>): T {
  // Strip markdown code fences
  let cleanString = raw.trim();
  if (cleanString.startsWith('```json')) {
    cleanString = cleanString.replace(/^```json\s*/, '');
  }
  if (cleanString.startsWith('```')) {
    cleanString = cleanString.replace(/^```\s*/, '');
  }
  if (cleanString.endsWith('```')) {
    cleanString = cleanString.replace(/\s*```$/, '');
  }

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
