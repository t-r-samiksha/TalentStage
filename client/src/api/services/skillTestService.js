import { request } from '../requestWrapper';

/**
 * Standard Skill Attestation and Testing API Service
 * Handles standard (non-AI direct) database-backed skill tests and question evaluations.
 */
export const skillTestService = {
  /**
   * Initializes a skill verification test room
   * @param {string} skillName - Core skill name (e.g. 'React', 'Node')
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async startTest(skillName) {
    return request.post('/skills/test/start', { skillName });
  },

  /**
   * Submits an answer to a specific test question and receives grade feedback
   * @param {Object} data - Answer payload
   * @param {string} data.skillTestId - The active test room UUID
   * @param {string} data.questionId - The active question UUID
   * @param {string} data.answer - The user's selected option text
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async submitAnswer(data) {
    return request.post('/skills/test/answer', data);
  },

  /**
   * Retrieves final grading reports and updates UserSkill verified status in Prisma
   * @param {string} testId - SkillTest room UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getTestResult(testId) {
    return request.get(`/skills/test/result/${testId}`);
  }
};

export default skillTestService;
