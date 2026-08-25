'use client';
import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { Activity, Calendar, Star, DollarSign, Edit3, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDistanceToNow, format } from 'date-fns';

const getIcon = (type) => {
  switch (type) {
    case 'booking_created': return <Calendar className="w-3.5 h-3.5 text-primary stroke-[2.5]" />;
    case 'booking_cancelled': return <XCircle className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />;
    case 'review_added': return <Star className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />;
    case 'payment_received': return <DollarSign className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />;
    case 'cafe_updated': return <Edit3 className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />;
    default: return <Activity className="w-3.5 h-3.5 text-text/50 stroke-[2.5]" />;
  }
};

export const ActivityTimeline = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSkeleton type="list" className="rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={Activity} 
        title="No Activity Yet" 
        message="Your recent venue events and administrative activities will appear here."
        className="rounded-3xl"
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border/70 shadow-sm p-6 space-y-6">
      <div className="pb-4 border-b border-border/40">
        <h3 className="text-lg font-bold text-text">Activity Stream</h3>
        <p className="text-xs text-text/50">Recent automated events & system logs</p>
      </div>
      
      <div className="relative pl-3 space-y-5">
        {/* Timeline Vertical Line */}
        <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/30 via-border/50 to-transparent" />
        
        {data.map((item, i) => (
          <div key={item.id || i} className="relative flex items-start gap-4 group">
            <div className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-border shadow-xs shrink-0 group-hover:scale-110 group-hover:border-primary transition-all">
              {getIcon(item.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text group-hover:text-primary transition-colors">{item.title}</p>
              <p className="text-xs text-text/60 mt-0.5 leading-relaxed">{item.description}</p>
              <span className="text-[10px] font-semibold text-text/40 mt-1 block">
                {item.time ? `${formatDistanceToNow(new Date(item.time), { addSuffix: true })} • ${format(new Date(item.time), 'MMM d, yyyy h:mm a')}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
