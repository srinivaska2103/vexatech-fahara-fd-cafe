import React from 'react';
import { LoadingSkeleton } from '@/components/payments/LoadingSkeleton';

export default function PaymentsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-surface rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-surface rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-surface rounded-xl animate-pulse" />
          <div className="h-10 w-24 bg-surface rounded-xl animate-pulse" />
        </div>
      </div>

      <LoadingSkeleton type="stats" />

      <div className="flex flex-wrap gap-3 mt-8">
        <div className="h-12 w-full md:w-64 bg-surface rounded-xl animate-pulse" />
        <div className="h-12 w-full md:w-40 bg-surface rounded-xl animate-pulse" />
      </div>

      <LoadingSkeleton type="table" count={5} />
    </div>
  );
}
