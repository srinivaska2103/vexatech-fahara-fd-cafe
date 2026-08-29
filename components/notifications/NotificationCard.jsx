import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CreditCard, Star, CalendarCheck, Info, ChevronRight, Check } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { useMarkAsRead } from '@/hooks/notification';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const NotificationCard = ({ notification }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkAsRead();

  if (!notification) return null;

  const handleMarkRead = (e) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notification.id);
    toast.success('Notification marked as read');
  };

  const getIcon = (type) => {
    if (type?.includes('BOOKING')) return <CalendarCheck className="w-5 h-5" />;
    if (type?.includes('PAYMENT')) return <CreditCard className="w-5 h-5" />;
    if (type?.includes('REVIEW')) return <Star className="w-5 h-5" />;
    if (type?.includes('SYSTEM')) return <Info className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  const getIconColor = (type) => {
    if (type?.includes('BOOKING')) return "bg-green-100 text-green-700";
    if (type?.includes('PAYMENT')) return "bg-blue-100 text-blue-700";
    if (type?.includes('REVIEW')) return "bg-amber-100 text-amber-700";
    if (type?.includes('SYSTEM')) return "bg-surface text-text/60";
    return "bg-primary/10 text-primary";
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/owner/notifications/${notification.id}`)}
      className={`bg-white p-5 md:p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden ${notification.is_read ? 'border-border' : 'border-[#6F4E37]/30 bg-[#FFF8F0]/40'}`}
    >
      {!notification.is_read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#6F4E37] rounded-full"></div>
      )}

      <div className="flex justify-between items-start mb-4 pr-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
          <div>
            <h4 className={`font-semibold text-text text-sm md:text-base ${!notification.is_read ? 'font-bold' : ''}`}>
              {notification.title}
            </h4>
            <div className="text-xs text-text/50 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 pl-14">
        <p className="text-sm text-text/70 line-clamp-2">
          {notification.message}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50 pl-14">
        <NotificationBadge type={notification.type} />
        
        <div className="flex items-center gap-2">
          {!notification.is_read && (
            <button
              type="button"
              onClick={handleMarkRead}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
          )}

          <div className="text-[#6F4E37] text-xs font-bold flex items-center group-hover:underline">
            View Details <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
