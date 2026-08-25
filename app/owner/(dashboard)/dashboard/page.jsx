'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentBookingsTable } from '@/components/dashboard/RecentBookingsTable';
import { UpcomingBookings } from '@/components/dashboard/UpcomingBookings';
import { RecentReviews } from '@/components/dashboard/RecentReviews';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { 
  useDashboardSummary, 
  useDashboardRevenue, 
  useRecentBookings, 
  useUpcomingBookings, 
  useRecentReviews, 
  useActivityTimeline 
} from '@/hooks/dashboard';
import { Store, CalendarCheck, IndianRupee, TrendingUp, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { data: summaryResponse, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: revenueData, isLoading: isLoadingRevenue } = useDashboardRevenue();
  const { data: recentBookings, isLoading: isLoadingRecent } = useRecentBookings();
  const { data: upcomingBookings, isLoading: isLoadingUpcoming } = useUpcomingBookings();
  const { data: recentReviews, isLoading: isLoadingReviews } = useRecentReviews();
  const { data: activities, isLoading: isLoadingActivity } = useActivityTimeline();

  const summary = summaryResponse?.data;
  const stats = {
    totalRevenue: summary?.total_revenue ? `₹${Number(summary.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₹0.00',
    revenueTrend: summary?.revenue_trend > 0 ? 'up' : 'down', 
    revenueTrendValue: summary?.revenue_trend ? `${summary.revenue_trend > 0 ? '+' : ''}${summary.revenue_trend}%` : '+0%',
    
    totalCustomers: summary?.new_customers?.toString() || '0', 
    customersTrend: summary?.customer_trend > 0 ? 'up' : 'down', 
    customersTrendValue: summary?.customer_trend ? `${summary.customer_trend > 0 ? '+' : ''}${summary.customer_trend}%` : '+0%',
    
    activeBookings: summary?.total_bookings?.toString() || '0', 
    bookingsTrend: summary?.booking_trend > 0 ? 'up' : 'down', 
    bookingsTrendValue: summary?.booking_trend ? `${summary.booking_trend > 0 ? '+' : ''}${summary.booking_trend}%` : '+0%',
    
    averageRating: summary?.average_rating?.toString() || '0.0', 
    ratingTrend: summary?.rating_trend > 0 ? 'up' : 'down', 
    ratingTrendValue: summary?.rating_trend ? `${summary.rating_trend > 0 ? '+' : ''}${summary.rating_trend}%` : '+0%'
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="space-y-6"
      >
        {/* Stats Grid */}
        <motion.div variants={itemVariants} data-tour="dashboard-overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Revenue" 
            value={stats.totalRevenue} 
            trend={stats.revenueTrend} 
            trendValue={stats.revenueTrendValue} 
            icon={IndianRupee} 
            isLoading={isLoadingSummary} 
          />
          <StatsCard 
            title="Total Customers" 
            value={stats.totalCustomers} 
            trend={stats.customersTrend} 
            trendValue={stats.customersTrendValue} 
            icon={Users} 
            isLoading={isLoadingSummary} 
          />
          <StatsCard 
            title="Active Bookings" 
            value={stats.activeBookings} 
            trend={stats.bookingsTrend} 
            trendValue={stats.bookingsTrendValue} 
            icon={CalendarCheck} 
            isLoading={isLoadingSummary} 
          />
          <StatsCard 
            title="Average Rating" 
            value={stats.averageRating} 
            trend={stats.ratingTrend} 
            trendValue={stats.ratingTrendValue} 
            icon={Star} 
            isLoading={isLoadingSummary} 
          />
        </motion.div>

        {/* Charts & Main Content Area */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart data={revenueData} isLoading={isLoadingRevenue} />
            <RecentBookingsTable data={recentBookings} isLoading={isLoadingRecent} />
          </div>
          
          <div className="space-y-6">
            <UpcomingBookings data={upcomingBookings} isLoading={isLoadingUpcoming} />
            <RecentReviews data={recentReviews} isLoading={isLoadingReviews} />
            <ActivityTimeline data={activities} isLoading={isLoadingActivity} />
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
