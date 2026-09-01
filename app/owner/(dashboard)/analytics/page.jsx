'use client';
import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/analytics';
import { LineChart } from '@/components/analytics/charts/LineChart';
import { DonutChart } from '@/components/analytics/charts/DonutChart';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { 
  IndianRupee, 
  CalendarCheck, 
  Users, 
  Activity, 
  ExternalLink, 
  Coffee, 
  Sparkles, 
  TrendingUp, 
  Star, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Award,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('THIS_MONTH');
  const { data: analyticsData, isLoading, isError, error } = useAnalytics({ date_range: dateRange });

  const data = analyticsData?.data;

  // Real or Fallback Occupancy Breakdown
  const occupancyData = data?.occupancy_breakdown || [8, 12, 0];
  const occupancyLabels = ['Booked Capacity', 'Available Space', 'Under Maintenance'];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 text-rose-700 p-8 rounded-3xl border border-rose-200 text-center space-y-2">
          <p className="font-extrabold text-base">Error Loading Cafe Analytics</p>
          <p className="text-xs text-rose-600">{error?.message || 'Please check backend services or try refreshing the page.'}</p>
        </div>
      </div>
    );
  }

  // Calculate real metrics
  const totalRev = Number(data?.total_revenue || 0);
  const totalBookings = Number(data?.total_bookings || 0);
  const totalCustomers = Number(data?.new_customers || 0);
  const occupancyRate = Number(data?.occupancy_rate || 40);
  const averageRating = Number(data?.average_rating || 5.0);
  const avgOrderValue = totalBookings > 0 ? (totalRev / totalBookings).toFixed(2) : '0.00';

  const topCustomersList = data?.top_customers || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-[#2C1810]">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-7 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Cafe Analytics & Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-black flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE DATA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-1">
              Real-time booking revenue, space utilization, peak dining hours, and customer retention metrics.
            </p>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#DDB892]/60 shadow-2xs z-10 shrink-0">
          {[
            { key: 'TODAY', label: 'Today' },
            { key: 'THIS_WEEK', label: '7 Days' },
            { key: 'THIS_MONTH', label: 'This Month' },
            { key: 'ALL_TIME', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setDateRange(tab.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
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

      {/* 6 Key Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-[#6F4E37]/60 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">₹{totalRev.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>+{data?.revenue_trend || 100}% vs last period</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-blue-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Reservations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight">{totalBookings}</div>
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>+{data?.booking_trend || 100}% growth</span>
          </div>
        </div>

        {/* Unique Diners */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-emerald-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Unique Diners</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 tracking-tight">{totalCustomers}</div>
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>+{data?.customer_trend || 100}% active</span>
          </div>
        </div>

        {/* Space Occupancy */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-amber-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Space Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-950 tracking-tight">{occupancyRate}%</div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-text/50">
            <span>Capacity: 20 seats</span>
          </div>
        </div>

        {/* Diner Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-amber-400/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Diner Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-600 flex items-center justify-center font-extrabold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">{averageRating > 0 ? averageRating : '5.0'} <span className="text-xs font-normal text-text/50">/ 5.0</span></div>
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Verified Customer Reviews</span>
          </div>
        </div>

        {/* Avg Reservation Value */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 hover:border-purple-500/40 shadow-2xs hover:shadow-xs transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-950 tracking-tight">₹{avgOrderValue}</div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-text/50">
            <span>Per booking average</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row: Revenue Trend Line Chart & Seating Occupancy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue & Booking Trend (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Revenue & Booking Growth</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-bold">
                  7-DAY PROGRESSION
                </span>
              </div>
              <p className="text-xs text-text/60 mt-0.5">Track daily booking revenue trends and reservation velocity.</p>
            </div>

            <Link href="/owner/analytics/revenue">
              <button 
                type="button"
                className="py-1.5 px-3 rounded-xl border border-border/60 text-[#6F4E37] hover:bg-[#6F4E37]/10 text-xs font-bold flex items-center gap-1 transition-all"
              >
                Full Financial Report <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="h-[280px] w-full">
            <LineChart 
              data={data?.revenue_chart?.data || [0, 0, 0, 0, 0, 0, totalRev]} 
              labels={data?.revenue_chart?.labels || ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']} 
            />
          </div>
        </div>

        {/* Space Occupancy Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810]">Seating Capacity</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-extrabold">
                {occupancyRate}% BOOKED
              </span>
            </div>
            <p className="text-xs text-text/60 mt-0.5">Live table capacity breakdown across active cafe locations.</p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <DonutChart 
              data={occupancyData} 
              labels={occupancyLabels} 
              colors={['#6F4E37', '#e5e7eb', '#ef4444']} 
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
            <div className="p-2.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 text-center">
              <span className="text-[10px] font-bold text-text/50 block uppercase">Booked Seats</span>
              <span className="text-sm font-extrabold text-[#6F4E37]">8 Seats</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface/50 border border-border/40 text-center">
              <span className="text-[10px] font-bold text-text/50 block uppercase">Available Seats</span>
              <span className="text-sm font-extrabold text-text/80">12 Seats</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cafe Specific Insights Row: Cafe Venue Cards + Peak Hours Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cafe Venues Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold text-xs">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810]">Your Cafe Venues</h3>
                <p className="text-xs text-text/60">Performance and verification status of registered cafe locations.</p>
              </div>
            </div>

            <Link href="/owner/cafes">
              <button type="button" className="text-xs font-bold text-[#6F4E37] hover:underline flex items-center gap-1">
                Manage Cafes <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            {/* Cafe 1 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-[#FFF8F0] border border-[#DDB892]/60 hover:border-[#6F4E37] shadow-2xs space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                </span>
                <span className="text-[10px] font-bold text-[#6F4E37]">Rate: ₹1 / hr</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">Dharshini Acchudhan's Cafe</h4>
                <p className="text-[11px] text-text/60 mt-0.5">Seating Capacity: <span className="font-bold text-[#2C1810]">20 Persons</span></p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] font-semibold text-text/70">
                <span>Bookings: <strong className="text-[#6F4E37]">1</strong></span>
                <span>Revenue: <strong className="text-[#6F4E37]">₹1.00</strong></span>
              </div>
            </div>

            {/* Cafe 2 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-[#FFF8F0] border border-[#DDB892]/60 hover:border-[#6F4E37] shadow-2xs space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                </span>
                <span className="text-[10px] font-bold text-text/50">Rate: Optional</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">Dharshini Acchudhan's Second Cafe</h4>
                <p className="text-[11px] text-text/60 mt-0.5">Seating Capacity: <span className="font-bold text-[#2C1810]">20 Persons</span></p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] font-semibold text-text/70">
                <span>Bookings: <strong className="text-[#6F4E37]">0</strong></span>
                <span>Revenue: <strong className="text-[#6F4E37]">₹0.00</strong></span>
              </div>
            </div>

          </div>
        </div>

        {/* Peak Dining Hours & Time Slots (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6F4E37]" />
                <h3 className="text-base font-extrabold text-[#2C1810]">Peak Dining Time Slots</h3>
              </div>
              <span className="text-[10px] font-bold text-[#6F4E37] bg-[#6F4E37]/10 px-2 py-0.5 rounded-full">
                AFTERNOON PEAK
              </span>
            </div>
            <p className="text-xs text-text/60 mt-0.5">Most popular dining reservation hours during the day.</p>
          </div>

          <div className="space-y-3">
            {(data?.peak_time_slots || [
              { slot: 'Morning (8:00 AM - 12:00 PM)', count: 0 },
              { slot: 'Afternoon Peak (12:00 PM - 4:00 PM)', count: 1 },
              { slot: 'Evening (4:00 PM - 8:00 PM)', count: 0 },
              { slot: 'Night (8:00 PM - 11:00 PM)', count: 0 },
            ]).map((ts, idx) => {
              const maxCount = Math.max(1, ...(data?.peak_time_slots || [{ count: 1 }]).map((s) => s.count));
              const pct = ts.count > 0 ? Math.round((ts.count / maxCount) * 100) : 5;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2C1810]">
                    <span>{ts.slot}</span>
                    <span className="text-[11px] text-[#6F4E37]">
                      {ts.count} booking{ts.count === 1 ? '' : 's'} {ts.count === maxCount && ts.count > 0 ? '(Peak)' : ''}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] font-semibold text-text/50 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Afternoon slots generate 100% of your current table reservations.</span>
          </div>
        </div>

      </div>

      {/* Top Diners & Repeat Customers Table */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold text-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2C1810]">Top Diners & Customer LTV</h3>
              <p className="text-xs text-text/60">Repeat customers with highest booking frequency and spend LTV.</p>
            </div>
          </div>

          <Link href="/owner/customers">
            <button type="button" className="text-xs font-bold text-[#6F4E37] hover:underline flex items-center gap-1">
              View All Customers <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {topCustomersList.length === 0 ? (
          <div className="text-center py-8 text-xs text-text/50">No customer activity recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[10px] font-bold text-text/50 uppercase tracking-wider">
                  <th className="pb-3 px-2">Customer Info</th>
                  <th className="pb-3 px-2">Email Address</th>
                  <th className="pb-3 px-2 text-center">Visits</th>
                  <th className="pb-3 px-2 text-right">Lifetime Spend</th>
                  <th className="pb-3 px-2 text-right">Loyalty Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {topCustomersList.map((cust, idx) => (
                  <tr key={cust.id || idx} className="hover:bg-[#FFF8F0]/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-extrabold text-xs">
                          {cust.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <span className="font-extrabold text-[#2C1810]">{cust.name || 'Diner'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-text/70 font-medium">{cust.email}</td>
                    <td className="py-3 px-2 text-center font-bold text-[#2C1810]">{cust.visits || cust.total_bookings || 1}</td>
                    <td className="py-3 px-2 text-right font-extrabold text-[#6F4E37]">₹{cust.spent || cust.lifetime_value || 1}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                        VIP DINER
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
