import React from 'react';

export const LoadingSkeleton = ({ type = 'table', count = 5 }) => {
  
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-32 bg-surface rounded-3xl animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return <div className="h-[400px] w-full bg-surface rounded-3xl animate-pulse border border-border/50" />;
  }

  // Default to Table Skeleton
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-surface/30">
         <div className="h-6 w-32 bg-surface rounded animate-pulse" />
         <div className="h-10 w-64 bg-surface rounded-xl animate-pulse" />
      </div>
      <div className="p-4 md:p-6 space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-border/50 pb-6 last:border-0 last:pb-0">
             <div className="space-y-2 w-1/4">
               <div className="h-4 w-32 bg-surface rounded animate-pulse" />
               <div className="h-3 w-20 bg-surface rounded animate-pulse" />
             </div>
             <div className="space-y-2 w-1/4 hidden md:block">
               <div className="h-4 w-24 bg-surface rounded animate-pulse" />
             </div>
             <div className="w-1/4">
               <div className="h-6 w-20 bg-surface rounded-full animate-pulse" />
             </div>
             <div className="w-1/4 flex justify-end">
               <div className="h-5 w-24 bg-surface rounded animate-pulse" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
