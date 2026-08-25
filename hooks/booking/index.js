import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import toast from 'react-hot-toast';

// GET ALL BOOKINGS
export const useBookings = (params = {}) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingService.getBookings(params),
  });
};

// GET BOOKING BY ID
export const useBooking = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });
};

// GET CALENDAR BOOKINGS
export const useBookingCalendar = (params = {}) => {
  return useQuery({
    queryKey: ['bookings', 'calendar', params],
    queryFn: () => bookingService.getBookingCalendar(params),
  });
};

// Helper for invalidation
const invalidateBookingQueries = (queryClient, id) => {
  queryClient.invalidateQueries({ queryKey: ['booking', id] });
  queryClient.invalidateQueries({ queryKey: ['bookings'] });
};

// APPROVE BOOKING
export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookingService.approveBooking(id, data),
    onSuccess: (data, variables) => {
      toast.success('Booking approved successfully');
      invalidateBookingQueries(queryClient, variables.id);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to approve booking');
    },
  });
};

// REJECT BOOKING
export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookingService.rejectBooking(id, data),
    onSuccess: (data, variables) => {
      toast.success('Booking rejected');
      invalidateBookingQueries(queryClient, variables.id);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to reject booking');
    },
  });
};

// CANCEL BOOKING
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookingService.cancelBooking(id, data),
    onSuccess: (data, variables) => {
      toast.success('Booking cancelled');
      invalidateBookingQueries(queryClient, variables.id);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to cancel booking');
    },
  });
};

// COMPLETE BOOKING
export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookingService.completeBooking(id, data),
    onSuccess: (data, variables) => {
      toast.success('Booking marked as completed');
      invalidateBookingQueries(queryClient, variables.id);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to complete booking');
    },
  });
};
