import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { DashboardOverviewSkeleton } from '@/components/common/FaharaLoadingSystem';

export default function DashboardLoading() {
  return (
    <PageContainer>
      <DashboardOverviewSkeleton statCount={4} />
    </PageContainer>
  );
}
