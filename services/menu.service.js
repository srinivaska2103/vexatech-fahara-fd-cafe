import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const menuService = {
  // Stats and Overview
  getMenuStats: async (params = {}) => {
    const response = await axiosInstance.get(ENDPOINTS.menu.stats, { params });
    return response.data;
  },

  // Categories
  getCategories: async (params = {}) => {
    const response = await axiosInstance.get(ENDPOINTS.menu.categories, { params });
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.menu.categories, data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(ENDPOINTS.menu.categoryDetail(id), data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(ENDPOINTS.menu.categoryDetail(id));
    return response.data;
  },

  updateCategoryStatus: async (id, isActive) => {
    const response = await axiosInstance.patch(ENDPOINTS.menu.categoryStatus(id), { isActive });
    return response.data;
  },

  // Menu Items
  getMenuItems: async (params = {}) => {
    const response = await axiosInstance.get(ENDPOINTS.menu.items, { params });
    return response.data;
  },

  createMenuItem: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.menu.items, data);
    return response.data;
  },

  updateMenuItem: async (id, data) => {
    const response = await axiosInstance.put(ENDPOINTS.menu.itemDetail(id), data);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await axiosInstance.delete(ENDPOINTS.menu.itemDetail(id));
    return response.data;
  },

  updateMenuItemAvailability: async (id, isAvailable) => {
    const response = await axiosInstance.patch(ENDPOINTS.menu.itemAvailability(id), { isAvailable });
    return response.data;
  },

  // Image Upload helper using backend upload route
  uploadImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data?.url || response.data?.data?.url || response.data?.data;
  }
};

