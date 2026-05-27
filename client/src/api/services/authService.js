import { request } from '../requestWrapper';
import authStorage from '../authStorage';

/**
 * Authentication and Profile API Service
 */
export const authService = {
  /**
   * Logs in a user, saving their credentials and token in persistent storage on success
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async login(email, password) {
    const result = await request.post('/auth/login', { email, password });
    if (result.success && result.data) {
      const { token, user } = result.data;
      authStorage.setToken(token);
      authStorage.setUser(user);
    }
    return result;
  },

  /**
   * Registers a new user account (role can be CLIENT, FREELANCER, or BOTH)
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async signup(email, password, role) {
    return request.post('/auth/signup', { email, password, role });
  },

  /**
   * Logs the current user out, deleting local authentication records
   */
  logout() {
    authStorage.clearAuth();
    window.dispatchEvent(new CustomEvent('talentstage-logout'));
  },

  /**
   * Fetches the current logged-in user's profile and synchronizes it with auth storage
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async getProfile() {
    const result = await request.get('/profile/me');
    if (result.success && result.data) {
      // Sync fresh user data back to localStorage
      authStorage.setUser(result.data);
    }
    return result;
  },

  /**
   * Updates standard profile details (full name, bio, avatar)
   * @param {Object} profileData - Profile updates
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async updateProfile(profileData) {
    return request.patch('/profile/me', profileData);
  },

  /**
   * Updates freelancer specific configurations (hourly rates, skills, portfolio)
   * @param {Object} freelancerData - Freelancer profile details
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async updateFreelancerProfile(freelancerData) {
    return request.patch('/profile/freelancer', freelancerData);
  },

  /**
   * Links a core skill to the freelancer profile
   * @param {string} skillId - The skill identifier
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async addSkill(skillId) {
    return request.post('/profile/skills', { skillId });
  }
};

export default authService;
