/**
 * Mock fallbacks in case of AI failures
 */

export const mockPortfolioReview = {
  original: "",
  improved: "This is a placeholder improved portfolio text.",
  suggestions: ["Add more metrics."]
};

export const mockProposalEvaluation = {
  relevance: 50,
  clarity: 50,
  budget_fit: 50,
  timeline_confidence: 50,
  overall_score: 50,
  red_flags: ["Could not reach AI"],
  strengths: []
};

export const mockQuestion = {
  question: "What is a mock question?",
  options: ["A", "B", "C", "D"],
  correctIndex: 0,
  explanation: "This is a mock fallback.",
  difficulty: "easy"
};
