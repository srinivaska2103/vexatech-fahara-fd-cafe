import { axiosInstance } from '@/lib/axios';

export const bookingService = {
  getBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/cafe-bookings', { params });
    return response.data;
  },

  // Get a single booking by ID
  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  // Get bookings optimized for the calendar view (start/end dates)
  getBookingCalendar: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/cafe-bookings', { params });
    return response.data;
  },

  // Approve a booking
  approveBooking: async (id, data = {}) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status: 'CONFIRMED' });
    return response.data;
  },

  // Reject a booking
  rejectBooking: async (id, data = {}) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (id, data = {}) => {
    // For owner it might be patching status, for customer it uses /cancel. We will use /status since this is the owner frontend.
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
    return response.data;
  },

  // Complete a booking
  completeBooking: async (id, data = {}) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status: 'COMPLETED' });
    return response.data;
  },

  // Generic status update if needed
  updateBookingStatus: async (id, status, notes = '') => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status, notes });
    return response.data;
  },
  
  // Update notes
  updateBookingNotes: async (id, notes) => {
    const response = await axiosInstance.patch(`/bookings/${id}/notes`, { notes });
    return response.data;
  }
};
