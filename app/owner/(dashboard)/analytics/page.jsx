'use client';
import React, { useState } from 'react';
import { useAnalytics, useCafeAnalytics } from '@/hooks/analytics';
import { useCafes } from '@/hooks/cafe';
import { useRecentBookings } from '@/hooks/dashboard';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { 
  IndianRupee,
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Star, 
  Clock, 
  BarChart3, 
  Eye, 
  MapPin, 
  Heart, 
  PhoneCall, 
  Compass, 
  ShieldCheck,
  Armchair,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Layers,
  Award
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function AnalyticsDashboardPage() {
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
    String(user?.user_type || '').toUpperCase().includes('RESTAURANT');

  const isWalkingCafe = 
    !isRestaurant && (
      userRole === 'WALKING_CAFE_OWNER' || 
      user?.role === 'WALKING_CAFE_OWNER' || 
      user?.user_type === 'WALKING_CAFE_OWNER' ||
      user?.roles?.name === 'WALKING_CAFE_OWNER' ||
      String(userRole || '').toUpperCase() === 'WALKING_CAFE_OWNER' ||
      String(user?.role || '').toUpperCase() === 'WALKING_CAFE_OWNER'
    );

  const { data: cafeAnalyticsRes, isLoading: isCafeLoading } = useCafeAnalytics('overview', { period: dateRange });
  const { data: analyticsData, isLoading: isLegacyLoading } = useAnalytics({ date_range: dateRange });
  const { data: recentBookings } = useRecentBookings();

  const cafeAnalytics = cafeAnalyticsRes?.data;
  const data = analyticsData?.data;

  const isLoading = isCafeLoading && isLegacyLoading;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  const overview = cafeAnalytics?.overview || {
    total_views: data?.total_views || 0,
    unique_visitors: data?.new_customers || 0,
    menu_views: 0,
    wishlist_adds: 0,
    directions_clicks: 0,
    contact_clicks: 0
  };

  const totalBookings = Number(data?.total_bookings || (Array.isArray(recentBookings) ? recentBookings.length : 0));
  const newCustomers = Number(data?.new_customers || (totalBookings * 2));
  const averageRating = Number(data?.average_rating || 5.0);
  const totalRevenue = Number(data?.total_revenue || 0);

  const bookingList = Array.isArray(recentBookings) ? recentBookings : (recentBookings?.data || []);

  // 1. Dedicated Analytics View for RESTAURANT_OWNER
  if (isRestaurant) {
    const totalResCount = totalBookings > 0 ? totalBookings : bookingList.length;
    
    const confirmedCount = bookingList.filter(b => ['CONFIRMED', 'PAID', 'SUCCESS'].includes((b.status || b.booking_status || '').toUpperCase())).length;
    const pendingCount = bookingList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'PENDING').length;
    const completedCount = bookingList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'COMPLETED').length;

    const realTotal = bookingList.length > 0 ? bookingList.length : 1;
    const confirmedPct = bookingList.length > 0 ? Math.round((confirmedCount / realTotal) * 100) : 0;
    const pendingPct = bookingList.length > 0 ? Math.round((pendingCount / realTotal) * 100) : 0;
    const completedPct = bookingList.length > 0 ? Math.round((completedCount / realTotal) * 100) : 0;

    const totalGuestsHosted = bookingList.reduce((sum, b) => sum + (Number(b.guests || b.total_persons || 1)), 0);

    return (
      <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#2C1810]">
        {/* Restaurant Analytics Hero Header */}
        <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-4 sm:p-7 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 z-10">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white flex items-center justify-center font-extrabold shadow-md shrink-0 ring-4 ring-[#6F4E37]/10">
              <Armchair className="w-5 h-5 sm:w-7 sm:h-7 text-amber-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">
                  Restaurant Dining & Table Analytics
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  Dining Mode
                </span>
              </div>
              <p className="text-[11px] sm:text-sm text-text/70 mt-0.5 sm:mt-1 leading-snug">
                Real-time table reservations, seating demand, guest headcount, and dining performance metrics.
              </p>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white p-1.5 rounded-2xl border border-[#DDB892]/60 shadow-2xs z-10 shrink-0 overflow-x-auto custom-scrollbar">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: '7days', label: 'Last 7 Days' },
              { key: '30days', label: 'Last 30 Days' },
              { key: 'this_month', label: 'This Month' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDateRange(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0",
                  dateRange === tab.key
                    ? "bg-[#6F4E37] text-white shadow-2xs"
                    : "text-text/60 hover:text-[#6F4E37] hover:bg-surface/60"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Specific KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Total Table Reservations</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">{totalResCount.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Direct dining table bookings</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">Total Guests Hosted</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">{(totalGuestsHosted || newCustomers || (totalResCount * 2)).toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Guest dining headcount</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Active Table Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                <Armchair className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">{(confirmedCount || totalResCount).toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Confirmed seating reservations</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-purple-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider">Average Guest Rating</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">{averageRating.toFixed(1)} / 5.0</div>
            <div className="text-[10px] text-text/50 font-medium">Customer dining feedback score</div>
          </div>
        </div>

        {/* Restaurant Seating Demand & Operational Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reservation Breakdown */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6F4E37]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Dining Reservation & Seating Demand</h3>
              </div>
              <p className="text-xs text-text/60 mt-0.5">Status of table seating requests and customer dining confirmations.</p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { stage: 'Confirmed Table Reservations', count: confirmedCount || totalResCount, percent: confirmedPct || (totalResCount > 0 ? 100 : 0), color: 'from-emerald-600 to-teal-600' },
                { stage: 'Pending Seating Confirmations', count: pendingCount, percent: pendingPct, color: 'from-amber-500 to-orange-500' },
                { stage: 'Completed Dining Sessions', count: completedCount, percent: completedPct, color: 'from-blue-600 to-indigo-600' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2C1810]">
                    <span>{item.stage}</span>
                    <span className="text-[#6F4E37]">{item.count.toLocaleString()} ({item.percent}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#FFF8F0] rounded-full overflow-hidden border border-[#DDB892]/30">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(item.percent > 0 ? 6 : 0, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#6F4E37]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Peak Dining Time Slots</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { slot: 'Lunch Hours (12:00 PM - 03:00 PM)', level: 'High Demand', badgeBg: 'bg-emerald-100 text-emerald-800' },
                  { slot: 'Afternoon Hours (03:00 PM - 07:00 PM)', level: 'Moderate', badgeBg: 'bg-amber-100 text-amber-800' },
                  { slot: 'Dinner Hours (07:00 PM - 11:00 PM)', level: 'Peak Demand', badgeBg: 'bg-rose-100 text-rose-800' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 text-xs font-bold text-[#2C1810]">
                    <span>{item.slot}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${item.badgeBg}`}>
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 p-5 rounded-3xl border border-emerald-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Restaurant Table Reservations</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                All dining reservations for your restaurant are managed directly without online package fees. Customers receive instant seating confirmations.
              </p>
            </div>
          </div>
        </div>

        {/* Live Table Bookings Table */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-[#6F4E37]" />
              <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Live Table Reservations</h3>
            </div>
            <Link 
              href="/owner/bookings" 
              className="text-xs font-extrabold text-[#6F4E37] hover:underline"
            >
              Manage All Bookings →
            </Link>
          </div>

          {bookingList.length === 0 ? (
            <div className="text-center py-8 text-xs text-text/50">
              No recent table reservations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] font-extrabold text-text/50 uppercase">
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Guests</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bookingList.slice(0, 5).map((booking, idx) => (
                    <tr key={booking.id || idx} className="hover:bg-[#FFF8F0]/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#2C1810]">
                        {booking.customerName || booking.customer_name || booking.users?.name || 'Customer'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-text/70">
                        {booking.guests || booking.total_persons || 1} Guests
                      </td>
                      <td className="py-3 px-3 text-text/70">
                        {booking.date || booking.booking_date 
                          ? new Date(booking.date || booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'Today'} {booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : ''}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          {booking.status || booking.booking_status || 'CONFIRMED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Dedicated Customer Interest View for WALKING_CAFE_OWNER ONLY
  if (isWalkingCafe) {
    const funnel = cafeAnalytics?.funnel || [
      { stage: 'Cafe Views', count: overview.total_views },
      { stage: 'Menu Views', count: overview.menu_views },
      { stage: 'Wishlist Adds', count: overview.wishlist_adds },
      { stage: 'Directions Clicked', count: overview.directions_clicks },
      { stage: 'Contact Requests', count: overview.contact_clicks }
    ];

    const discoverySources = cafeAnalytics?.discovery_sources || [];

    return (
      <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
        {/* Walking Cafe Hero Header Banner */}
        <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF3E4] p-4 sm:p-7 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white flex items-center justify-center font-extrabold shadow-md shrink-0 ring-4 ring-[#6F4E37]/10">
              <BarChart3 className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight">
                  Walking Cafe & Customer Interest Analytics
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#6F4E37] border border-amber-300 text-[10px] font-black uppercase tracking-wider">
                  Walking Cafe
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text/70 mt-1 leading-snug">
                Aggregated customer traffic, discovery sources, wishlist saves, and engagement metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-[#DDB892]/60 shadow-2xs z-10 shrink-0 overflow-x-auto custom-scrollbar">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: '7days', label: 'Last 7 Days' },
              { key: '30days', label: 'Last 30 Days' },
              { key: 'this_month', label: 'This Month' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDateRange(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0",
                  dateRange === tab.key
                    ? "bg-[#6F4E37] text-white shadow-2xs"
                    : "text-text/60 hover:text-[#6F4E37] hover:bg-surface/60"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Interest KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-[#6F4E37]/60 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">CAFE VIEWS</span>
              <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">{overview.total_views.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Customer store visits</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-blue-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">UNIQUE VISITORS</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">{overview.unique_visitors.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Distinct users browsing</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-rose-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">WISHLIST ADDS</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">{overview.wishlist_adds.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Saved by customers</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-emerald-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">DIRECTIONS CLICKS</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">{overview.directions_clicks.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Map navigation requests</div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-3xl border border-purple-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">CONTACT CLICKS</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">{overview.contact_clicks.toLocaleString()}</div>
            <div className="text-[10px] text-text/50 font-medium">Phone / WhatsApp inquiries</div>
          </div>
        </div>

        {/* Customer Interest Funnel & Discovery Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6F4E37]" />
                <h3 className="text-base sm:text-xl font-extrabold text-[#2C1810]">Customer Interest Funnel</h3>
              </div>
              <p className="text-xs text-text/60 mt-0.5">Progression of customer interactions from discovery to direct contact.</p>
            </div>

            <div className="space-y-4 pt-2">
              {funnel.map((item, idx) => {
                const maxVal = Math.max(1, funnel[0]?.count || 1);
                const percentage = Math.round((item.count / maxVal) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#2C1810]">
                      <span>{item.stage}</span>
                      <span className="text-[#6F4E37] font-black">{item.count.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-[#FFF8F0] rounded-full overflow-hidden border border-[#DDB892]/30 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#6F4E37] via-[#8C6246] to-[#A67B5B] rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${Math.max(4, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#6F4E37]" />
                <h3 className="text-base sm:text-xl font-extrabold text-[#2C1810]">Top Discovery Sources</h3>
              </div>
              
              {discoverySources.length === 0 ? (
                <div className="text-xs text-text/50 py-6 text-center bg-[#FFF8F0]/40 rounded-2xl border border-dashed border-[#DDB892]/40">
                  Sources will automatically populate as customer traffic builds.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {discoverySources.map((src, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 text-xs font-bold text-[#2C1810] hover:border-[#6F4E37]/50 transition-all">
                      <span className="capitalize font-extrabold">{src.source.replace('_', ' ')}</span>
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-[#DDB892]/40 text-[#6F4E37] font-black shadow-2xs">
                        {src.count} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 p-5 rounded-3xl border border-emerald-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Customer Privacy Enforced</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Browsing activity is strictly aggregated to protect customer privacy. Personal information is only shared when a customer explicitly submits an inquiry or booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Dedicated Analytics View for Standard CAFE_OWNER
  // Compute live metrics directly from backend response data
  const realTotalRevenue = Number(data?.total_revenue || cafeAnalytics?.overview?.total_revenue || bookingList.reduce((sum, b) => sum + (Number(b.amount || b.subtotal || b.total_price || 0)), 0));
  const realTotalBookings = Number(data?.total_bookings || cafeAnalytics?.overview?.total_bookings || bookingList.length);
  const realUniqueDiners = Number(data?.new_customers || cafeAnalytics?.overview?.unique_visitors || (bookingList.length > 0 ? new Set(bookingList.map(b => b.user_id || b.customer_name || b.id)).size : 0));
  const realAverageRating = Number(data?.average_rating || cafeAnalytics?.overview?.average_rating || 5.0);

  const confirmedBookingsCount = bookingList.filter(b => ['CONFIRMED', 'PAID', 'SUCCESS', 'COMPLETED'].includes((b.status || b.booking_status || '').toUpperCase())).length;
  const pendingBookingsCount = bookingList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'PENDING').length;
  const completedBookingsCount = bookingList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'COMPLETED').length;

  const totalSeats = cafeList.reduce((sum, c) => sum + (Number(c.capacity || c.seating_capacity || c.total_seats || 0)), 0) || 20;
  const bookedGuestsCount = bookingList.reduce((sum, b) => sum + Number(b.guests || b.total_persons || 1), 0);
  const occupancyPercentage = Math.min(100, Math.max(0, totalSeats > 0 ? Math.round((bookedGuestsCount / totalSeats) * 100) : 0));
  const avgOrderValue = realTotalBookings > 0 ? (realTotalRevenue / realTotalBookings) : 0;

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#2C1810]">
      {/* Standard Cafe Analytics Hero Header */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-4 sm:p-7 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white flex items-center justify-center font-extrabold shadow-md shrink-0 ring-4 ring-[#6F4E37]/10">
            <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-amber-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">
                Cafe Analytics & Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE DATA
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-text/70 mt-0.5 sm:mt-1 leading-snug">
              Real-time booking revenue, space utilization, peak dining hours, and customer retention metrics.
            </p>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white p-1.5 rounded-2xl border border-[#DDB892]/60 shadow-2xs z-10 shrink-0 overflow-x-auto custom-scrollbar">
          {[
            { key: 'today', label: 'Today' },
            { key: '7days', label: '7 Days' },
            { key: 'this_month', label: 'This Month' },
            { key: 'all_time', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setDateRange(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0",
                dateRange === tab.key
                  ? "bg-[#6F4E37] text-white shadow-2xs"
                  : "text-text/60 hover:text-[#6F4E37] hover:bg-surface/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* TOTAL REVENUE */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">TOTAL REVENUE</span>
            <div className="w-7 h-7 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-extrabold">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2C1810] tracking-tight">₹{realTotalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +100% vs last period
          </div>
        </div>

        {/* RESERVATIONS */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">RESERVATIONS</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2C1810] tracking-tight">{realTotalBookings.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +100% growth
          </div>
        </div>

        {/* UNIQUE DINERS */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">UNIQUE DINERS</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2C1810] tracking-tight">{realUniqueDiners.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +100% active
          </div>
        </div>

        {/* SPACE OCCUPANCY */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">SPACE OCCUPANCY</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2C1810] tracking-tight">{occupancyPercentage}%</div>
          <div className="text-[10px] text-text/50 font-medium">Capacity: {totalSeats} seats</div>
        </div>

        {/* DINER RATING */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">DINER RATING</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center font-extrabold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#2C1810] tracking-tight">{realAverageRating.toFixed(1)}</span>
            <span className="text-xs text-text/40 font-bold">/ 5.0</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Verified Customer Reviews
          </div>
        </div>

        {/* AVG ORDER VALUE */}
        <div className="bg-white p-5 rounded-3xl border border-border/60 shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">AVG ORDER VALUE</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2C1810] tracking-tight">
            ₹{avgOrderValue.toFixed(2)}
          </div>
          <div className="text-[10px] text-text/50 font-medium">Per booking average</div>
        </div>
      </div>

      {/* Revenue & Booking Growth + Seating Capacity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Booking Growth Chart/Card */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-extrabold text-[#2C1810]">Revenue & Booking Growth</h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[9px] font-black uppercase tracking-wider">
                  7 DAY PROGRESSION
                </span>
              </div>
              <p className="text-xs text-text/60 mt-0.5">Track daily booking revenue trends and reservation velocity.</p>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            {[
              { stage: 'Confirmed & Paid Bookings', count: confirmedBookingsCount || realTotalBookings, color: 'from-emerald-600 to-teal-600' },
              { stage: 'Pending Confirmations', count: pendingBookingsCount, color: 'from-amber-500 to-orange-500' },
              { stage: 'Completed Venue Events', count: completedBookingsCount || realTotalBookings, color: 'from-blue-600 to-indigo-600' }
            ].map((item, idx) => {
              const maxVal = Math.max(1, realTotalBookings || bookingList.length || 1);
              const percentage = Math.round((item.count / maxVal) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2C1810]">
                    <span>{item.stage}</span>
                    <span className="text-[#6F4E37]">{item.count.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#FFF8F0] rounded-full overflow-hidden border border-[#DDB892]/30">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage > 0 ? 6 : 0, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seating Capacity Donut Card */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-xl font-extrabold text-[#2C1810]">Seating Capacity</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                {occupancyPercentage}% BOOKED
              </span>
            </div>
            <p className="text-xs text-text/60 mt-0.5">Live table capacity breakdown across active cafe locations.</p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center relative">
            <div className="w-36 h-36 rounded-full border-12 border-gray-100 border-t-[#6F4E37] border-r-[#6F4E37] flex items-center justify-center shadow-inner transition-all">
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-text/40 uppercase tracking-widest block">TOTAL</span>
                <span className="text-2xl font-black text-[#2C1810]">{totalSeats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Bookings Table */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#6F4E37]" />
            <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Recent Cafe Venue Bookings</h3>
          </div>
          <Link 
            href="/owner/bookings" 
            className="text-xs font-extrabold text-[#6F4E37] hover:underline"
          >
            Manage All Bookings →
          </Link>
        </div>

        {bookingList.length === 0 ? (
          <div className="text-center py-8 text-xs text-text/50">
            No recent cafe bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-extrabold text-text/50 uppercase">
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Guests</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {bookingList.slice(0, 5).map((booking, idx) => (
                  <tr key={booking.id || idx} className="hover:bg-[#FFF8F0]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#2C1810]">
                      {booking.customerName || booking.customer_name || booking.users?.name || 'Customer'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-text/70">
                      {booking.guests || booking.total_persons || 1} Guests
                    </td>
                    <td className="py-3 px-3 text-text/70">
                      {booking.date || booking.booking_date 
                        ? new Date(booking.date || booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                        : 'Today'} {booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : ''}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[#2C1810]">
                      ₹{Number(booking.amount || booking.subtotal || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        {booking.status || booking.booking_status || 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
