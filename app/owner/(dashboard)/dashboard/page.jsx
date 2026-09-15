'use client';
import React, { useState } from 'react';
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
import { useCafeAnalytics } from '@/hooks/analytics';
import { useAuthStore } from '@/store/auth.store';
import { useCafes } from '@/hooks/cafe';
import { Store, CalendarCheck, IndianRupee, TrendingUp, Users, Star, Eye, Heart, MapPin, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';
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
  const [dateRange, setDateRange] = useState('7days');
  const userRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const { data: cafesData } = useCafes();
  const cafeList = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const isRestaurant = 
    userRole === 'RESTAURANT_OWNER' || 
    user?.role === 'RESTAURANT_OWNER' || 
    user?.user_type === 'RESTAURANT_OWNER' ||
    user?.roles?.name === 'RESTAURANT_OWNER' ||
    String(userRole || '').toUpperCase().includes('RESTAURANT') ||
    String(user?.role || '').toUpperCase().includes('RESTAURANT') ||
    String(user?.user_type || '').toUpperCase().includes('RESTAURANT') ||
    cafeList.some(c => (c.category || '').toLowerCase().includes('restaurant'));

  const isWalkingCafe = 
    userRole === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    String(userRole || '').toUpperCase().includes('WALKING') ||
    String(user?.role || '').toUpperCase().includes('WALKING') ||
    cafeList.some(c => c.is_walking_cafe === true || (c.category || '').toLowerCase().includes('walking'));

  const hideRevenue = isRestaurant || isWalkingCafe;

  const { data: summaryResponse, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: revenueData, isLoading: isLoadingRevenue } = useDashboardRevenue();
  const { data: recentBookings, isLoading: isLoadingRecent } = useRecentBookings();
  const { data: upcomingBookings, isLoading: isLoadingUpcoming } = useUpcomingBookings();
  const { data: recentReviews, isLoading: isLoadingReviews } = useRecentReviews();
  const { data: activities, isLoading: isLoadingActivity } = useActivityTimeline();
  const { data: cafeAnalyticsRes } = useCafeAnalytics('overview', { period: dateRange });

  const cafeAnalytics = cafeAnalyticsRes?.data;
  const overview = cafeAnalytics?.overview || {
    total_views: 0,
    unique_visitors: 0,
    wishlist_adds: 0,
    directions_clicks: 0,
    contact_clicks: 0
  };

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
        {/* Customer Interest & Real Cafe Analytics Section (Only for Walking Cafe) */}
        {isWalkingCafe && (
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#FFF8F0] via-white to-[#FAF0E6] border border-[#DDB892]/70 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDB892]/30 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-black shadow-md shrink-0 ring-4 ring-[#6F4E37]/10">
                  <Eye className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Customer Interest & Cafe Views</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#6F4E37] border border-amber-300/80 text-[10px] font-black uppercase tracking-wider">Live Analytics</span>
                  </div>
                  <p className="text-xs font-medium text-text/60 mt-0.5">Real-time visitor traffic, Google map route clicks, phone inquiries, and wishlist saves.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-border/70 shadow-2xs shrink-0 self-start sm:self-auto">
                {[
                  { key: 'today', label: 'Today' },
                  { key: '7days', label: '7 Days' },
                  { key: '30days', label: '30 Days' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDateRange(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      dateRange === tab.key ? 'bg-[#6F4E37] text-white shadow-xs' : 'text-text/60 hover:text-[#6F4E37] hover:bg-surface/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prominent High-Impact Analytics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-600" /> Cafe Views
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">{overview.total_views.toLocaleString()}</div>
                <p className="text-[10px] font-semibold text-text/50">Total page visits</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" /> Unique Visitors
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">{overview.unique_visitors.toLocaleString()}</div>
                <p className="text-[10px] font-semibold text-text/50">Individual customers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-600" /> Wishlists
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">{overview.wishlist_adds.toLocaleString()}</div>
                <p className="text-[10px] font-semibold text-text/50">Saved by customers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Directions
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">{overview.directions_clicks.toLocaleString()}</div>
                <p className="text-[10px] font-semibold text-text/50">Map route clicks</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-purple-600" /> Contacts
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">{overview.contact_clicks.toLocaleString()}</div>
                <p className="text-[10px] font-semibold text-text/50">Phone calls initiated</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {(() => {
          const visibleStatsCount = (!hideRevenue ? 1 : 0) + 1 + (!isWalkingCafe ? 1 : 0) + 1;
          const gridColsClass = 
            visibleStatsCount === 2 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : visibleStatsCount === 3 
              ? 'grid-cols-1 sm:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

          return (
            <motion.div variants={itemVariants} data-tour="dashboard-overview" className={`grid ${gridColsClass} gap-4`}>
              {!hideRevenue && (
                <StatsCard 
                  title="Total Revenue" 
                  value={stats.totalRevenue} 
                  trend={stats.revenueTrend} 
                  trendValue={stats.revenueTrendValue} 
                  icon={IndianRupee} 
                  isLoading={isLoadingSummary} 
                />
              )}
              <StatsCard 
                title="Total Customers" 
                value={stats.totalCustomers} 
                trend={stats.customersTrend} 
                trendValue={stats.customersTrendValue} 
                icon={Users} 
                isLoading={isLoadingSummary} 
              />
              {!isWalkingCafe && (
                <StatsCard 
                  title="Active Bookings" 
                  value={stats.activeBookings} 
                  trend={stats.bookingsTrend} 
                  trendValue={stats.bookingsTrendValue} 
                  icon={CalendarCheck} 
                  isLoading={isLoadingSummary} 
                />
              )}
              <StatsCard 
                title="Average Rating" 
                value={stats.averageRating} 
                trend={stats.ratingTrend} 
                trendValue={stats.ratingTrendValue} 
                icon={Star} 
                isLoading={isLoadingSummary} 
              />
            </motion.div>
          );
        })()}

        {/* Charts & Main Content Area */}
        <motion.div variants={itemVariants}>
          {!isWalkingCafe ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {!hideRevenue && <RevenueChart data={revenueData} isLoading={isLoadingRevenue} />}
                <RecentBookingsTable data={recentBookings} isLoading={isLoadingRecent} />
              </div>
              <div className="space-y-6">
                <RecentReviews data={recentReviews} isLoading={isLoadingReviews} />
                <ActivityTimeline data={activities} isLoading={isLoadingActivity} />
              </div>
            </div>
          ) : (
            /* Tailored Layout for Walking Cafe Partner: No Empty Activity Timeline Box */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentReviews data={recentReviews} isLoading={isLoadingReviews} />
              </div>
              
              <div className="bg-white rounded-3xl border border-border/70 p-6 space-y-5 shadow-2xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#2C1810]">Walk-in Traffic Summary</h3>
                      <p className="text-xs text-text/50">Direct customer engagement & visits</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-stone-700">Map Route Clicks</span>
                      </div>
                      <span className="text-sm font-black text-[#2C1810]">{overview.directions_clicks}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <PhoneCall className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-xs font-bold text-stone-700">Direct Contact Calls</span>
                      </div>
                      <span className="text-sm font-black text-[#2C1810]">{overview.contact_clicks}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold text-stone-700">Customer Wishlist Saves</span>
                      </div>
                      <span className="text-sm font-black text-[#2C1810]">{overview.wishlist_adds}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <a
                    href="/owner/analytics"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#4A2C11] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <span>View Full Analytics Report</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
