import React from 'react';

export const LoadingSkeleton = ({ count = 5 }) => {
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface/30">
         <div className="h-6 w-32 bg-surface rounded animate-pulse" />
         <div className="h-10 w-48 bg-surface rounded-xl animate-pulse" />
      </div>
      <div className="divide-y divide-border/50">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 md:p-6 flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-surface animate-pulse shrink-0" />
             <div className="flex-1 space-y-3">
               <div className="flex justify-between">
                 <div className="h-5 w-1/3 bg-surface rounded animate-pulse" />
                 <div className="h-4 w-16 bg-surface rounded animate-pulse" />
               </div>
               <div className="h-4 w-2/3 bg-surface rounded animate-pulse" />
               <div className="h-4 w-1/2 bg-surface rounded animate-pulse" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
