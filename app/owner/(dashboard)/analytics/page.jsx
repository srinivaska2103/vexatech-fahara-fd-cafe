'use client';
import React, { useState } from 'react';
import { useAnalytics, useCafeAnalytics } from '@/hooks/analytics';
import { useCafes } from '@/hooks/cafe';
import { useRecentBookings } from '@/hooks/dashboard';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
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
  Award,
  ShoppingBag,
  Utensils,
  Receipt,
  UserCheck,
  Percent,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' | 'food' | 'bookings'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'volume'

  const userRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const { data: cafesData } = useCafes();
  const cafeList = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const { data: cafeAnalyticsRes, isLoading: isCafeLoading, refetch } = useCafeAnalytics('overview', { period: dateRange });
  const { data: analyticsData, isLoading: isLegacyLoading } = useAnalytics({ date_range: dateRange });

  const isLoading = isCafeLoading && isLegacyLoading;
  const cafeAnalytics = cafeAnalyticsRes?.data;
  const kpi = cafeAnalytics?.kpi || {};
  const timeline = cafeAnalytics?.timeline || [];
  const topSellingFood = cafeAnalytics?.top_selling_food_items || [];
  const insights = cafeAnalytics?.insights || [];

  // Formatted KPI Metrics
  const overallRevenue = Number(kpi.overall_revenue || 0);
  const foodRevenue = Number(kpi.food_revenue || 0);
  const bookingRevenue = Number(kpi.booking_revenue || 0);

  const totalFoodOrders = Number(kpi.total_food_orders || 0);
  const paidFoodOrders = Number(kpi.paid_food_orders || 0);
  const pendingFoodPayments = Number(kpi.pending_food_payments || 0);
  const avgFoodOrderValue = Number(kpi.avg_food_order_value || 0);

  const totalBookings = Number(kpi.total_bookings || 0);
  const eligibleBookings = Number(kpi.eligible_bookings || 0);
  const avgBookingValue = Number(kpi.avg_booking_value || 0);

  const totalCustomers = Number(kpi.total_customers || 0);
  const foodCustomers = Number(kpi.food_customers || 0);
  const bookingCustomers = Number(kpi.booking_customers || 0);

  // Transform timeline data for chart
  const chartData = timeline.map(item => ({
    name: item.label,
    date: item.date,
    'Food Revenue': item.foodRevenue,
    'Booking Revenue': item.bookingRevenue,
    'Overall Revenue': item.totalRevenue,
    'Food Orders': item.foodOrders,
    'Bookings': item.bookings
  }));

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans text-[#252525]">
      
      {/* ── 1. HERO HEADER WITH DATE RANGE FILTERS ── */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-white p-5 sm:p-7 rounded-3xl border border-[#FEE2E2] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E50914] text-white flex items-center justify-center font-black shadow-md shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
                Restaurant &amp; Food Analytics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] text-[10px] font-black uppercase tracking-wider">
                Live Overview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Comprehensive real-time tracking of food orders, table bookings, customer counts and verified revenue.
            </p>
          </div>
        </div>

        {/* Date Range Selector (Today, Yesterday, 7 Days, 30 Days, This Month, Last Month) */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs shrink-0 overflow-x-auto no-scrollbar">
          {[
            { key: 'today', label: 'Today' },
            { key: 'yesterday', label: 'Yesterday' },
            { key: '7days', label: 'Last 7 Days' },
            { key: '30days', label: 'Last 30 Days' },
            { key: 'this_month', label: 'This Month' },
            { key: 'last_month', label: 'Last Month' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setDateRange(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                dateRange === tab.key
                  ? "bg-[#E50914] text-white shadow-2xs"
                  : "text-stone-600 hover:text-[#E50914] hover:bg-[#FFF5F5]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. TOP LEVEL REVENUE KPI CARDS (Requirements 3 & 4) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Revenue */}
        <div className="bg-gradient-to-br from-[#E50914] to-[#B71C1C] p-5 rounded-3xl text-white shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Overall Net Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            ₹{overallRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-white/80 font-medium">Food Sales + Table Bookings</p>
        </div>

        {/* Food Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#FEE2E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914]">Food Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E50914] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E50914] tracking-tight">
            ₹{foodRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-stone-400 font-medium">{paidFoodOrders} paid food orders</p>
        </div>

        {/* Booking Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Booking Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
            ₹{bookingRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-stone-400 font-medium">{eligibleBookings} eligible bookings</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-3xl border border-[#FEE2E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Total Diners Served</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E50914] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
            {totalCustomers.toLocaleString()}
          </div>
          <p className="text-[10px] text-stone-400 font-medium">Food: {foodCustomers} | Bookings: {bookingCustomers}</p>
        </div>

      </div>

      {/* ── 3. OPERATIONAL BREAKDOWN TILES (AOV & Status) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Avg Food Order Value</span>
          <span className="text-lg sm:text-xl font-black text-[#252525]">₹{avgFoodOrderValue}</span>
          <p className="text-[9px] text-stone-400 mt-0.5">Per paid food order</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Avg Booking Value</span>
          <span className="text-lg sm:text-xl font-black text-[#252525]">₹{avgBookingValue}</span>
          <p className="text-[9px] text-stone-400 mt-0.5">Per dining table reservation</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Total Orders Placed</span>
          <span className="text-lg sm:text-xl font-black text-[#252525]">{totalFoodOrders}</span>
          <p className="text-[9px] text-emerald-700 font-bold mt-0.5">{paidFoodOrders} Paid • {pendingFoodPayments} Pending</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Total Table Bookings</span>
          <span className="text-lg sm:text-xl font-black text-[#252525]">{totalBookings}</span>
          <p className="text-[9px] text-stone-500 font-medium mt-0.5">{eligibleBookings} Confirmed / Completed</p>
        </div>
      </div>

      {/* ── 4. COMBINED REVENUE PERFORMANCE CHART (Requirement 4) ── */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#FEE2E2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-base sm:text-lg font-black text-[#252525] tracking-tight">
                Revenue &amp; Orders Performance Trend
              </h2>
            </div>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              Daily revenue comparison between food ordering and table reservations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                chartMetric === 'revenue' ? 'bg-[#E50914] text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('volume')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                chartMetric === 'volume' ? 'bg-[#E50914] text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Volume (Count)
            </button>
          </div>
        </div>

        {/* Recharts Area / Bar Chart */}
        <div className="h-72 sm:h-80 w-full pt-2">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-stone-400 font-bold">
              No revenue records for this date range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'revenue' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="foodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#252525" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#252525" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c', fontWeight: 600 }} stroke="#e7e5e4" />
                  <YAxis tick={{ fontSize: 11, fill: '#78716c', fontWeight: 600 }} stroke="#e7e5e4" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #FEE2E2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 700 }}
                    formatter={(val, name) => [`₹${Number(val).toLocaleString()}`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Food Revenue" stroke="#E50914" strokeWidth={2.5} fillOpacity={1} fill="url(#foodGrad)" />
                  <Area type="monotone" dataKey="Booking Revenue" stroke="#252525" strokeWidth={2.5} fillOpacity={1} fill="url(#bookingGrad)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c', fontWeight: 600 }} stroke="#e7e5e4" />
                  <YAxis tick={{ fontSize: 11, fill: '#78716c', fontWeight: 600 }} stroke="#e7e5e4" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #FEE2E2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 700 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                  <Bar dataKey="Food Orders" fill="#E50914" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Bookings" fill="#252525" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── 5. TOP SELLING FOOD ITEMS & INSIGHTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Selling Food Items */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#FEE2E2] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E50914]" />
              <h3 className="text-base font-black text-[#252525]">Top-Selling Food Items</h3>
            </div>
            <span className="text-[10px] font-black text-stone-400 uppercase">By Volume</span>
          </div>

          {topSellingFood.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400 font-bold">
              No food sales recorded in this period yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topSellingFood.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white border border-stone-200 text-xs font-black text-[#E50914] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-extrabold text-xs text-[#252525]">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#E50914]">{item.quantity} sold</span>
                    <span className="text-[10px] text-stone-400 font-bold block">₹{item.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data-Driven Insights */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-[#252525]">Business Highlights</h3>
            </div>
            <div className="mt-3 space-y-2.5">
              {insights.map((ins, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] text-xs font-bold text-stone-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold">Want to manage customers?</span>
            <Link
              href="/owner/customers"
              className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-black shadow-xs hover:bg-[#B71C1C] transition-all"
            >
              View Customers &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
