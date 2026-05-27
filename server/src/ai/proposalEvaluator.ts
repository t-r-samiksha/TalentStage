import { z } from 'zod';
import { callGemini } from './geminiClient';
import { parseAIJson } from './zodValidator';
import { buildProposalEvaluationPrompt } from './promptBuilder';

export const ProposalEvaluationSchema = z.object({
  relevance: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  budget_fit: z.number().min(0).max(100),
  timeline_confidence: z.number().min(0).max(100),
  overall_score: z.number().min(0).max(100),
  red_flags: z.array(z.string()),
  strengths: z.array(z.string()),
});

export type ProposalEvaluationResult = z.infer<typeof ProposalEvaluationSchema>;

export interface ProposalEvaluationParams {
  projectDescription: string;
  proposalText: string;
  bidAmount: number;
  timelineDays: number;
  projectBudgetMin: number;
  projectBudgetMax: number;
}

/**
 * Evaluates a freelancer proposal using AI.
 * @param params - Project and proposal details
 * @returns The evaluation scores and feedback
 */
export async function evaluateProposal(params: ProposalEvaluationParams): Promise<ProposalEvaluationResult> {
  const prompt = buildProposalEvaluationPrompt(params);
  const rawResponse = await callGemini(prompt, "You are an expert freelance project manager evaluating proposals.");
  return parseAIJson(rawResponse, ProposalEvaluationSchema);
}
