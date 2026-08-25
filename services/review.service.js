import { axiosInstance } from '@/lib/axios';

export const reviewService = {
  // Get all reviews for the cafe owner's cafes
  getReviews: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/reviews/owner', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] }; // Graceful fallback since backend endpoint is missing
      }
      throw error;
    }
  },

  // Get a single review by ID
  getReviewById: async (id) => {
    const response = await axiosInstance.get(`/reviews/${id}`);
    return response.data;
  },

  // Reply to a review
  replyToReview: async (id, data) => {
    const response = await axiosInstance.post(`/reviews/${id}/reply`, data);
    return response.data;
  },

  // Update an existing reply
  updateReply: async (id, data) => {
    const response = await axiosInstance.put(`/reviews/${id}/reply`, data);
    return response.data;
  },

  // Delete a reply
  deleteReply: async (id) => {
    const response = await axiosInstance.delete(`/reviews/${id}/reply`);
    return response.data;
  },

  // Get review analytics for the dashboard
  getReviewAnalytics: async () => {
    try {
      const response = await axiosInstance.get('/reviews/owner/analytics');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },
  
  // Get rating summary
  getRatingSummary: async () => {
    try {
      const response = await axiosInstance.get('/reviews/owner/summary');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  }
};
