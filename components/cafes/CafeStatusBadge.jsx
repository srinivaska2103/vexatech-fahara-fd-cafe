'use client';
import React from 'react';
import { cn } from '@/utils/cn';

export const CafeStatusBadge = ({ status, className }) => {
  let badgeColor = '';
  let dotColor = '';
  let label = status || 'PENDING';

  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED':
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      label = 'Active';
      break;
    case 'INACTIVE':
    case 'SUSPENDED':
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200/80';
      dotColor = 'bg-rose-500';
      label = status?.toUpperCase() === 'SUSPENDED' ? 'Suspended' : 'Inactive';
      break;
    case 'PENDING':
    case 'DRAFT':
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200/80';
      dotColor = 'bg-amber-500 animate-pulse';
      label = status?.toUpperCase() === 'PENDING' ? 'Pending Review' : 'Draft';
      break;
    default:
      badgeColor = 'bg-surface text-text/70 border-border/60';
      dotColor = 'bg-text/40';
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-md shadow-2xs", badgeColor, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      <span>{label}</span>
    </span>
  );
};
