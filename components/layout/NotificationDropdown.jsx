'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notification';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data, isLoading } = useNotifications({ limit: 5 });
  const { mutate: markAllReadMutation } = useMarkAllAsRead();
  const notifications = data?.data || [];
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

  const markAllRead = () => {
    markAllReadMutation();
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-2xl bg-surface/80 hover:bg-white text-text/70 hover:text-primary border border-border hover:border-primary/40 flex items-center justify-center transition-all shadow-2xs group"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-text/60 group-hover:text-primary transition-colors stroke-[2]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-0 left-3 sm:left-auto mt-0 sm:mt-3 sm:w-96 bg-white rounded-3xl shadow-2xl border border-border/80 overflow-hidden z-50 animate-fade-in origin-top-right">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-surface/40">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead} 
                className="text-xs text-primary hover:text-secondary font-bold flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>
          
          <div className="max-h-[360px] sm:max-h-[320px] overflow-y-auto custom-scrollbar divide-y divide-border/30">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <Link href={notif.link || '#'} key={notif.id} onClick={() => setIsOpen(false)}>
                    <div className={cn(
                      "px-5 py-3.5 hover:bg-[#FFF8F0] transition-colors cursor-pointer space-y-1 relative bg-white border-b border-border/30",
                      !notif.is_read && "bg-[#FFF5EA]"
                    )}>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={cn("text-xs", !notif.is_read ? "font-bold text-text" : "font-medium text-text/80")}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-medium text-text/40 shrink-0">
                          {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-text/60 line-clamp-2 leading-relaxed">{notif.message}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-10 text-center text-text/40 space-y-2">
                <Bell className="w-8 h-8 mx-auto stroke-[1.5] text-text/30" />
                <p className="text-xs font-semibold">No new notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-border/40 bg-surface/40 text-center">
            <Link href="/owner/notifications" onClick={() => setIsOpen(false)}>
              <button className="text-xs font-bold text-primary hover:text-secondary py-1.5 px-3 w-full rounded-xl hover:bg-white transition-all">
                View all notifications →
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
