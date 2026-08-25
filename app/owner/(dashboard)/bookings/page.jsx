'use client';
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar as CalendarIcon, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  IndianRupee, 
  Users, 
  Sparkles,
  RefreshCw,
  CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { BookingTable } from '@/components/bookings/BookingTable';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { useBookings, useApproveBooking, useRejectBooking, useCompleteBooking } from '@/hooks/booking';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const confirm = useConfirm();
  
  const { data: bookingsData, isLoading, refetch } = useBookings({ 
    search, 
    status: statusFilter !== 'ALL' ? statusFilter : undefined 
  });
  
  const approveMutation = useApproveBooking();
  const rejectMutation = useRejectBooking();
  const completeMutation = useCompleteBooking();

  // Safely extract array
  const rawBookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.data || bookingsData?.bookings || []);

  // Filter bookings based on status & search
  const bookings = rawBookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || (b.status || b.booking_status) === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (b.customerName || b.users?.name || '').toLowerCase().includes(searchLower) ||
      (b.customerEmail || b.users?.email || '').toLowerCase().includes(searchLower) ||
      (b.booking_number || b.id || '').toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  // Calculate dynamic metrics from real API records
  const totalCount = rawBookings.length;
  const pendingCount = rawBookings.filter(b => (b.status || b.booking_status) === 'PENDING').length;
  const confirmedCount = rawBookings.filter(b => (b.status || b.booking_status) === 'CONFIRMED').length;
  const totalRevenue = rawBookings.reduce((sum, b) => sum + (Number(b.amount || b.total_price || b.total) || 0), 0);

  const handleApprove = async (booking) => {
    const ok = await confirm({
      title: 'Approve Booking',
      message: `Approve booking for ${booking.customerName}?`,
      confirmText: 'Approve',
      type: 'success'
    });
    if (ok) {
      approveMutation.mutate({ id: booking._id || booking.id, data: {} });
    }
  };

  const handleReject = async (booking) => {
    const ok = await confirm({
      title: 'Reject Booking',
      message: `Reject booking for ${booking.customerName}?`,
      confirmText: 'Reject',
      type: 'danger'
    });
    if (ok) {
      rejectMutation.mutate({ id: booking._id || booking.id, data: { reason: 'Capacity full' } });
    }
  };

  const handleComplete = async (booking) => {
    const ok = await confirm({
      title: 'Complete Booking',
      message: `Mark booking for ${booking.customerName} as completed?`,
      confirmText: 'Mark Completed',
      type: 'success'
    });
    if (ok) {
      completeMutation.mutate({ id: booking._id || booking.id, data: {} });
    }
  };


  const formatTimeStr = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      let hours = 0;
      let minutes = 0;
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
          hours = d.getUTCHours();
          minutes = d.getUTCMinutes();
        }
      } else if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const timeOnly = timeStr.includes(' ') ? timeStr.split(' ')[0] : timeStr;
        const parts = timeOnly.split(':');
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
      } else {
        return String(timeStr);
      }
      if (isNaN(hours) || isNaN(minutes)) return String(timeStr);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch(e) {
      return String(timeStr);
    }
  };

  const handleExport = () => {
    let csv = 'Booking Ref,Customer Name,Email,Phone,Date,Time,Guests,Amount,Status\n';
    
    if (bookings && bookings.length > 0) {
      bookings.forEach(b => {
        const ref = b.booking_number || (b.id ? b.id.substring(0, 8) : 'N/A');
        const name = b.customerName || b.users?.name || 'Guest';
        const email = b.customerEmail || b.users?.email || 'N/A';
        const phone = b.customerPhone || b.users?.phone || 'N/A';
        const date = b.date || b.bookingDate ? new Date(b.date || b.bookingDate).toLocaleDateString() : 'N/A';
        const time = formatTimeStr(b.startTime || b.start_time);
        const guests = b.guests || b.guestCount || 1;
        const amount = b.amount || b.total || b.total_price || 0;
        const status = b.status || b.booking_status || 'PENDING';
        
        csv += `"${ref}","${name}","${email}","${phone}","${date}","${time}","${guests}","${amount}","${status}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_bookings_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };


  const tabs = [
    { id: 'ALL', label: 'All Reservations', count: totalCount },
    { id: 'PENDING', label: 'Pending', count: pendingCount },
    { id: 'CONFIRMED', label: 'Confirmed', count: confirmedCount },
    { id: 'COMPLETED', label: 'Completed', count: rawBookings.filter(b => (b.status || b.booking_status) === 'COMPLETED').length },
    { id: 'CANCELLED', label: 'Cancelled', count: rawBookings.filter(b => (b.status || b.booking_status) === 'CANCELLED').length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESERVATION STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Monitor diner table reservations, approve pending requests, and export financial booking records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button 
            type="button"
            onClick={handleExport}
            className="py-2.5 px-4 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <Link href="/owner/bookings/calendar">
            <Button className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all">
              <CalendarIcon className="w-4 h-4 text-white" />
              <span>Calendar View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Dynamic Reservation Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Reservations */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalCount}</p>
          <p className="text-[10px] text-text/50 font-medium">All recorded diner slots</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Action</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{pendingCount}</p>
          <p className="text-[10px] text-amber-700/80 font-bold">Requires approval</p>
        </div>

        {/* Confirmed Diners */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Confirmed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{confirmedCount}</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">Approved reservations</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#6F4E37]">₹{totalRevenue}</p>
          <p className="text-[10px] text-text/50 font-medium">Recorded booking value</p>
        </div>

      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {tabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#6F4E37] text-white shadow-2xs'
                      : 'bg-surface/50 text-[#2C1810] hover:bg-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#6F4E37]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
                placeholder="Search guest name, ref ID, or email..." 
              />
            </div>

            <button 
              onClick={() => refetch()}
              className="w-10 h-10 rounded-2xl border border-border/60 bg-surface/40 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
              title="Refresh Bookings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Bookings Data Table / Empty State */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs">
          <LoadingSkeleton type="list" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-border/60 shadow-2xs space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mx-auto">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#2C1810]">
              {search ? 'No Matching Reservations' : 'No Reservations Yet'}
            </h3>
            <p className="text-xs text-text/60 mt-1">
              {search ? 'Try adjusting your search terms or status filters.' : 'When customers book tables or event spaces, their requests will appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <BookingTable 
            bookings={bookings} 
            onApprove={handleApprove}
            onReject={handleReject}
            onComplete={handleComplete}
          />
        </motion.div>
      )}

    </div>
  );
}
