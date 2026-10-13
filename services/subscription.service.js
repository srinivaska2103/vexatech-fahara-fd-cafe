import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const subscriptionService = {
  getStatus: async () => {
    const response = await axiosInstance.get(ENDPOINTS.subscriptions.status);
    return response.data;
  },

  getPlans: async () => {
    const response = await axiosInstance.get(ENDPOINTS.subscriptions.plans);
    return response.data;
  },


  create: async () => {
    const response = await axiosInstance.post(ENDPOINTS.subscriptions.create);
    return response.data;
  },

  verify: async (paymentDetails) => {
    const response = await axiosInstance.post(ENDPOINTS.subscriptions.verify, paymentDetails);
    return response.data;
  },

  cancel: async () => {
    const response = await axiosInstance.post(ENDPOINTS.subscriptions.cancel);
    return response.data;
  },

  reactivate: async () => {
    const response = await axiosInstance.post(ENDPOINTS.subscriptions.reactivate);
    return response.data;
  }
};
