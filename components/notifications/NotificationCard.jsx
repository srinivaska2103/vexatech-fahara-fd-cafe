import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  CreditCard, 
  Star, 
  CalendarCheck, 
  UtensilsCrossed,
  Truck,
  UserCheck,
  Crown,
  ChevronRight, 
  Check,
  ExternalLink 
} from 'lucide-react';
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

  const handleClick = () => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    } else {
      router.push(`/owner/notifications/${notification.id}`);
    }
  };

  const getIcon = (type, category) => {
    const key = (category || type || '').toUpperCase();
    if (key.includes('FOOD_ORDER') || key.includes('ORDER')) return <UtensilsCrossed className="w-5 h-5" />;
    if (key.includes('BOOKING')) return <CalendarCheck className="w-5 h-5" />;
    if (key.includes('PAYMENT') || key.includes('REFUND') || key.includes('PAYOUT')) return <CreditCard className="w-5 h-5" />;
    if (key.includes('REVIEW')) return <Star className="w-5 h-5" />;
    if (key.includes('DELIVERY') || key.includes('DRIVER')) return <Truck className="w-5 h-5" />;
    if (key.includes('CUSTOMER')) return <UserCheck className="w-5 h-5" />;
    if (key.includes('SUBSCRIPTION')) return <Crown className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  const getIconColor = (type, category) => {
    const key = (category || type || '').toUpperCase();
    if (key.includes('FOOD_ORDER') || key.includes('ORDER')) return "bg-rose-100 text-[#E50914]";
    if (key.includes('BOOKING')) return "bg-emerald-100 text-emerald-700";
    if (key.includes('PAYMENT') || key.includes('REFUND') || key.includes('PAYOUT')) return "bg-indigo-100 text-indigo-700";
    if (key.includes('REVIEW')) return "bg-amber-100 text-amber-700";
    if (key.includes('DELIVERY') || key.includes('DRIVER')) return "bg-cyan-100 text-cyan-700";
    if (key.includes('CUSTOMER')) return "bg-teal-100 text-teal-700";
    if (key.includes('SUBSCRIPTION')) return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className={`bg-white p-5 md:p-6 rounded-3xl border shadow-xs cursor-pointer hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${notification.is_read ? 'border-border/70' : 'border-[#E50914]/40 bg-[#FFF5F5]/40'}`}
    >
      {!notification.is_read && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#E50914] rounded-full animate-pulse shadow-xs"></div>
      )}

      <div>
        <div className="flex justify-between items-start mb-3 pr-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${getIconColor(notification.type, notification.category)}`}>
              {getIcon(notification.type, notification.category)}
            </div>
            <div>
              <h4 className={`font-semibold text-text text-sm md:text-base line-clamp-1 ${!notification.is_read ? 'font-extrabold text-[#252525]' : ''}`}>
                {notification.title}
              </h4>
              <div className="text-[11px] font-medium text-text/50 mt-0.5">
                {new Date(notification.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 pl-13">
          <p className="text-xs sm:text-sm text-text/75 line-clamp-2">
            {notification.message}
          </p>

          {/* Contextual Reference info if attached */}
          {notification.food_orders && (
            <div className="mt-2 text-[11px] font-bold text-rose-700 bg-rose-50/80 px-2 py-1 rounded-lg inline-block border border-rose-100">
              Order #{notification.food_orders.order_number} • ₹{Number(notification.food_orders.total_amount).toFixed(2)}
            </div>
          )}
          {notification.bookings && (
            <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg inline-block border border-emerald-100">
              Booking #{notification.bookings.booking_number} • {notification.bookings.users?.name || 'Guest'}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3.5 border-t border-border/50 pl-13">
        <NotificationBadge 
          type={notification.notification_type || notification.type} 
          category={notification.category}
          priority={notification.priority}
        />
        
        <div className="flex items-center gap-1.5">
          {!notification.is_read && (
            <button
              type="button"
              onClick={handleMarkRead}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
          )}

          <div className="p-1 rounded-lg text-text/40 hover:text-[#E50914] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
