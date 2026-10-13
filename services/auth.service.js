import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.auth.register, data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.auth.verifyOtp, data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.auth.login, { ...data, expectedRole: 'PARTNER' });
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.auth.forgotPassword, { ...data, expectedRole: 'PARTNER' });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.auth.resetPassword, data);
    return response.data;
  },

  logout: async () => {
    // Optionally call backend logout endpoint if needed
  }
};
