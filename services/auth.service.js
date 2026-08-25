import { axiosInstance } from '../lib/axios';

export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosInstance.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', { ...data, expectedRole: 'PARTNER' });
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await axiosInstance.post('/auth/forgot-password', { ...data, expectedRole: 'PARTNER' });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  logout: async () => {
    // Optionally call backend logout endpoint if needed
    // const response = await axiosInstance.post('/auth/logout');
    // return response.data;
  }
};
