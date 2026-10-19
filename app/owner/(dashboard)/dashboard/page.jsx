'use client';
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentBookingsTable } from '@/components/dashboard/RecentBookingsTable';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { RecentReviews } from '@/components/dashboard/RecentReviews';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { 
  useDashboardSummary, 
  useDashboardRevenue, 
  useRecentBookings, 
  useRecentReviews, 
  useActivityTimeline 
} from '@/hooks/dashboard';
import { useCafeAnalytics } from '@/hooks/analytics';
import { useAuthStore } from '@/store/auth.store';
import { useCafes } from '@/hooks/cafe';
import { 
  CalendarCheck, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Users, 
  Heart, 
  MapPin, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState('7D');
  const [visitorPeriod, setVisitorPeriod] = useState('7days');
  const userRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const { data: cafesData } = useCafes();
  const cafeList = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const isWalkingCafe = 
    userRole === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    String(userRole || '').toUpperCase().includes('WALKING') ||
    String(user?.role || '').toUpperCase().includes('WALKING') ||
    cafeList.some(c => c.is_walking_cafe === true || (c.category || '').toLowerCase().includes('walking'));

  const { data: summaryResponse, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: revenueData, isLoading: isLoadingRevenue } = useDashboardRevenue(revenuePeriod);
  const { data: recentBookings, isLoading: isLoadingRecent } = useRecentBookings();
  const { data: recentReviews, isLoading: isLoadingReviews } = useRecentReviews();
  const { data: activities, isLoading: isLoadingActivity } = useActivityTimeline();
  const { data: cafeAnalyticsRes } = useCafeAnalytics('overview', { period: visitorPeriod });

  // Unwrap summary data cleanly
  const summary = (summaryResponse?.data && typeof summaryResponse.data === 'object' && !Array.isArray(summaryResponse.data))
    ? summaryResponse.data
    : (summaryResponse || {});

  const cafeAnalytics = cafeAnalyticsRes?.data || cafeAnalyticsRes || {};
  const overview = cafeAnalytics?.overview || {
    total_views: 0,
    unique_visitors: 0,
    wishlist_adds: 0,
    directions_clicks: 0,
    contact_clicks: 0
  };

  // Derive counts from summary or compute from recentBookings data as resilient fallback
  const bookingsList = Array.isArray(recentBookings) 
    ? recentBookings 
    : (Array.isArray(recentBookings?.data) ? recentBookings.data : []);

  const totalBookingsCount = summary?.total_bookings !== undefined 
    ? Number(summary.total_bookings) 
    : bookingsList.length;

  const confirmedCount = summary?.confirmed_bookings !== undefined 
    ? Number(summary.confirmed_bookings) 
    : bookingsList.filter(b => String(b.booking_status || b.status || '').toUpperCase() === 'CONFIRMED').length;

  const pendingCount = summary?.pending_bookings !== undefined 
    ? Number(summary.pending_bookings) 
    : bookingsList.filter(b => String(b.booking_status || b.status || '').toUpperCase() === 'PENDING').length;

  const cancelledCount = summary?.cancelled_bookings !== undefined 
    ? Number(summary.cancelled_bookings) 
    : bookingsList.filter(b => String(b.booking_status || b.status || '').toUpperCase() === 'CANCELLED').length;

  const completedCount = summary?.completed_bookings !== undefined 
    ? Number(summary.completed_bookings) 
    : bookingsList.filter(b => String(b.booking_status || b.status || '').toUpperCase() === 'COMPLETED').length;
  
  const totalRevValue = summary?.total_revenue !== undefined
    ? `₹${Number(summary.total_revenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '₹0.00';

  const bookingBreakdown = {
    confirmed: confirmedCount,
    pending: pendingCount,
    completed: completedCount,
    cancelled: cancelledCount
  };

  return (
    <PageContainer>
      {/* Top Welcome & Cafe Live Status Header */}
      <DashboardHeader summary={summary} cafe={cafeList[0]} />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="space-y-6"
      >
        {/* KPI Cards: 2 cols on mobile (<= 640px), 3 cols on tablet, 5 cols on desktop */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {/* 1. Total Bookings */}
          <StatsCard 
            title="Total Bookings"
            value={totalBookingsCount.toString()}
            subtitle="All recorded reservations"
            icon={CalendarCheck}
            colorScheme="primary"
            href="/owner/bookings"
            isLoading={isLoadingSummary}
          />

          {/* 2. Confirmed Bookings */}
          <StatsCard 
            title="Confirmed"
            value={confirmedCount.toString()}
            subtitle="Approved guest tables"
            icon={CheckCircle2}
            colorScheme="confirmed"
            href="/owner/bookings?status=CONFIRMED"
            isLoading={isLoadingSummary}
          />

          {/* 3. Pending Bookings */}
          <StatsCard 
            title="Pending Action"
            value={pendingCount.toString()}
            subtitle="Awaiting cafe review"
            icon={Clock}
            colorScheme="pending"
            badgeText={pendingCount > 0 ? "Needs Review" : null}
            href="/owner/bookings?status=PENDING"
            isLoading={isLoadingSummary}
          />

          {/* 4. Cancelled Bookings */}
          <StatsCard 
            title="Cancelled"
            value={cancelledCount.toString()}
            subtitle="Excluded from revenue"
            icon={XCircle}
            colorScheme="cancelled"
            href="/owner/bookings?status=CANCELLED"
            isLoading={isLoadingSummary}
          />

          {/* 5. Total Revenue */}
          <div className="col-span-2 sm:col-span-1">
            <StatsCard 
              title="Total Revenue"
              value={totalRevValue}
              subtitle="Eligible net cafe earnings"
              icon={IndianRupee}
              colorScheme="revenue"
              href="/owner/payments"
              trend={summary?.revenue_trend > 0 ? 'up' : 'down'}
              trendValue={summary?.revenue_trend ? `${summary.revenue_trend > 0 ? '+' : ''}${summary.revenue_trend}%` : null}
              isLoading={isLoadingSummary}
            />
          </div>
        </motion.div>

        {/* Quick Operations Grid */}
        <motion.div variants={itemVariants}>
          <QuickActionsGrid isWalkingCafe={isWalkingCafe} />
        </motion.div>

        {/* Analytics & Today's Bookings Main Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans on desktop): Revenue Trend Chart + Today's Bookings Table/Card */}
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart 
              data={revenueData} 
              isLoading={isLoadingRevenue}
              selectedTimeframe={revenuePeriod}
              onTimeframeChange={setRevenuePeriod}
              bookingBreakdown={bookingBreakdown}
            />

            <RecentBookingsTable 
              data={recentBookings} 
              isLoading={isLoadingRecent} 
            />
          </div>

          {/* Right Column: Customer Reviews & Activity Timeline */}
          <div className="space-y-6">
            <RecentReviews 
              data={recentReviews} 
              isLoading={isLoadingReviews} 
            />
            <ActivityTimeline 
              data={activities} 
              isLoading={isLoadingActivity} 
            />
          </div>
        </motion.div>

        {/* Customer Interest & Traffic Analytics (Walking Cafes & Live Insights) */}
        {isWalkingCafe && (
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#FFF8F0] via-white to-[#FAF0E6] border border-[#DDB892]/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDB892]/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Eye className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight">Footfall & Customer Discovery</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#6F4E37] border border-amber-300 text-[10px] font-black uppercase tracking-wider">Live</span>
                  </div>
                  <p className="text-xs text-text/60">Real-time visitor views, route clicks, inquiries, and wishlist adds.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-border/70 shrink-0 self-start sm:self-auto">
                {[
                  { key: 'today', label: 'Today' },
                  { key: '7days', label: '7 Days' },
                  { key: '30days', label: '30 Days' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setVisitorPeriod(tab.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      visitorPeriod === tab.key ? 'bg-[#6F4E37] text-white shadow-xs' : 'text-text/60 hover:text-[#6F4E37]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#6F4E37] uppercase">
                  <span>Cafe Views</span>
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#2C1810]">{overview.total_views.toLocaleString()}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-blue-800 uppercase">
                  <span>Unique Visitors</span>
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-blue-950">{overview.unique_visitors.toLocaleString()}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-rose-800 uppercase">
                  <span>Wishlists</span>
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-950">{overview.wishlist_adds.toLocaleString()}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase">
                  <span>Directions</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-950">{overview.directions_clicks.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
