import { request } from '../requestWrapper';

/**
 * Projects, Proposals, and Recruitment API Service
 */
export const projectService = {
  /**
   * Lists all open project postings, supporting query filters
   * @param {Object} [params] - Query filters (e.g. search, skill, category)
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getProjects(params = {}) {
    return request.get('/projects', { params });
  },

  /**
   * Fetches detailed specifications and milestones for a project
   * @param {string} id - Project UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getProjectDetails(id) {
    return request.get(`/projects/${id}`);
  },

  /**
   * Creates a new project listing (Client role required)
   * @param {Object} projectData - Title, description, budgetMin, budgetMax
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async createProject(projectData) {
    return request.post('/projects', projectData);
  },

  /**
   * Submits a bidding proposal to an open project (Freelancer role required)
   * @param {Object} proposalData - projectId, coverLetter, bidAmount, timelineDays
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async submitProposal(proposalData) {
    return request.post('/proposals', proposalData);
  },

  /**
   * Fetches all proposals submitted by the authenticated freelancer
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getMyProposals() {
    return request.get('/proposals/mine');
  },

  /**
   * Invites a freelancer to submit a proposal for a project
   * @param {Object} invitationData - projectId, freelancerId
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async inviteFreelancer(invitationData) {
    return request.post('/invitations', invitationData);
  },

  /**
   * Fetches all project invitations received or sent by the user
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getMyInvitations() {
    return request.get('/invitations');
  },

  /**
   * Accepts or declines an received project invitation
   * @param {string} invitationId - Invitation UUID
   * @param {'ACCEPTED'|'REJECTED'} status - Acceptance response
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async respondToInvitation(invitationId, status) {
    return request.patch(`/invitations/${invitationId}/respond`, { status });
  },

  /**
   * Follows a client's project activity feed
   * @param {string} clientId - Client user UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async followClient(clientId) {
    return request.post(`/clients/${clientId}/follow`);
  },

  /**
   * Unfollows a client's feed
   * @param {string} clientId - Client user UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async unfollowClient(clientId) {
    return request.delete(`/clients/${clientId}/follow`);
  },

  /**
   * Retrieves all followers of a specific client profile
   * @param {string} clientId - Client user UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getClientFollowers(clientId) {
    return request.get(`/clients/${clientId}/followers`);
  }
};

export default projectService;
