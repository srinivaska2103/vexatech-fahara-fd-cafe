'use client';
import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { Star, MessageSquare, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const RecentReviews = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSkeleton type="list" className="rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={MessageSquare} 
        title="No Reviews Yet" 
        message="Customer reviews and ratings will appear here."
        className="rounded-3xl"
      />
    );
  }

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h3 className="text-lg font-bold text-text">Customer Reviews</h3>
          <p className="text-xs text-text/50">Recent rating & feedback from guests</p>
        </div>
        <Link 
          href="/owner/reviews" 
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors group"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {data.map((review) => (
          <div key={review.id} className="p-4 rounded-2xl border border-border/40 bg-surface/30 space-y-2.5 hover:bg-surface/60 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(review.customerName)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text">{review.customerName}</h4>
                  <span className="text-[11px] font-medium text-text/40">
                    {new Date(review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{review.rating || '5.0'}</span>
              </div>
            </div>

            <p className="text-xs text-text/80 leading-relaxed italic line-clamp-3 pl-1">
              "{review.comment}"
            </p>

            {!review.replied && (
              <div className="pt-1 flex justify-end">
                <Link href="/owner/reviews" className="text-[11px] font-bold text-primary hover:underline">
                  Reply to review →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
