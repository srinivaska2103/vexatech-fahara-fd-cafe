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
  Send, 
  CheckCheck, 
  Grid, 
  List as ListIcon, 
  Settings, 
  Bell, 
  BellRing, 
  CalendarCheck, 
  CreditCard,
  Sparkles,
  FilterX,
  SlidersHorizontal
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
    type: ''
  });
  
  const [isMarkAllDialogOpen, setIsMarkAllDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useNotifications({ search, ...filters });
  const markAllAsReadMutation = useMarkAllAsRead();
  
  const notifications = data?.data || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const bookingCount = notifications.filter(n => n.type === 'BOOKING').length;
  const paymentCount = notifications.filter(n => n.type === 'PAYMENT').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] text-white flex items-center justify-center shadow-md shrink-0">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Notification Center</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-2xs">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Stay updated with incoming venue reservations, reviews, and automated payouts.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setIsMarkAllDialogOpen(true)}
              className="py-2 px-3.5 rounded-xl border-[#DDB892]/60 text-[#6F4E37] hover:bg-[#6F4E37]/10 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All Read
            </Button>
          )}

          <Link href="/owner/notifications/settings">
            <Button 
              variant="outline" 
              className="py-2 px-3.5 rounded-xl border-[#DDB892]/60 bg-white hover:bg-[#6F4E37]/10 text-[#6F4E37] hover:border-[#6F4E37]/60 text-xs font-extrabold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all group"
              title="Configure notification preferences & alert channels"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6F4E37] group-hover:rotate-90 transition-transform duration-300" />
              <span>Alert Settings</span>
            </Button>
          </Link>

          <Link href="/owner/notifications/compose">
            <Button className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-xs hover:shadow-sm flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Compose Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Notifications */}
        <div 
          onClick={() => setFilters({ status: '', priority: '', type: '' })}
          className="p-4 rounded-2xl bg-white border border-border/60 hover:border-[#6F4E37]/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Total Alerts</span>
            <div className="w-7 h-7 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#2C1810] mt-1">{notifications.length}</p>
          <span className="text-[10px] font-semibold text-text/50">All received messages</span>
        </div>

        {/* Unread Alerts */}
        <div 
          onClick={() => setFilters({ ...filters, status: 'UNREAD' })}
          className="p-4 rounded-2xl bg-white border border-border/60 hover:border-amber-500/40 shadow-2xs transition-all cursor-pointer group"
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

        {/* Booking Alerts */}
        <div 
          onClick={() => setFilters({ ...filters, type: 'BOOKING' })}
          className="p-4 rounded-2xl bg-white border border-border/60 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Booking Updates</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1">{bookingCount}</p>
          <span className="text-[10px] font-semibold text-emerald-700/70">Reservations</span>
        </div>

        {/* Payment & Payouts */}
        <div 
          onClick={() => setFilters({ ...filters, type: 'PAYMENT' })}
          className="p-4 rounded-2xl bg-white border border-border/60 hover:border-indigo-500/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Payments & Payouts</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-800 mt-1">{paymentCount}</p>
          <span className="text-[10px] font-semibold text-indigo-700/70">Financial alerts</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-border/60 shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <NotificationSearch value={search} onChange={setSearch} />
        
        <div className="flex flex-wrap items-center gap-2.5">
          <NotificationFilters filters={filters} setFilters={setFilters} />
          
          {(search || filters.status || filters.priority || filters.type) && (
            <button
              onClick={() => {
                setSearch('');
                setFilters({ status: '', priority: '', type: '' });
              }}
              className="py-2.5 px-3 rounded-xl border border-border/60 hover:bg-surface text-text/60 hover:text-danger text-xs font-bold flex items-center gap-1 transition-colors"
              title="Reset Search Filters"
            >
              <FilterX className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex bg-surface p-1 rounded-xl border border-border/40 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37]' : 'text-text/50 hover:text-text'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-2xs text-[#6F4E37]' : 'text-text/50 hover:text-text'}`}
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
          showClear={Boolean(search || filters.status || filters.priority || filters.type)}
          onClear={() => {
            setSearch('');
            setFilters({ status: '', priority: '', type: '' });
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
