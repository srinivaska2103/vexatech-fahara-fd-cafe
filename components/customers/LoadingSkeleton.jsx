import React from 'react';

export const LoadingSkeleton = ({ type = 'table', count = 5 }) => {
  
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-surface animate-pulse" />
                 <div className="space-y-2">
                   <div className="h-5 w-32 bg-surface rounded animate-pulse" />
                   <div className="h-4 w-24 bg-surface rounded animate-pulse" />
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 w-full bg-surface rounded-2xl animate-pulse" />
              <div className="h-16 w-full bg-surface rounded-2xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default to Table Skeleton
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
         <div className="h-6 w-32 bg-surface rounded animate-pulse" />
         <div className="h-10 w-64 bg-surface rounded-xl animate-pulse" />
      </div>
      <div className="p-6 space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-border/50 pb-6 last:border-0 last:pb-0">
             <div className="flex items-center gap-4 w-1/4">
                <div className="w-12 h-12 rounded-full bg-surface animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-surface rounded animate-pulse" />
                  <div className="h-3 w-20 bg-surface rounded animate-pulse" />
                </div>
             </div>
             <div className="w-1/4 space-y-2">
                <div className="h-4 w-24 bg-surface rounded animate-pulse" />
             </div>
             <div className="w-1/4 space-y-2">
                <div className="h-4 w-20 bg-surface rounded animate-pulse" />
             </div>
             <div className="w-16 flex justify-end">
                <div className="h-8 w-8 bg-surface rounded-lg animate-pulse" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
