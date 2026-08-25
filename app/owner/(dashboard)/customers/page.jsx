'use client';
import React, { useState } from 'react';
import { useCustomers } from '@/hooks/customer';
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
  RefreshCw 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('ALL');

  const { data: customerRes, isLoading, isError, error, refetch } = useCustomers({ search });
  const rawCustomers = Array.isArray(customerRes?.data) ? customerRes.data : (Array.isArray(customerRes) ? customerRes : []);

  // Filter customers based on segment & search
  const customers = rawCustomers.filter(c => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (c.name || '').toLowerCase().includes(searchLower) ||
      (c.email || '').toLowerCase().includes(searchLower) ||
      (c.phone || '').toLowerCase().includes(searchLower);

    let matchesSegment = true;
    if (segmentFilter === 'REPEAT') {
      matchesSegment = (c.total_bookings || 0) > 1;
    } else if (segmentFilter === 'VIP') {
      matchesSegment = Boolean(c.is_vip);
    } else if (segmentFilter === 'BLOCKED') {
      matchesSegment = c.status === 'BLOCKED';
    }

    return matchesSearch && matchesSegment;
  });

  // Dynamic stats
  const totalCount = rawCustomers.length;
  const repeatCount = rawCustomers.filter(c => (c.total_bookings || 0) > 1).length;
  const totalSpend = rawCustomers.reduce((sum, c) => sum + (Number(c.total_spend) || 0), 0);
  const avgSpend = totalCount > 0 ? Math.round(totalSpend / totalCount) : 0;

  const handleExportCSV = () => {
    let csv = 'Customer Name,Email,Phone,Total Bookings,Total Spend,Joined Date,Status\n';
    
    if (customers && customers.length > 0) {
      customers.forEach(c => {
        const name = c.name || 'Guest Diner';
        const email = c.email || 'N/A';
        const phone = c.phone || 'N/A';
        const bookings = c.total_bookings || 0;
        const spend = c.total_spend || 0;
        const joined = c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A';
        const status = c.status || 'ACTIVE';
        
        csv += `"${name}","${email}","${phone}","${bookings}","${spend}","${joined}","${status}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_customers_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const segments = [
    { id: 'ALL', label: 'All Diners', count: totalCount },
    { id: 'REPEAT', label: 'Repeat Regulars', count: repeatCount },
    { id: 'VIP', label: 'VIP Diners', count: rawCustomers.filter(c => c.is_vip).length },
    { id: 'BLOCKED', label: 'Blocked', count: rawCustomers.filter(c => c.status === 'BLOCKED').length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOMER RELATIONSHIP STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Track guest reservation histories, diner profiles, lifetime value (LTV), and repeat loyalty engagements.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button 
            type="button"
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <Button 
            onClick={() => router.push('/owner/customers/analytics')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-white" />
            <span>Customer Analytics</span>
          </Button>
        </div>
      </div>

      {/* 4 Dynamic Customer Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Diners */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Registered Diners</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalCount}</p>
          <p className="text-[10px] text-text/50 font-medium">All recorded customer accounts</p>
        </div>

        {/* Repeat Regulars */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Repeat Regulars</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{repeatCount}</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">Multiple venue bookings</p>
        </div>

        {/* Total Diner Spend (LTV) */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase tracking-wider">Total LTV Spend</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#6F4E37]">₹{totalSpend.toLocaleString()}</p>
          <p className="text-[10px] text-text/50 font-medium">Gross customer revenue</p>
        </div>

        {/* Avg Spend / Diner */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-wider">Avg Spend / Diner</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">₹{avgSpend.toLocaleString()}</p>
          <p className="text-[10px] text-text/50 font-medium">Average lifetime value</p>
        </div>

      </div>

      {/* Toolbar & Segment Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Segment Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {segments.map((seg) => {
              const isActive = segmentFilter === seg.id;
              return (
                <button
                  key={seg.id}
                  onClick={() => setSegmentFilter(seg.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#6F4E37] text-white shadow-2xs'
                      : 'bg-surface/50 text-[#2C1810] hover:bg-surface'
                  }`}
                >
                  <span>{seg.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#6F4E37]'
                  }`}>
                    {seg.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
                placeholder="Search name, email, phone..." 
              />
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-surface/60 p-1 rounded-2xl border border-border/40 shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => refetch()}
              className="w-10 h-10 rounded-2xl border border-border/60 bg-surface/40 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
              title="Refresh Customers"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content List / Grid / Empty State */}
      {isLoading ? (
        <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'table'} />
      ) : isError ? (
        <div className="bg-rose-500/10 text-rose-700 p-6 rounded-3xl border border-rose-500/20 text-center text-xs">
          <p className="font-extrabold text-sm mb-1">Unable to Load Customers</p>
          <p>{error?.message || 'Please check backend connection and retry.'}</p>
        </div>
      ) : customers.length === 0 ? (
        <EmptyCustomerState 
          showClear={Boolean(search || segmentFilter !== 'ALL')}
          onClear={() => {
            setSearch('');
            setSegmentFilter('ALL');
          }}
        />
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'list' ? (
            <CustomerTable customers={customers} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {customers.map(customer => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}
