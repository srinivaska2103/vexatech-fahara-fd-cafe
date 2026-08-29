import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CreditCard, Star, CalendarCheck, Info, Check } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { useMarkAsRead } from '@/hooks/notification';
import toast from 'react-hot-toast';

export const NotificationTable = ({ notifications }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkAsRead();

  const getIcon = (type) => {
    if (type?.includes('BOOKING')) return <CalendarCheck className="w-4 h-4" />;
    if (type?.includes('PAYMENT')) return <CreditCard className="w-4 h-4" />;
    if (type?.includes('REVIEW')) return <Star className="w-4 h-4" />;
    if (type?.includes('SYSTEM')) return <Info className="w-4 h-4" />;
    return <Bell className="w-4 h-4" />;
  };

  const getIconColor = (type) => {
    if (type?.includes('BOOKING')) return "bg-green-100 text-green-700";
    if (type?.includes('PAYMENT')) return "bg-blue-100 text-blue-700";
    if (type?.includes('REVIEW')) return "bg-amber-100 text-amber-700";
    if (type?.includes('SYSTEM')) return "bg-surface text-text/60";
    return "bg-[#6F4E37]/10 text-[#6F4E37]";
  };

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-border/50 text-sm">
            {notifications.map((notification) => (
              <tr 
                key={notification.id} 
                onClick={() => router.push(`/owner/notifications/${notification.id}`)}
                className={`hover:bg-surface/50 transition-colors cursor-pointer group ${!notification.is_read ? 'bg-[#FFF8F0]/40' : ''}`}
              >
                <td className="px-6 py-4 w-12">
                   {!notification.is_read && (
                     <div className="w-2.5 h-2.5 bg-[#6F4E37] rounded-full"></div>
                   )}
                </td>
                
                <td className="px-2 py-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                </td>

                <td className="px-4 py-4 w-1/3">
                  <div className={`font-medium text-text mb-1 ${!notification.is_read ? 'font-extrabold text-[#2C1810]' : ''}`}>
                    {notification.title}
                  </div>
                  <NotificationBadge type={notification.type} />
                </td>

                <td className="px-4 py-4 w-1/2">
                  <div className="text-text/70 line-clamp-1">
                    {notification.message}
                  </div>
                </td>

                <td className="px-6 py-4 text-right text-xs text-text/50 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReadMutation.mutate(notification.id);
                          toast.success('Notification marked as read');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-extrabold flex items-center gap-1 transition-all shadow-2xs"
                        title="Mark this notification as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}
                    <div>
                      {new Date(notification.created_at).toLocaleDateString()}
                      <br/>
                      {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
