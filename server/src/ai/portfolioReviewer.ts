import { z } from 'zod';
import { callGemini } from './geminiClient';
import { parseAIJson } from './zodValidator';
import { buildPortfolioReviewPrompt } from './promptBuilder';

export const PortfolioReviewSchema = z.object({
  original: z.string(),
  improved: z.string(),
  suggestions: z.array(z.string()),
});

export type PortfolioReviewResult = z.infer<typeof PortfolioReviewSchema>;

/**
 * Reviews a portfolio text using AI and returns an improved version with suggestions.
 * @param text - The original portfolio text
 * @returns The reviewed portfolio result
 */
export async function reviewPortfolio(text: string): Promise<PortfolioReviewResult> {
  const prompt = buildPortfolioReviewPrompt(text);
  const rawResponse = await callGemini(prompt, "You are an expert technical recruiter and resume reviewer.");
  return parseAIJson(rawResponse, PortfolioReviewSchema);
}
