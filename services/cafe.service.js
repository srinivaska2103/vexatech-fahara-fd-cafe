import { axiosInstance } from '@/lib/axios';

export const cafeService = {
  // Get all cafes with optional query params (search, filter, pagination)
  getCafes: async (params = {}) => {
    const response = await axiosInstance.get('/cafes', { params });
    return response.data;
  },

  // Get a single cafe by ID
  getCafeById: async (id) => {
    const response = await axiosInstance.get(`/cafes/${id}`);
    return response.data;
  },

  // Create a new cafe
  createCafe: async (data) => {
    let payload = { ...data };

    // Check if gallery contains File objects that need to be uploaded first
    if (payload.gallery && payload.gallery.length > 0 && payload.gallery[0] instanceof File) {
      const formData = new FormData();
      payload.gallery.forEach(file => {
        formData.append('images', file);
      });
      
      const uploadRes = await axiosInstance.post('/uploads/multiple', formData);
      // Backend returns array of { url, filename }, Prisma expects Json, so we save the URLs
      payload.gallery = uploadRes.data.data;
    }

    // Now send the JSON payload to create the cafe
    const response = await axiosInstance.post('/cafes', payload);
    return response.data;
  },

  // Update an existing cafe
  updateCafe: async (id, data) => {
    const response = await axiosInstance.put(`/cafes/${id}`, data);
    return response.data;
  },

  // Delete a cafe
  deleteCafe: async (id) => {
    const response = await axiosInstance.delete(`/cafes/${id}`);
    return response.data;
  },

  // Upload gallery images
  uploadGalleryImages: async (id, formData) => {
    const response = await axiosInstance.post(`/cafes/${id}/gallery`, formData);
    return response.data;
  },

  // Delete a specific gallery image
  deleteGalleryImage: async (cafeId, imageId) => {
    const response = await axiosInstance.delete(`/cafes/${cafeId}/gallery/${imageId}`);
    return response.data;
  },

  // Specialized endpoints for specific sections (if supported by backend)
  updateBusinessHours: async (id, data) => {
    const response = await axiosInstance.put(`/cafes/${id}/business-hours`, data);
    return response.data;
  },

  updateAvailability: async (id, data) => {
    const response = await axiosInstance.put(`/cafes/${id}/availability`, data);
    return response.data;
  }
};
