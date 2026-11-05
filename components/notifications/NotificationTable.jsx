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
  Check, 
  ChevronRight 
} from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { useMarkAsRead } from '@/hooks/notification';
import toast from 'react-hot-toast';

export const NotificationTable = ({ notifications }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkAsRead();

  const handleRowClick = (notification) => {
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
    if (key.includes('FOOD_ORDER') || key.includes('ORDER')) return <UtensilsCrossed className="w-4 h-4" />;
    if (key.includes('BOOKING')) return <CalendarCheck className="w-4 h-4" />;
    if (key.includes('PAYMENT') || key.includes('REFUND') || key.includes('PAYOUT')) return <CreditCard className="w-4 h-4" />;
    if (key.includes('REVIEW')) return <Star className="w-4 h-4" />;
    if (key.includes('DELIVERY') || key.includes('DRIVER')) return <Truck className="w-4 h-4" />;
    if (key.includes('CUSTOMER')) return <UserCheck className="w-4 h-4" />;
    if (key.includes('SUBSCRIPTION')) return <Crown className="w-4 h-4" />;
    return <Bell className="w-4 h-4" />;
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
    <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-xs">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <tbody className="divide-y divide-border/50 text-sm">
            {notifications.map((notification) => (
              <tr 
                key={notification.id} 
                onClick={() => handleRowClick(notification)}
                className={`hover:bg-[#FFF5F5]/30 transition-colors cursor-pointer group ${!notification.is_read ? 'bg-[#FFF5F5]/40' : ''}`}
              >
                <td className="px-5 py-4 w-10">
                  {!notification.is_read ? (
                    <div className="w-2.5 h-2.5 bg-[#E50914] rounded-full animate-pulse shadow-xs"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  )}
                </td>
                
                <td className="px-2 py-4 w-14">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${getIconColor(notification.type, notification.category)}`}>
                    {getIcon(notification.type, notification.category)}
                  </div>
                </td>

                <td className="px-4 py-4 w-1/3">
                  <div className={`text-sm mb-1 ${!notification.is_read ? 'font-extrabold text-[#252525]' : 'font-semibold text-text/80'}`}>
                    {notification.title}
                  </div>
                  <NotificationBadge 
                    type={notification.notification_type || notification.type} 
                    category={notification.category}
                    priority={notification.priority}
                  />
                </td>

                <td className="px-4 py-4 w-2/5">
                  <div className="text-xs sm:text-sm text-text/75 line-clamp-1">
                    {notification.message}
                  </div>
                  {notification.food_orders && (
                    <span className="text-[10px] font-bold text-rose-700">
                      Order #{notification.food_orders.order_number}
                    </span>
                  )}
                  {notification.bookings && (
                    <span className="text-[10px] font-bold text-emerald-700">
                      Booking #{notification.bookings.booking_number}
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-right text-xs text-text/50 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-[11px] font-medium text-text/50">
                      {new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReadMutation.mutate(notification.id);
                          toast.success('Notification marked as read');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                        title="Mark this notification as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <div className="text-text/30 group-hover:text-[#E50914] group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
