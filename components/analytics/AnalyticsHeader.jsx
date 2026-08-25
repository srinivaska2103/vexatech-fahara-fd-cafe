import React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';

export const AnalyticsHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <PageHeader title={title} description={description} />
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
