import apiClient from './apiClient';

/**
 * Reusable HTTP Request Wrapper
 * Simplifies api requests by encapsulating try/catch logs and returning a standardized 
 * { success, data, error } tuple. This eliminates boilerplate try/catch structures 
 * inside UI component event handlers.
 */
export const request = {
  /**
   * Performs an HTTP GET request
   * @param {string} url - Target URL path
   * @param {Object} [config] - Optional Axios request configuration
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>} Request outcome tuple
   */
  async get(url, config = {}) {
    try {
      const response = await apiClient.get(url, config);
      return {
        success: true,
        data: response.data?.data !== undefined ? response.data.data : response.data,
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error };
    }
  },

  /**
   * Performs an HTTP POST request
   * @param {string} url - Target URL path
   * @param {Object} [data] - JSON request payload body
   * @param {Object} [config] - Optional Axios request configuration
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>} Request outcome tuple
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await apiClient.post(url, data, config);
      return {
        success: true,
        data: response.data?.data !== undefined ? response.data.data : response.data,
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error };
    }
  },

  /**
   * Performs an HTTP PUT request
   * @param {string} url - Target URL path
   * @param {Object} [data] - JSON request payload body
   * @param {Object} [config] - Optional Axios request configuration
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>} Request outcome tuple
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await apiClient.put(url, data, config);
      return {
        success: true,
        data: response.data?.data !== undefined ? response.data.data : response.data,
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error };
    }
  },

  /**
   * Performs an HTTP PATCH request
   * @param {string} url - Target URL path
   * @param {Object} [data] - JSON request payload body
   * @param {Object} [config] - Optional Axios request configuration
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>} Request outcome tuple
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await apiClient.patch(url, data, config);
      return {
        success: true,
        data: response.data?.data !== undefined ? response.data.data : response.data,
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error };
    }
  },

  /**
   * Performs an HTTP DELETE request
   * @param {string} url - Target URL path
   * @param {Object} [config] - Optional Axios request configuration
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>} Request outcome tuple
   */
  async delete(url, config = {}) {
    try {
      const response = await apiClient.delete(url, config);
      return {
        success: true,
        data: response.data?.data !== undefined ? response.data.data : response.data,
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error };
    }
  }
};

export default request;
