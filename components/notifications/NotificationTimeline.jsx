import React from 'react';
import { Send, CheckCircle2, Eye, CircleDot } from 'lucide-react';

export const NotificationTimeline = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm h-full">
      <h3 className="text-lg font-semibold text-text mb-6">Delivery Timeline</h3>
      
      <div className="relative border-l-2 border-primary/20 ml-3 md:ml-4 space-y-8 pb-4">
        
        {/* Generated */}
        <div className="relative pl-6 md:pl-8">
          <div className="absolute -left-[11px] top-1 w-5 h-5 bg-surface border-2 border-primary/40 rounded-full flex items-center justify-center">
             <CircleDot className="w-3 h-3 text-primary/60" />
          </div>
          <div className="text-sm font-medium text-text">Notification Generated</div>
          <div className="text-xs text-text/50 mt-1">{new Date(notification.created_at).toLocaleString()}</div>
        </div>

        {/* Delivered / Sent via channel */}
        <div className="relative pl-6 md:pl-8">
          <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center">
             <Send className="w-3 h-3 text-amber-500" />
          </div>
          <div className="text-sm font-medium text-text">Delivered via In-App</div>
          <div className="text-xs text-text/50 mt-1">{new Date(notification.created_at).toLocaleString()}</div>
        </div>

        {/* Read Status */}
        {notification.is_read ? (
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary border-2 border-primary rounded-full flex items-center justify-center">
               <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm font-medium text-text">Marked as Read</div>
            <div className="text-xs text-text/50 mt-1">Read by Owner</div>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-surface border-2 border-border border-dashed rounded-full flex items-center justify-center">
               <Eye className="w-3 h-3 text-text/30" />
            </div>
            <div className="text-sm font-medium text-text/50 italic">Unread</div>
          </div>
        )}
      </div>
    </div>
  );
};
