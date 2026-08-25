import React from 'react';
import { cn } from '@/utils/cn';

export const LoadingSkeleton = ({ className, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className={cn("bg-white p-5 rounded-2xl border border-border animate-pulse", className)}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-border/40 rounded-lg"></div>
          <div className="w-16 h-6 bg-border/30 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-border/30 rounded"></div>
          <div className="h-8 w-32 bg-border/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={cn("bg-white p-6 rounded-2xl border border-border animate-pulse space-y-6", className)}>
        <div className="h-6 w-48 bg-border/40 rounded mb-6"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-border/30 rounded-full shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-border/40 rounded"></div>
              <div className="h-3 w-1/4 bg-border/30 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-border/20 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn("bg-white p-6 rounded-2xl border border-border animate-pulse flex flex-col", className)}>
        <div className="h-6 w-40 bg-border/40 rounded mb-8"></div>
        <div className="flex-1 flex items-end gap-2 px-4">
          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
            <div key={i} className="flex-1 bg-border/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    );
  }

  return <div className={cn("animate-pulse bg-border/40 rounded-lg", className)}></div>;
};
