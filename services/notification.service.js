import { axiosInstance } from '@/lib/axios';

export const notificationService = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/notifications', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get single notification
  getNotificationById: async (id) => {
    try {
      const response = await axiosInstance.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  // Send message to customers
  sendMessage: async (data) => {
    const response = await axiosInstance.post('/notifications/send', data);
    return response.data;
  },

  // Get notification templates
  getTemplates: async (channel = 'EMAIL') => {
    try {
      const response = await axiosInstance.get('/notifications/templates', { params: { channel } });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: [] };
      throw error;
    }
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await axiosInstance.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (data) => {
    const response = await axiosInstance.put('/notifications/preferences', data);
    return response.data;
  },
  
  // Get Notification Stats
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/notifications/stats');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { data: null };
      throw error;
    }
  }
};
