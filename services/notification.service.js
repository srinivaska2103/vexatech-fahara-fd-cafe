import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const notificationService = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notifications.list, { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get single notification
  getNotificationById: async (id) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notifications.detail(id));
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await axiosInstance.patch(ENDPOINTS.notifications.markRead(id));
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.patch(ENDPOINTS.notifications.markAllRead);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(ENDPOINTS.notifications.delete(id));
    return response.data;
  },

  // Send message to customers
  sendMessage: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.notifications.send, data);
    return response.data;
  },

  // Get notification templates
  getTemplates: async (channel = 'EMAIL') => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notifications.templates, { params: { channel } });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notifications.preferences);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (data) => {
    const response = await axiosInstance.put(ENDPOINTS.notifications.preferences, data);
    return response.data;
  },
  
  // Get Notification Stats
  getStats: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notifications.stats);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  }
};
