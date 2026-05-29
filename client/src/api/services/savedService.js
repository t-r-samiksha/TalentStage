import { request } from '../requestWrapper';

export const savedService = {
  async saveFreelancer(freelancerId) {
    return request.post('/saved-freelancers', { freelancerId });
  },

  async removeSavedFreelancer(freelancerId) {
    return request.delete(`/saved-freelancers/${freelancerId}`);
  },

  async getSavedFreelancers() {
    return request.get('/saved-freelancers');
  }
};

export default savedService;
