import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const offerService = {
  // Offer statistics
  getOfferStats: async (cafeId = null) => {
    const params = cafeId ? { cafeId } : {};
    const res = await axiosInstance.get(ENDPOINTS.offers.stats, { params });
    return res.data?.data || res.data;
  },

  // List all offers with optional filters
  getOffers: async (filters = {}) => {
    const res = await axiosInstance.get(ENDPOINTS.offers.list, { params: filters });
    return res.data?.data || res.data;
  },

  // Single offer detail
  getOfferById: async (id) => {
    const res = await axiosInstance.get(ENDPOINTS.offers.detail(id));
    return res.data?.data || res.data;
  },

  // Create offer
  createOffer: async (data) => {
    const res = await axiosInstance.post(ENDPOINTS.offers.create, data);
    return res.data?.data || res.data;
  },

  // Update offer
  updateOffer: async (id, data) => {
    const res = await axiosInstance.put(ENDPOINTS.offers.update(id), data);
    return res.data?.data || res.data;
  },

  // Delete offer
  deleteOffer: async (id) => {
    const res = await axiosInstance.delete(ENDPOINTS.offers.delete(id));
    return res.data?.data || res.data;
  },

  // Toggle offer active state
  updateOfferStatus: async (id, isActive) => {
    const res = await axiosInstance.patch(ENDPOINTS.offers.status(id), { isActive });
    return res.data?.data || res.data;
  }
};
