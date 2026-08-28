import { axiosInstance } from '@/lib/axios';

export const paymentService = {
  // Get all payments with filtering
  getPayments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get single payment details
  getPaymentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/payments/owner/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get Cashfree Payment Account Verification status & bank details
  getPaymentAccount: async () => {
    const response = await axiosInstance.get('/payments/owner/payment-account');
    return response.data;
  },

  // Save / Update Bank Details & Verify Account
  updatePaymentAccount: async (data, cafeId) => {
    const url = cafeId ? `/cafes/${cafeId}/payment-account` : '/payments/owner/payment-account';
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  // Get Settlements
  getSettlements: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner/settlements', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Sync Razorpay Settlements
  syncSettlements: async (params = {}) => {
    const response = await axiosInstance.post('/payments/owner/settlements/sync', {}, { params });
    return response.data;
  },

  // Get single Settlement by ID
  getSettlementById: async (id) => {
    try {
      const response = await axiosInstance.get(`/payments/owner/settlements/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Get Refunds
  getRefunds: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner/refunds', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get Invoices
  getInvoices: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner/invoices', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Download Invoice (simulated via Blob)
  downloadInvoice: async (id) => {
    try {
      const response = await axiosInstance.get(`/payments/owner/invoices/${id}/download`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw new Error('Download not available currently.');
    }
  },

  // Get payout history
  getPayoutHistory: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner/payouts', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get revenue & finance summary stats
  getRevenueSummary: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/payments/owner/revenue/summary', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Export Financial Report
  exportReport: async (data) => {
    try {
      const response = await axiosInstance.post('/payments/owner/reports/export', data, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw new Error('Export not available currently.');
    }
  },

  // Create Razorpay Route Linked Account for Cafe
  createCafeLinkedAccount: async (cafeId, data = {}) => {
    const response = await axiosInstance.post(`/payments/razorpay/linked-accounts/cafe/${cafeId}`, data);
    return response.data;
  },

  // Get Razorpay Route Linked Account status for Cafe
  getCafeLinkedAccountStatus: async (cafeId) => {
    const response = await axiosInstance.get(`/payments/razorpay/linked-accounts/cafe/${cafeId}/status`);
    return response.data;
  },

  // Get Razorpay Linked Account by Account ID
  getLinkedAccountById: async (accountId) => {
    const response = await axiosInstance.get(`/payments/razorpay/linked-accounts/${accountId}`);
    return response.data;
  }
};

