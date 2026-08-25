import { axiosInstance } from '@/lib/axios';

export const customerService = {
  // Get all customers (simulated owner perspective)
  getCustomers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/customers/owner', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] }; // Graceful fallback
      throw error;
    }
  },

  // Get single customer details
  getCustomerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/customers/owner/${id}`);
      return response.data;
    } catch (error) {
      // Simulate 404 fallback if backend isn't ready
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get customer bookings
  getCustomerBookings: async (id) => {
    try {
      const response = await axiosInstance.get(`/customers/owner/${id}/bookings`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get customer payments
  getCustomerPayments: async (id) => {
    try {
      const response = await axiosInstance.get(`/customers/owner/${id}/payments`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get customer reviews
  getCustomerReviews: async (id) => {
    try {
      const response = await axiosInstance.get(`/customers/owner/${id}/reviews`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get customer analytics
  getCustomerAnalytics: async () => {
    try {
      const response = await axiosInstance.get('/customers/owner/analytics');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Add private note
  addCustomerNote: async (customerId, data) => {
    const response = await axiosInstance.post(`/customers/owner/${customerId}/notes`, data);
    return response.data;
  },

  // Update private note
  updateCustomerNote: async (customerId, noteId, data) => {
    const response = await axiosInstance.put(`/customers/owner/${customerId}/notes/${noteId}`, data);
    return response.data;
  },

  // Delete private note
  deleteCustomerNote: async (customerId, noteId) => {
    const response = await axiosInstance.delete(`/customers/owner/${customerId}/notes/${noteId}`);
    return response.data;
  },

  // Mark as VIP
  markCustomerVIP: async (customerId) => {
    const response = await axiosInstance.post(`/customers/owner/${customerId}/vip`);
    return response.data;
  },

  // Remove VIP status
  removeCustomerVIP: async (customerId) => {
    const response = await axiosInstance.delete(`/customers/owner/${customerId}/vip`);
    return response.data;
  },

  // Block customer
  blockCustomer: async (customerId, data) => {
    const response = await axiosInstance.post(`/customers/owner/${customerId}/block`, data);
    return response.data;
  },

  // Unblock customer
  unblockCustomer: async (customerId) => {
    const response = await axiosInstance.post(`/customers/owner/${customerId}/unblock`);
    return response.data;
  }
};
