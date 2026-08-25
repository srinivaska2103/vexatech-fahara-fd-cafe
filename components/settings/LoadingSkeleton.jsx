import React from 'react';

export const LoadingSkeleton = ({ type = 'form' }) => {
  if (type === 'form') {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-surface rounded mb-8" />
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-surface rounded-xl" />
              <div className="h-12 bg-surface rounded-xl" />
           </div>
           <div className="h-24 bg-surface rounded-xl" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-12 bg-surface rounded-xl" />
              <div className="h-12 bg-surface rounded-xl" />
              <div className="h-12 bg-surface rounded-xl" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />
      ))}
    </div>
  );
};
