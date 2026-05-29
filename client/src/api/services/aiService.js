import { request } from '../requestWrapper';

/**
 * Gemini AI API Services
 * Handles connections to the unmounted/mounted Gemini AI routes on the backend.
 * Provides on-the-fly technical portfolio auditing, bid evaluation/optimization,
 * developer compatibility scoring, and adaptive attestation question generation.
 */
export const aiService = {
  /**
   * Generates a project description, deliverables, milestones, recommended skills, and risks based on input parameters.
   * @param {Object} data - Project input options
   * @param {string} data.title - Project title
   * @param {string[]} data.skills - Chosen/required skills
   * @param {number} data.budgetMin - Minimum budget
   * @param {number} data.budgetMax - Maximum budget
   * @param {string} data.deadline - Project deadline description
   * @param {string} data.billingModel - Project billing model ('fixed' | 'hourly')
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async generateBrief(data) {
    return request.post('/ai/generate-brief', data);
  },

  /**
   * Evaluates text portfolios or GitHub data repositories using Gemini AI,
   * returning code quality, tech stack, and risk metrics.
   * @param {string} text - Raw biography or portfolio list
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async reviewPortfolio(text) {
    return request.post('/ai/review-portfolio', { text });
  },

  /**
   * Reviews and optimizes a freelancer proposal against a target job listing description
   * @param {Object} data - Proposal evaluation factors
   * @param {string} data.projectDescription - Technical contract scope
   * @param {string} data.proposalText - The developer's proposal cover letter
   * @param {number} data.bidAmount - Financial bid amount
   * @param {number} data.timelineDays - Estimated delivery timeline in days
   * @param {number} [data.projectBudgetMin] - Client minimum budget limit
   * @param {number} [data.projectBudgetMax] - Client maximum budget limit
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async evaluateProposal(data) {
    return request.post('/ai/evaluate-proposal', data);
  },

  /**
   * Scores and ranks available freelancers against a target contract scope brief
   * @param {Object} data - Matching parameters
   * @param {string} data.projectDescription - Technical contract scope
   * @param {string[]} data.projectSkills - Required skill tags
   * @param {number} data.projectBudgetMin - Budget min limit
   * @param {number} data.projectBudgetMax - Budget max limit
   * @param {Array<Object>} data.freelancers - Array of freelancer profiles to grade
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async matchFreelancers(data) {
    return request.post('/ai/match', data);
  },

  /**
   * Generates a dynamic, adaptive technical question based on a developer's current skill and level
   * @param {string} skill - The core skill category being tested (e.g. Solidity, React)
   * @param {'easy'|'medium'|'hard'} difficulty - Target difficulty level
   * @param {string[]} [previousQuestions] - List of previous question strings to avoid duplicates
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async generateQuestion(skill, difficulty, previousQuestions = []) {
    return request.post('/ai/generate-question', {
      skill,
      difficulty,
      previousQuestions
    });
  },

  /**
   * Processes answers during a dynamic test and adjusts the FSM score/difficulty accordingly
   * @param {Object} data - Answer submittal parameters
   * @param {string} data.skill - Tested skill
   * @param {'easy'|'medium'|'hard'} data.difficulty - Question difficulty
   * @param {boolean} data.isCorrect - True if user answered correctly
   * @param {number} data.currentScore - Accumulated test score
   * @param {number} data.questionsAnswered - Number of questions answered
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async submitAnswer(data) {
    return request.post('/ai/submit-answer', data);
  },

  /**
   * Fetches final graded results, feedback summaries, and attestation scores
   * @param {string} skill - Graded skill category
   * @param {number} score - Cumulative test score
   * @param {number} questionsAnswered - Tested questions count
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getSkillResult(skill, score, questionsAnswered) {
    return request.get('/skills/result', {
      params: { skill, score, questionsAnswered }
    });
  }
};

export default aiService;
