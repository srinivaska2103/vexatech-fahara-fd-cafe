import React from 'react';
import { cn } from '@/utils/cn';

export const PageContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in", className)}>
      {children}
    </div>
  );
};

export const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text/60">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
