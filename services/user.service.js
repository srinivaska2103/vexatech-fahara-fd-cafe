import { axiosInstance } from '../lib/axios';

export const userService = {
  getMe: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  updateOnboardingStatus: async (completed) => {
    const response = await axiosInstance.patch('/users/onboarding-status', { completed });
    return response.data;
  },
};
