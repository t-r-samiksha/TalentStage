/**
 * Auth Storage Utilities
 * Provides persistent storage functions for JWT authentication tokens and user information
 * in localStorage, ensuring persistent login sessions across page refreshes.
 */

const TOKEN_KEY = 'talentstage_auth_token';
const USER_KEY = 'talentstage_user_data';

export const authStorage = {
  /**
   * Retrieves the stored JWT authentication token
   * @returns {string|null} The active token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Persists the JWT authentication token
   * @param {string} token - The raw JWT token from response
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Deletes the stored JWT token
   */
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Retrieves the parsed user profile object
   * @returns {Object|null} The stored user profile or null
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
      this.clearUser();
      return null;
    }
  },

  /**
   * Persists the user metadata object
   * @param {Object} user - User metadata object (id, email, role, profile detail)
   */
  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Deletes the stored user profile metadata
   */
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Completely clears user credentials (logs out)
   */
  clearAuth() {
    this.clearToken();
    this.clearUser();
  },

  /**
   * Quick status check verifying if user token exists
   * @returns {boolean} True if token exists
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authStorage;
