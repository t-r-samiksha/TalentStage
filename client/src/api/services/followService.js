import { request } from '../requestWrapper';

export const followService = {
  async followClient(clientId) {
    return request.post(`/clients/${clientId}/follow`);
  },

  async unfollowClient(clientId) {
    return request.delete(`/clients/${clientId}/follow`);
  },

  async getClientFollowers(clientId) {
    return request.get(`/clients/${clientId}/followers`);
  }
};

export default followService;
