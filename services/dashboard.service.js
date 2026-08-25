import { axiosInstance } from '../lib/axios';

export const dashboardService = {
  getSummary: async () => {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
  },

  getRevenueStats: async (period = 'month') => {
    const response = await axiosInstance.get(`/dashboard/revenue?period=${period}`);
    return response.data;
  },

  getRecentBookings: async () => {
    const response = await axiosInstance.get('/dashboard/recent-bookings');
    return response.data;
  },

  getUpcomingBookings: async () => {
    const response = await axiosInstance.get('/dashboard/upcoming-bookings');
    return response.data;
  },

  getRecentReviews: async () => {
    const response = await axiosInstance.get('/dashboard/recent-reviews');
    return response.data;
  },

  getActivityTimeline: async () => {
    const response = await axiosInstance.get('/dashboard/activity');
    return response.data;
  }
};
