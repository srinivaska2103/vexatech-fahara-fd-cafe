'use client';
import React, { useState } from 'react';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notification';
import { NotificationTable } from '@/components/notifications/NotificationTable';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationSearch } from '@/components/notifications/NotificationSearch';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { EmptyNotificationState } from '@/components/notifications/EmptyNotificationState';
import { LoadingSkeleton } from '@/components/notifications/LoadingSkeleton';
import { MarkAllReadDialog } from '@/components/notifications/MarkAllReadDialog';
import { Button } from '@/components/ui/Button';
import { 
  CheckCheck, 
  Grid, 
  List as ListIcon, 
  Bell, 
  BellRing, 
  CalendarCheck, 
  CreditCard,
  Sparkles,
  FilterX,
  SlidersHorizontal,
  UtensilsCrossed
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    type: ''
  });
  
  const [isMarkAllDialogOpen, setIsMarkAllDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useNotifications({ 
    search, 
    status: filters.status,
    priority: filters.priority,
    category: filters.category || filters.type
  });
  
  const markAllAsReadMutation = useMarkAllAsRead();
  
  const notifications = data?.data || [];
  const stats = data?.stats || {};

  // Unread count and breakdown
  const unreadCount = stats.unread !== undefined 
    ? stats.unread 
    : notifications.filter(n => !n.is_read && n.status !== 'READ').length;

  const totalCount = stats.total !== undefined ? stats.total : notifications.length;
  const foodOrderCount = stats.foodOrders !== undefined 
    ? stats.foodOrders 
    : notifications.filter(n => n.category === 'FOOD_ORDER' || n.type?.includes('ORDER')).length;
  
  const bookingCount = stats.bookings !== undefined 
    ? stats.bookings 
    : notifications.filter(n => n.category === 'BOOKING' || n.type?.includes('BOOKING')).length;

  const paymentCount = stats.payments !== undefined 
    ? stats.payments 
    : notifications.filter(n => n.category === 'PAYMENT' || n.type?.includes('PAYMENT')).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#252525]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-[#FFF5F5] p-5 sm:p-6 rounded-3xl border border-[#EF5350]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] text-white flex items-center justify-center shadow-md shrink-0">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#252525] tracking-tight">Restaurant Owner Notification Centre</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-2xs">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Live centralized hub for Food Orders, Table Bookings, Payments, Reviews & System Alerts.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setIsMarkAllDialogOpen(true)}
              className="py-2 px-3.5 rounded-xl border-[#EF5350]/60 text-[#E50914] hover:bg-[#E50914]/10 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All Read
            </Button>
          )}

          <Link href="/owner/notifications/settings">
            <Button 
              variant="outline" 
              className="py-2 px-3.5 rounded-xl border-[#EF5350]/60 bg-white hover:bg-[#E50914]/10 text-[#E50914] hover:border-[#E50914]/60 text-xs font-extrabold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all group"
              title="Configure notification preferences & alert channels"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E50914] group-hover:rotate-90 transition-transform duration-300" />
              <span>Alert Settings</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 KPI STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Notifications */}
        <div 
          onClick={() => setFilters({ status: '', priority: '', category: '', type: '' })}
          className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${!filters.category && !filters.status ? 'border-[#E50914] ring-1 ring-[#E50914]/20' : 'border-border/60 hover:border-[#E50914]/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Total Alerts</span>
            <div className="w-7 h-7 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#252525] mt-1">{totalCount}</p>
          <span className="text-[10px] font-semibold text-text/50">All received</span>
        </div>

        {/* Unread Alerts */}
        <div 
          onClick={() => setFilters({ ...filters, status: 'UNREAD' })}
          className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${filters.status === 'UNREAD' ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-border/60 hover:border-amber-500/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Unread Alerts</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1">{unreadCount}</p>
          <span className="text-[10px] font-semibold text-amber-700/70">Needs attention</span>
        </div>

        {/* Food Order Notifications */}
        <div 
          onClick={() => setFilters({ ...filters, category: 'FOOD_ORDER', type: 'FOOD_ORDER' })}
          className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${filters.category === 'FOOD_ORDER' ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-border/60 hover:border-rose-500/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Food Orders</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-[#E50914] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#E50914] mt-1">{foodOrderCount}</p>
          <span className="text-[10px] font-semibold text-rose-700/70">Orders & Delivery</span>
        </div>

        {/* Booking Alerts */}
        <div 
          onClick={() => setFilters({ ...filters, category: 'BOOKING', type: 'BOOKING' })}
          className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${filters.category === 'BOOKING' ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-border/60 hover:border-emerald-500/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Bookings</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1">{bookingCount}</p>
          <span className="text-[10px] font-semibold text-emerald-700/70">Table reservations</span>
        </div>

        {/* Payment & Finance */}
        <div 
          onClick={() => setFilters({ ...filters, category: 'PAYMENT', type: 'PAYMENT' })}
          className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${filters.category === 'PAYMENT' ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-border/60 hover:border-indigo-500/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Payments & Finance</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-800 mt-1">{paymentCount}</p>
          <span className="text-[10px] font-semibold text-indigo-700/70">Revenue & Payouts</span>
        </div>
      </div>

      {/* Filter Control Bar - Single Colorful Modern Row */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-[#EF5350]/60 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <NotificationSearch value={search} onChange={setSearch} />
        
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          <NotificationFilters filters={filters} setFilters={setFilters} />
          
          {(search || filters.status || filters.priority || filters.category || filters.type) && (
            <button
              onClick={() => {
                setSearch('');
                setFilters({ status: '', priority: '', category: '', type: '' });
              }}
              className="h-10 px-3 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-extrabold flex items-center gap-1 transition-all shrink-0 shadow-2xs"
              title="Reset Search Filters"
            >
              <FilterX className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex bg-[#FFF5F5] p-1 rounded-2xl border border-[#EF5350]/60 shrink-0 h-10 items-center">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-[#E50914] text-white shadow-xs' : 'text-[#E50914]/70 hover:text-[#E50914]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-[#E50914] text-white shadow-xs' : 'text-[#E50914]/70 hover:text-[#E50914]'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content State Handling */}
      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : isError ? (
        <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl border border-rose-200 text-center">
          <p className="font-extrabold mb-1 text-sm">Error Loading Notifications</p>
          <p className="text-xs text-rose-600">{error?.message || 'Please check backend services or try refreshing the page.'}</p>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyNotificationState 
          showClear={Boolean(search || filters.status || filters.priority || filters.category || filters.type)}
          onClear={() => {
            setSearch('');
            setFilters({ status: '', priority: '', category: '', type: '' });
          }}
        />
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'list' ? (
            <NotificationTable notifications={notifications} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {notifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {/* Mark All Read Confirmation Dialog */}
      <MarkAllReadDialog 
        isOpen={isMarkAllDialogOpen}
        onClose={() => setIsMarkAllDialogOpen(false)}
        onConfirm={() => {
          markAllAsReadMutation.mutate(undefined, {
            onSuccess: () => setIsMarkAllDialogOpen(false)
          });
        }}
        isMarking={markAllAsReadMutation.isPending}
      />
    </div>
  );
}
