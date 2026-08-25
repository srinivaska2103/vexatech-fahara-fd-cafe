'use client';
import React from 'react';
import { cn } from '@/utils/cn';

export const BookingStatusBadge = ({ status, className }) => {
  let badgeColor = '';
  let label = status || 'PENDING';

  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'CONFIRMED':
      badgeColor = 'bg-primary/10 text-primary border-primary/20';
      break;
    case 'COMPLETED':
      badgeColor = 'bg-success/10 text-success border-success/20';
      break;
    case 'REJECTED':
    case 'CANCELLED':
      badgeColor = 'bg-danger/10 text-danger border-danger/20';
      break;
    case 'PENDING':
      badgeColor = 'bg-warning/10 text-warning border-warning/20';
      break;
    default:
      badgeColor = 'bg-surface text-text/60 border-border';
  }

  return (
    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border", badgeColor, className)}>
      {label}
    </span>
  );
};

export const PaymentStatusBadge = ({ status, className }) => {
  let badgeColor = '';
  let label = status || 'PENDING';

  switch (status?.toUpperCase()) {
    case 'PAID':
      badgeColor = 'bg-success/10 text-success border-success/20';
      break;
    case 'FAILED':
      badgeColor = 'bg-danger/10 text-danger border-danger/20';
      break;
    case 'REFUNDED':
      badgeColor = 'bg-surface text-text/60 border-border';
      break;
    case 'PENDING':
      badgeColor = 'bg-warning/10 text-warning border-warning/20';
      break;
    default:
      badgeColor = 'bg-surface text-text/60 border-border';
  }

  return (
    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border", badgeColor, className)}>
      {label}
    </span>
  );
};
