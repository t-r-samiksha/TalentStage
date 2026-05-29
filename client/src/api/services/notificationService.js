import { request } from '../requestWrapper';

/**
 * Notifications API Service
 * Handles user-focused system alert notifications, read markers, and bulk updates.
 */
export const notificationService = {
  /**
   * Fetches all alert notifications belonging to the logged-in user
   * @returns {Promise<{success: boolean, data: Array, error: Object|null}>}
   */
  async getMyNotifications() {
    return request.get('/notifications/mine');
  },

  /**
   * Marks a specific notification as read in the database
   * @param {string} id - The Notification UUID
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async markAsRead(id) {
    return request.patch(`/notifications/${id}/read`);
  },

  /**
   * Marks all of the user's unread notifications as read
   * @returns {Promise<{success: boolean, data: *, error: Object|null}>}
   */
  async markAllAsRead() {
    return request.patch('/notifications/read-all');
  }
};

export default notificationService;
