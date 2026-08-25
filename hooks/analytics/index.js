import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export const useAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => analyticsService.getDashboardAnalytics(params),
  });
};

export const useRevenueAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', params],
    queryFn: () => analyticsService.getRevenueAnalytics(params),
  });
};

export const useBookingAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'bookings', params],
    queryFn: () => analyticsService.getBookingAnalytics(params),
  });
};

export const useCustomerAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'customers', params],
    queryFn: () => analyticsService.getCustomerAnalytics(params),
  });
};

export const useEventAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'events', params],
    queryFn: () => analyticsService.getEventAnalytics(params),
  });
};

export const useOccupancyAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'occupancy', params],
    queryFn: () => analyticsService.getOccupancyAnalytics(params),
  });
};
