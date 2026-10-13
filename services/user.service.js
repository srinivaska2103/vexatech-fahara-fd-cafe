import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const userService = {
  getMe: async () => {
    const response = await axiosInstance.get(ENDPOINTS.users.me);
    return response.data;
  },

  updateOnboardingStatus: async (completed) => {
    const response = await axiosInstance.patch(ENDPOINTS.users.onboardingStatus, { completed });
    return response.data;
  },
};
