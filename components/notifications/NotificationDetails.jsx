import React from 'react';
import { Bell, CreditCard, Star, CalendarCheck, Info, Clock, ExternalLink } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { Button } from '../ui/Button';

export const NotificationDetails = ({ notification }) => {
  if (!notification) return null;

  const getIcon = (type) => {
    if (type?.includes('BOOKING')) return <CalendarCheck className="w-8 h-8" />;
    if (type?.includes('PAYMENT')) return <CreditCard className="w-8 h-8" />;
    if (type?.includes('REVIEW')) return <Star className="w-8 h-8" />;
    if (type?.includes('SYSTEM')) return <Info className="w-8 h-8" />;
    return <Bell className="w-8 h-8" />;
  };

  const getIconColor = (type) => {
    if (type?.includes('BOOKING')) return "bg-green-100 text-green-700";
    if (type?.includes('PAYMENT')) return "bg-blue-100 text-blue-700";
    if (type?.includes('REVIEW')) return "bg-amber-100 text-amber-700";
    if (type?.includes('SYSTEM')) return "bg-surface text-text/60";
    return "bg-primary/10 text-primary";
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <NotificationBadge type={notification.type} />
            {notification.priority === 'HIGH' && (
               <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-danger/10 text-danger border border-danger/20">High Priority</span>
            )}
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-text mb-2">{notification.title}</h2>
          
          <div className="flex items-center gap-2 text-sm text-text/50">
            <Clock className="w-4 h-4" />
            {new Date(notification.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-surface/30 p-6 rounded-2xl border border-border/50 text-text/80 leading-relaxed flex-1 mb-8 whitespace-pre-wrap">
        {notification.message}
      </div>

      {notification.action_url && (
        <div className="mt-auto border-t border-border/50 pt-6 flex justify-end">
          <Button 
            onClick={() => window.open(notification.action_url, '_blank')}
            className="flex items-center gap-2 shadow-md"
          >
            View Details <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
