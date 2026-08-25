import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardService.getSummary,
  });
};

export const useDashboardRevenue = (period = 'month') => {
  return useQuery({
    queryKey: ['dashboardRevenue', period],
    queryFn: () => dashboardService.getRevenueStats(period),
  });
};

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['recentBookings'],
    queryFn: dashboardService.getRecentBookings,
  });
};

export const useUpcomingBookings = () => {
  return useQuery({
    queryKey: ['upcomingBookings'],
    queryFn: dashboardService.getUpcomingBookings,
  });
};

export const useRecentReviews = () => {
  return useQuery({
    queryKey: ['recentReviews'],
    queryFn: dashboardService.getRecentReviews,
  });
};

export const useActivityTimeline = () => {
  return useQuery({
    queryKey: ['activityTimeline'],
    queryFn: dashboardService.getActivityTimeline,
  });
};
