import { request } from '../requestWrapper';

/**
 * Messages API Service
 */
export const messageService = {
  /**
   * Fetches all messages for a given contract
   * @param {string} contractId
   * @returns {Promise<{success: boolean, data: Message[], error: *}>}
   */
  async getMessages(contractId) {
    return request.get(`/messages/${contractId}`);
  },

  /**
   * Sends a text message, optionally with a file attachment
   * @param {string} contractId
   * @param {string} content
   * @param {File|null} file
   * @returns {Promise<{success: boolean, data: Message, error: *}>}
   */
  async sendMessage(contractId, content, file = null) {
    if (file) {
      const formData = new FormData();
      formData.append('contractId', contractId);
      formData.append('content', content);
      formData.append('attachment', file);
      return request.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return request.post('/messages', { contractId, content });
  },
};

/**
 * Contracts API Service
 */
export const contractService = {
  /**
   * Fetches all contracts for the current logged-in user
   * @returns {Promise<{success: boolean, data: Contract[], error: *}>}
   */
  async getMyContracts() {
    return request.get('/contracts/my');
  },

  async completeContract(contractId) {
    return request.patch(`/contracts/${contractId}/complete`);
  },

  async submitReview(contractId, rating, comment) {
    return request.post(`/contracts/${contractId}/review`, { rating, comment });
  },

  async approveMilestone(milestoneId) {
    return request.patch(`/milestones/${milestoneId}/approve`);
  },

  async requestRevision(milestoneId) {
    return request.patch(`/milestones/${milestoneId}/revision`);
  }
};

export default messageService;
