'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, CalendarCheck, CreditCard, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notification';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import toast from 'react-hot-toast';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'demo-1',
    title: 'New Table Reservation #RES-9402',
    message: 'Guest Srinivas booked a table for 4 guests for today at 07:30 PM.',
    type: 'BOOKING',
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: '/owner/bookings'
  },
  {
    id: 'demo-2',
    title: 'Daily Bank Payout Settled',
    message: '₹14,500 net split payout transferred to your verified HDFC bank account.',
    type: 'PAYMENT',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: '/owner/payments/settlements'
  },
  {
    id: 'demo-3',
    title: 'New 5-Star Review Received',
    message: 'Guest left a 5-star rating: "Exceptional dining experience and swift service!"',
    type: 'REVIEW',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    link: '/owner/reviews'
  }
];

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: responseData, isLoading } = useNotifications({ limit: 10 });
  const markAllReadMutation = useMarkAllAsRead();

  const apiNotifications = Array.isArray(responseData?.data) 
    ? responseData.data 
    : (Array.isArray(responseData?.data?.data) 
        ? responseData.data.data 
        : (Array.isArray(responseData) ? responseData : []));

  // Track read state locally for instant interactive responsiveness
  const [isAllRead, setIsAllRead] = useState(false);

  const notifications = apiNotifications.map(n => ({
    id: n.id || n._id,
    title: n.title || n.subject || 'Notification',
    message: n.message || n.content || n.body || '',
    type: n.notification_type || n.type || 'NOTIFICATION',
    is_read: isAllRead || n.is_read === true || n.status === 'READ',
    created_at: n.created_at || n.sent_at || new Date().toISOString(),
    link: n.booking_id ? `/owner/bookings` : (n.link || '/owner/bookings')
  }));

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = (e) => {
    if (e) e.stopPropagation();
    setIsAllRead(true);
    markAllReadMutation.mutate();
    toast.success('All notifications marked as read!');
  };

  const getIcon = (type) => {
    if (type?.includes('BOOKING')) return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
    if (type?.includes('PAYMENT')) return <CreditCard className="w-4 h-4 text-blue-600" />;
    if (type?.includes('REVIEW')) return <Star className="w-4 h-4 text-amber-500" />;
    return <Sparkles className="w-4 h-4 text-[#6F4E37]" />;
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-2xl bg-surface/80 hover:bg-white text-text/70 hover:text-primary border border-border hover:border-primary/40 flex items-center justify-center transition-all shadow-2xs group cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-[#6F4E37] group-hover:scale-110 transition-transform stroke-[2]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-0 left-3 sm:left-auto mt-0 sm:mt-3 sm:w-96 bg-white rounded-3xl shadow-2xl border border-border/80 overflow-hidden z-50 animate-fade-in origin-top-right">
          
          {/* Top Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-[#FFF8F0]/70">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#2C1810] text-sm">Notifications</h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                  {unreadCount} new
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full">
                  ✓ Up to date
                </span>
              )}
            </div>

            <button 
              type="button"
              onClick={handleMarkAllRead} 
              className="text-xs text-[#6F4E37] hover:text-[#2C1810] font-extrabold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF8F0] border border-[#DDB892]/60 hover:border-[#6F4E37] transition-all cursor-pointer shadow-2xs"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark read</span>
            </button>
          </div>
          
          {/* Notification Items List */}
          <div className="max-h-[360px] sm:max-h-[320px] overflow-y-auto custom-scrollbar divide-y divide-border/30">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <Link href={notif.link || '#'} key={notif.id} onClick={() => setIsOpen(false)}>
                    <div className={cn(
                      "px-4 py-3.5 hover:bg-[#FFF8F0]/80 transition-colors cursor-pointer space-y-1 relative border-b border-border/30 flex items-start gap-3",
                      !notif.is_read ? "bg-[#FFF8F0]/40" : "bg-white"
                    )}>
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={cn("text-xs leading-snug", !notif.is_read ? "font-extrabold text-[#2C1810]" : "font-semibold text-text/80")}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-medium text-text/40 shrink-0">
                            {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-text/60 line-clamp-2 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-10 text-center text-text/40 space-y-2">
                <Bell className="w-8 h-8 mx-auto stroke-[1.5] text-text/30" />
                <p className="text-xs font-semibold">No notifications</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-border/40 bg-surface/40 text-center">
            <Link href="/owner/notifications" onClick={() => setIsOpen(false)}>
              <button className="text-xs font-extrabold text-[#6F4E37] hover:text-[#2C1810] py-1.5 px-3 w-full rounded-xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <span>View all notifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};
