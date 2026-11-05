import { axiosInstance as api } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const foodOrderService = {
  // Orders
  getOrders: async (params = {}) => {
    const res = await api.get(ENDPOINTS.foodOrders.list, { params });
    return res.data;
  },

  getOrderStats: async (params = {}) => {
    const res = await api.get(ENDPOINTS.foodOrders.stats, { params });
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(ENDPOINTS.foodOrders.detail(id));
    return res.data;
  },

  updateOrderStatus: async (id, status) => {
    const res = await api.patch(ENDPOINTS.foodOrders.updateStatus(id), { status });
    return res.data;
  },

  assignDelivery: async (id, employeeId) => {
    const res = await api.post(ENDPOINTS.foodOrders.assignDelivery(id), { employeeId });
    return res.data;
  },

  approveCancellation: async (id) => {
    const res = await api.post(`/cafe/orders/${id}/cancellation/approve`);
    return res.data;
  },

  rejectCancellation: async (id, reason) => {
    const res = await api.post(`/cafe/orders/${id}/cancellation/reject`, { reason });
    return res.data;
  },

  // Fulfilment Settings
  getFulfilmentSettings: async () => {
    const res = await api.get(ENDPOINTS.fulfilment.getSettings);
    return res.data;
  },

  updateFulfilmentSettings: async (data) => {
    const res = await api.put(ENDPOINTS.fulfilment.updateSettings, data);
    return res.data;
  },

  // Delivery Employees
  getDeliveryEmployees: async () => {
    const res = await api.get(ENDPOINTS.fulfilment.employees);
    return res.data;
  },

  createDeliveryEmployee: async (data) => {
    const res = await api.post(ENDPOINTS.fulfilment.employees, data);
    return res.data;
  },

  updateDeliveryEmployee: async (id, data) => {
    const res = await api.put(ENDPOINTS.fulfilment.employeeDetail(id), data);
    return res.data;
  },

  toggleEmployeeStatus: async (id, data) => {
    const res = await api.patch(ENDPOINTS.fulfilment.updateEmployeeStatus(id), data);
    return res.data;
  }
};
