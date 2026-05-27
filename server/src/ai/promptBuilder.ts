/**
 * Builds the prompt for the portfolio reviewer AI.
 * @param text - The original portfolio text
 * @returns The prompt string
 */
export function buildPortfolioReviewPrompt(text: string): string {
  return `Please review the following portfolio text. Return ONLY a JSON object containing the original text, an improved version (professionally rewritten with measurable impact, quantified results, and strong action verbs), and an array of suggestions.
  
Original text:
"""
${text}
"""

Expected JSON format:
{
  "original": "<original text>",
  "improved": "<professionally rewritten version>",
  "suggestions": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;
}

/**
 * Builds the prompt for the proposal evaluator AI.
 * @param params - Project and proposal details
 * @returns The prompt string
 */
export function buildProposalEvaluationPrompt(params: {
  projectDescription: string;
  proposalText: string;
  bidAmount: number;
  timelineDays: number;
  projectBudgetMin: number;
  projectBudgetMax: number;
}): string {
  return `Evaluate this freelancer proposal for a project. Return ONLY a JSON object with scores from 0-100 for relevance, clarity, budget_fit, timeline_confidence, overall_score, and arrays of strings for red_flags and strengths.

Project Description: ${params.projectDescription}
Project Budget: ${params.projectBudgetMin} - ${params.projectBudgetMax}

Proposal Text: ${params.proposalText}
Bid Amount: ${params.bidAmount}
Timeline (days): ${params.timelineDays}

Expected JSON format:
{
  "relevance": 92,
  "clarity": 81,
  "budget_fit": 70,
  "timeline_confidence": 85,
  "overall_score": 82,
  "red_flags": ["<flag>"],
  "strengths": ["<strength>"]
}`;
}

/**
 * Builds the prompt for the match engine AI rerank.
 * @param projectDescription - The project description
 * @param freelancers - Array of top 5 freelancers
 * @returns The prompt string
 */
export function buildMatchRerankPrompt(
  projectDescription: string,
  freelancers: { id: string; portfolioSummary: string }[]
): string {
  return `Review these top 5 freelancer portfolios for the given project. Rerank them and provide a portfolio score (0-100) and reasoning for each. Return ONLY a JSON object.

Project Description: ${projectDescription}

Freelancers:
${JSON.stringify(freelancers, null, 2)}

Expected JSON format:
{
  "ranked": [
    {
      "id": "string",
      "matchPercent": 91,
      "portfolioScore": 78,
      "aiReason": "<reason>"
    }
  ]
}`;
}

/**
 * Builds the prompt for generating an adaptive skill test question.
 * @param skill - The skill to test
 * @param difficulty - The difficulty level
 * @param previousQuestions - Questions already asked
 * @returns The prompt string
 */
export function buildQuestionGenerationPrompt(
  skill: string,
  difficulty: string,
  previousQuestions: string[]
): string {
  return `Generate a multiple-choice question for testing a developer's knowledge in ${skill} at a ${difficulty} level.
Do NOT repeat any of the following questions: ${JSON.stringify(previousQuestions)}

Return ONLY a JSON object in this format:
{
  "question": "<question text>",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 2,
  "explanation": "<why this is correct>",
  "difficulty": "${difficulty}"
}`;
}
