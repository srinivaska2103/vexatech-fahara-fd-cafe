import React from 'react';
import { cn } from '@/utils/cn';

export const LoadingSkeleton = ({ type = 'card', count = 3, className }) => {
  if (type === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="h-24 w-full bg-surface rounded-2xl border border-border/50 animate-pulse flex p-4 gap-4">
             <div className="w-16 h-16 bg-border/20 rounded-xl shrink-0" />
             <div className="flex-1 space-y-3 py-1">
               <div className="h-4 bg-border/20 rounded-md w-1/3" />
               <div className="h-3 bg-border/20 rounded-md w-1/4" />
             </div>
             <div className="w-24 h-8 bg-border/20 rounded-lg self-center" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden h-[380px] animate-pulse">
          <div className="h-48 bg-surface w-full" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-5 bg-surface rounded-md w-1/2" />
              <div className="h-4 bg-surface rounded-md w-1/4" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface rounded-md w-full" />
              <div className="h-3 bg-surface rounded-md w-5/6" />
            </div>
            <div className="pt-4 space-y-2">
              <div className="h-4 bg-surface rounded-md w-1/3" />
              <div className="h-10 bg-surface rounded-xl w-full mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
