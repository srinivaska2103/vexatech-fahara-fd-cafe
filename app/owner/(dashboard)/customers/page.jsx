'use client';
import React, { useState } from 'react';
import { useCustomers, useCustomerAnalytics } from '@/hooks/customer';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { EmptyCustomerState } from '@/components/customers/EmptyCustomerState';
import { LoadingSkeleton } from '@/components/customers/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  BarChart3, 
  Grid, 
  List as ListIcon, 
  Search, 
  Users, 
  Sparkles, 
  IndianRupee, 
  UserCheck, 
  Download, 
  RefreshCw,
  ShoppingBag,
  Utensils,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuthStore } from '@/store/auth.store';
import { useCafes } from '@/hooks/cafe';

export default function CustomersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL'); // ALL | FOOD_ORDER | TABLE_BOOKING | MULTIPLE | REPEAT | VIP
  const [spendingFilter, setSpendingFilter] = useState('ALL'); // ALL | HIGH | MEDIUM | LOW

  const userRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const { data: cafesData } = useCafes();
  const cafeList = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const isRestaurant = true; // Grab2GO is unified for all food & table partners

  const { data: customerRes, isLoading, isError, error, refetch } = useCustomers({ search });
  const { data: analyticsRes } = useCustomerAnalytics();
  const rawCustomers = Array.isArray(customerRes?.data) ? customerRes.data : (Array.isArray(customerRes) ? customerRes : []);
  const analyticsData = analyticsRes?.data || null;

  // Filter customers based on source, spending & search
  const customers = rawCustomers.filter(c => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (c.name || '').toLowerCase().includes(searchLower) ||
      (c.email || '').toLowerCase().includes(searchLower) ||
      (c.phone || '').toLowerCase().includes(searchLower) ||
      (c.id || '').toLowerCase().includes(searchLower);

    let matchesSource = true;
    if (sourceFilter === 'FOOD_ORDER') {
      matchesSource = c.customer_source === 'FOOD_ORDER' || (c.total_food_orders || 0) > 0;
    } else if (sourceFilter === 'TABLE_BOOKING') {
      matchesSource = c.customer_source === 'TABLE_BOOKING' || (c.total_bookings || 0) > 0;
    } else if (sourceFilter === 'MULTIPLE') {
      matchesSource = c.customer_source === 'MULTIPLE' || ((c.total_food_orders || 0) > 0 && (c.total_bookings || 0) > 0);
    } else if (sourceFilter === 'REPEAT') {
      matchesSource = ((c.total_bookings || 0) + (c.total_food_orders || 0)) > 1;
    } else if (sourceFilter === 'VIP') {
      matchesSource = Boolean(c.is_vip);
    }

    let matchesSpending = true;
    const spend = Number(c.total_spend || 0);
    if (spendingFilter === 'HIGH') {
      matchesSpending = spend >= 2000;
    } else if (spendingFilter === 'MEDIUM') {
      matchesSpending = spend >= 500 && spend < 2000;
    } else if (spendingFilter === 'LOW') {
      matchesSpending = spend > 0 && spend < 500;
    }

    return matchesSearch && matchesSource && matchesSpending;
  });

  // Dynamic KPI counts
  const totalCount = rawCustomers.length;
  const foodCustomersCount = analyticsData?.foodCustomers ?? rawCustomers.filter(c => (c.total_food_orders || 0) > 0).length;
  const bookingCustomersCount = analyticsData?.bookingCustomers ?? rawCustomers.filter(c => (c.total_bookings || 0) > 0).length;
  const repeatCount = analyticsData?.returningCount ?? rawCustomers.filter(c => ((c.total_bookings || 0) + (c.total_food_orders || 0)) > 1).length;
  const totalSpend = analyticsData?.totalSpend ?? rawCustomers.reduce((sum, c) => sum + (Number(c.total_spend) || 0), 0);

  const handleExportCSV = () => {
    let csv = 'Customer Name,Email,Phone,Customer Source,Food Orders,Bookings,Food Spend,Booking Spend,Total Spend,Last Activity\n';
    
    if (customers && customers.length > 0) {
      customers.forEach(c => {
        const name = c.name || 'Guest Diner';
        const email = c.email || 'N/A';
        const phone = c.phone || 'N/A';
        const source = c.customer_source || 'OTHER';
        const foodOrders = c.total_food_orders || 0;
        const bookings = c.total_bookings || 0;
        const foodSpend = c.food_spend || 0;
        const bookingSpend = c.booking_spend || 0;
        const totalSpend = c.total_spend || 0;
        const lastAct = c.last_interaction ? new Date(c.last_interaction).toLocaleDateString() : 'N/A';
        
        csv += `"${name}","${email}","${phone}","${source}","${foodOrders}","${bookings}","${foodSpend}","${bookingSpend}","${totalSpend}","${lastAct}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Grab2GO_Customers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight flex items-center gap-2">
            <span>Customer Management</span>
            <span className="text-xs font-black bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] px-2.5 py-0.5 rounded-full">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Unified directory of diners ordering food and booking tables at your restaurant
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="rounded-2xl border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#252525] hover:text-[#E50914] text-xs font-black gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>

          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#E50914] text-xs font-black gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* ── UNIFIED CUSTOMER KPI CARDS (Matches Requirements) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        
        {/* 1. Total Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#FEE2E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-[#252525]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
              {totalCount}
            </div>
            <p className="text-[10px] text-stone-400 font-medium mt-0.5">Across all food &amp; bookings</p>
          </div>
        </div>

        {/* 2. Food Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFF5F5] border border-[#FEE2E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914]">Food Customers</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-[#FEE2E2] flex items-center justify-center text-[#E50914]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#E50914] tracking-tight">
              {foodCustomersCount}
            </div>
            <p className="text-[10px] text-stone-500 font-medium mt-0.5">Placed takeaway/delivery orders</p>
          </div>
        </div>

        {/* 3. Booking Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Booking Customers</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
              {bookingCustomersCount}
            </div>
            <p className="text-[10px] text-stone-400 font-medium mt-0.5">Reserved tables at venue</p>
          </div>
        </div>

        {/* 4. Returning Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#FEE2E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Returning Diners</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-center text-[#E50914]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
              {repeatCount}
            </div>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
              {totalCount > 0 ? `${Math.round((repeatCount / totalCount) * 100)}% retention rate` : '0% retention rate'}
            </p>
          </div>
        </div>

      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR ── */}
      <div className="p-4 rounded-3xl bg-white border border-[#FEE2E2] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, email or customer ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs font-bold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E50914]/30 focus:border-[#E50914] transition-all"
            />
          </div>

          {/* Source Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Customers' },
              { id: 'FOOD_ORDER', label: 'Food Orders' },
              { id: 'TABLE_BOOKING', label: 'Table Bookings' },
              { id: 'MULTIPLE', label: 'Both' },
              { id: 'REPEAT', label: 'Returning' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSourceFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  sourceFilter === tab.id
                    ? 'bg-[#E50914] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#FFF5F5] text-stone-600 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spending Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={spendingFilter}
              onChange={(e) => setSpendingFilter(e.target.value)}
              aria-label="Filter customers by spending"
              className="px-3 py-2 rounded-2xl bg-white border border-stone-200 text-xs font-black text-stone-700 focus:outline-none focus:border-[#E50914]"
            >
              <option value="ALL">All Spending</option>
              <option value="HIGH">High Spender (&gt; ₹2,000)</option>
              <option value="MEDIUM">Medium Spender (₹500 - ₹2,000)</option>
              <option value="LOW">Low Spender (&lt; ₹500)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-stone-200 rounded-2xl p-0.5 bg-stone-50">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#E50914] shadow-xs' : 'text-stone-400'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#E50914] shadow-xs' : 'text-stone-400'
                }`}
                title="Card Grid View"
                aria-label="Card Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── CUSTOMER TABLE OR GRID ── */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : customers.length > 0 ? (
        viewMode === 'list' ? (
          <CustomerTable customers={customers} isRestaurant={isRestaurant} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} isRestaurant={isRestaurant} />
            ))}
          </div>
        )
      ) : (
        <EmptyCustomerState 
          hasFilter={!!search || sourceFilter !== 'ALL' || spendingFilter !== 'ALL'}
          onReset={() => {
            setSearch('');
            setSourceFilter('ALL');
            setSpendingFilter('ALL');
          }}
        />
      )}

    </div>
  );
}
