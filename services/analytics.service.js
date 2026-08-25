import { axiosInstance } from '@/lib/axios';

export const analyticsService = {
  // Get overview dashboard analytics
  getDashboardAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/dashboard/summary', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get revenue specific analytics
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get booking specific analytics
  getBookingAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/analytics/bookings', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get customer specific analytics
  getCustomerAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/analytics/customers', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get event specific analytics
  getEventAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/analytics/events', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get occupancy analytics
  getOccupancyAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/analytics/occupancy', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  }
};
