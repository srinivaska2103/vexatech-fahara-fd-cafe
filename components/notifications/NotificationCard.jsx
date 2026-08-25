import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CreditCard, Star, CalendarCheck, Info, ChevronRight } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { motion } from 'framer-motion';

export const NotificationCard = ({ notification }) => {
  const router = useRouter();

  if (!notification) return null;

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
      className={`bg-white p-5 md:p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden ${notification.is_read ? 'border-border' : 'border-primary/30 bg-primary/5'}`}
    >
      {!notification.is_read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
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
         <div className="text-primary text-xs font-medium flex items-center group-hover:underline">
            View Details <ChevronRight className="w-3 h-3 ml-0.5" />
         </div>
      </div>
    </motion.div>
  );
};
