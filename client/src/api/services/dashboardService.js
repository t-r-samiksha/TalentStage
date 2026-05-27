import { request } from '../requestWrapper';

/**
 * Escrow, Ledger, Chat, and Workspace Dashboard API Service
 */
export const dashboardService = {
  /**
   * Compiles the freelancer dashboard telemetry metrics and lists
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getFreelancerDashboard() {
    return request.get('/dashboard/freelancer');
  },

  /**
   * Compiles the client workspace metrics, aggregates, and posted listings
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getClientDashboard() {
    return request.get('/dashboard/client');
  },

  /**
   * Fetches ledger account balances, payouts, and transaction audit trails
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getWalletBalance() {
    return request.get('/ledger/wallet');
  },

  /**
   * Retrieves active contract workspaces for the user (as either client or freelancer)
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getMyContracts() {
    return request.get('/contracts/my');
  },

  /**
   * Retrieves full details, status, and milestone structures of a contract
   * @param {string} contractId - Contract UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getContractDetails(contractId) {
    return request.get(`/contracts/${contractId}`);
  },

  /**
   * Initiates a binding contract workspace, locking initial budget in Escrow
   * @param {Object} hireData - projectId, freelancerId, proposalId, milestones list
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async hireFreelancer(hireData) {
    return request.post('/contracts/hire', hireData);
  },

  /**
   * Fetches all milestones configured under a contract
   * @param {string} contractId - Contract UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getContractMilestones(contractId) {
    return request.get(`/milestones/contract/${contractId}`);
  },

  /**
   * Submits files and attestation descriptions for a milestone review
   * Supports file upload via Multipart FormData
   * @param {string} id - Milestone UUID
   * @param {string} submissionText - Text description of deliverables
   * @param {File} [file] - Optional attachment file (zip, doc, image)
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async submitMilestone(id, submissionText, file = null) {
    const formData = new FormData();
    formData.append('submissionText', submissionText);
    if (file) {
      formData.append('file', file);
    }

    return request.patch(`/milestones/${id}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Approves a milestone's work, executing a transfer of locked funds
   * @param {string} id - Milestone UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async approveMilestone(id) {
    return request.patch(`/milestones/${id}/approve`);
  },

  /**
   * Rejects milestone work, reverting status to revision requested with feedback
   * @param {string} id - Milestone UUID
   * @param {string} revisionNotes - Rejection reasons
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async requestMilestoneRevision(id, revisionNotes) {
    return request.patch(`/milestones/${id}/revision`, { revisionNotes });
  },

  /**
   * Dispatches a message inside an active contract workspace chat tunnel
   * Supports optional attachment uploads
   * @param {string} contractId - Contract UUID
   * @param {string} content - Message text
   * @param {File} [attachmentFile] - Optional attachment file upload
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async sendMessage(contractId, content, attachmentFile = null) {
    const formData = new FormData();
    formData.append('contractId', contractId);
    formData.append('content', content);
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }

    return request.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Retrieves the full chronological message log inside a contract chat room
   * @param {string} contractId - Contract UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getMessages(contractId) {
    return request.get(`/messages/${contractId}`);
  }
};

export default dashboardService;
