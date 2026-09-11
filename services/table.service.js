import { axiosInstance } from '@/lib/axios';

export const tableService = {
  // Get tables and capacity summary for a cafe
  getTablesByCafe: async (cafeId) => {
    const response = await axiosInstance.get(`/cafes/${cafeId}/tables`);
    return response.data;
  },

  // Get next suggested table number
  getNextTableNumber: async (cafeId) => {
    const response = await axiosInstance.get(`/cafes/${cafeId}/tables/next-number`);
    return response.data;
  },

  // Create a new table
  createTable: async (cafeId, data) => {
    const response = await axiosInstance.post(`/cafes/${cafeId}/tables`, data);
    return response.data;
  },

  // Update a table
  updateTable: async (cafeId, tableId, data) => {
    const response = await axiosInstance.patch(`/cafes/${cafeId}/tables/${tableId}`, data);
    return response.data;
  },

  // Update table status
  updateTableStatus: async (cafeId, tableId, status) => {
    const response = await axiosInstance.patch(`/cafes/${cafeId}/tables/${tableId}/status`, { status });
    return response.data;
  },

  // Delete a table
  deleteTable: async (cafeId, tableId) => {
    const response = await axiosInstance.delete(`/cafes/${cafeId}/tables/${tableId}`);
    return response.data;
  },

  // Set table combinations
  setTableCombinations: async (cafeId, tableId, combinedTableIds) => {
    const response = await axiosInstance.post(`/cafes/${cafeId}/tables/${tableId}/combinations`, {
      combined_table_ids: combinedTableIds
    });
    return response.data;
  },

  // Get real-time availability for date & time slot
  getRealtimeTableAvailability: async (cafeId, params) => {
    const response = await axiosInstance.get(`/cafes/${cafeId}/tables/availability`, { params });
    return response.data;
  }
};
