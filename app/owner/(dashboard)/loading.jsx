import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';

export default function DashboardLoading() {
  return (
    <PageContainer className="animate-pulse">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-border/50 rounded-lg"></div>
          <div className="h-4 w-48 bg-border/30 rounded-lg"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-border/40 rounded-lg"></div>
          <div className="h-9 w-32 bg-border/40 rounded-lg"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-border shadow-sm h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-10 h-10 bg-border/40 rounded-lg"></div>
              <div className="w-16 h-6 bg-border/30 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-border/30 rounded"></div>
              <div className="h-6 w-32 bg-border/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
