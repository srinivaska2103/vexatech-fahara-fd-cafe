import React from 'react';
import { Clock, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ReviewTimeline = ({ review }) => {
  if (!review) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-text mb-6">Interaction Timeline</h3>
      
      <div className="relative border-l-2 border-primary/20 ml-3 md:ml-4 space-y-8 pb-4">
        
        {/* Booking Creation */}
        {review.booking_date && (
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-surface border-2 border-primary/40 rounded-full flex items-center justify-center">
               <Clock className="w-3 h-3 text-primary/60" />
            </div>
            <div className="text-sm font-medium text-text">Booking Completed</div>
            <div className="text-xs text-text/50 mt-1">{new Date(review.booking_date).toLocaleDateString()}</div>
          </div>
        )}

        {/* Review Left */}
        <div className="relative pl-6 md:pl-8">
          <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-amber-400 rounded-full" />
          </div>
          <div className="text-sm font-medium text-text">Customer Left Review</div>
          <div className="text-xs text-text/50 mt-1">{new Date(review.created_at).toLocaleString()}</div>
        </div>

        {/* Reply */}
        {review.reply ? (
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary border-2 border-primary rounded-full flex items-center justify-center">
               <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm font-medium text-text">You Replied</div>
            <div className="text-xs text-text/50 mt-1">{new Date(review.reply.created_at).toLocaleString()}</div>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-surface border-2 border-border border-dashed rounded-full flex items-center justify-center">
               <MessageSquare className="w-3 h-3 text-text/30" />
            </div>
            <div className="text-sm font-medium text-text/50 italic">Awaiting your reply...</div>
          </div>
        )}
      </div>
    </div>
  );
};
