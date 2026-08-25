import { axiosInstance } from '@/lib/axios';

export const settingsService = {
  // Business Profile
  getBusinessProfile: async () => {
    try {
      const response = await axiosInstance.get('/settings/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },
  updateBusinessProfile: async (data) => {
    const response = await axiosInstance.put('/settings/profile', data);
    return response.data;
  },

  // Branches
  getBranches: async () => {
    try {
      const response = await axiosInstance.get('/settings/branches');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },
  createBranch: async (data) => {
    const response = await axiosInstance.post('/settings/branches', data);
    return response.data;
  },

  // Team
  getTeamMembers: async () => {
    try {
      const response = await axiosInstance.get('/settings/team');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Security
  changePassword: async (data) => {
    const response = await axiosInstance.post('/settings/security/password', data);
    return response.data;
  },
  
  // Settings groupings
  getBookingSettings: async () => {
    try {
      const response = await axiosInstance.get('/settings/booking');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },
  updateBookingSettings: async (data) => {
    const response = await axiosInstance.put('/settings/booking', data);
    return response.data;
  },

  // Account Deletion
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/settings/account');
    return response.data;
  }
};
