import { axiosInstance } from '@/lib/axios';

export const availabilityService = {
  // Get cafe availability blocks, bookings and operating hours
  getAvailability: async (cafeId, fromOrParams, to) => {
    let params = {};
    if (fromOrParams && typeof fromOrParams === 'object') {
      params = fromOrParams;
    } else {
      if (fromOrParams) params.from = fromOrParams;
      if (to) params.to = to;
    }
    const response = await axiosInstance.get(`/cafes/${cafeId}/availability`, { params });
    return response.data;
  },

  // Get availability summary for today and upcoming 30 days
  getAvailabilitySummary: async (cafeId) => {
    const response = await axiosInstance.get(`/cafes/${cafeId}/availability/summary`);
    return response.data;
  },

  // Create a new availability block
  createBlock: async (cafeId, blockData) => {
    const response = await axiosInstance.post(`/cafes/${cafeId}/availability/blocks`, blockData);
    return response.data;
  },

  // Update an existing availability block
  updateBlock: async (cafeId, blockId, blockData) => {
    const response = await axiosInstance.patch(`/cafes/${cafeId}/availability/blocks/${blockId}`, blockData);
    return response.data;
  },

  // Delete an availability block
  deleteBlock: async (cafeId, blockId) => {
    const response = await axiosInstance.delete(`/cafes/${cafeId}/availability/blocks/${blockId}`);
    return response.data;
  }
};
