import React from 'react';

export const LoadingSkeleton = ({ type = 'dashboard' }) => {
  
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse border border-border/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-[400px] bg-surface rounded-3xl animate-pulse border border-border/50" />
           <div className="lg:col-span-1 h-[400px] bg-surface rounded-3xl animate-pulse border border-border/50" />
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return <div className="h-[350px] w-full bg-surface rounded-3xl animate-pulse border border-border/50" />;
  }
  
  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  return <div className="h-64 bg-surface rounded-3xl animate-pulse border border-border/50" />;
};
