import React from 'react';
import { cn } from '@/utils/cn';

export const PaymentBadge = ({ status, className }) => {
  let badgeClasses = "";
  let label = status;

  switch (status) {
    case 'PAID':
    case 'SUCCESS':
    case 'COMPLETED':
      badgeClasses = "bg-green-100 text-green-700 border-green-200";
      label = "Paid";
      break;
    case 'PENDING':
    case 'PROCESSING':
      badgeClasses = "bg-amber-100 text-amber-700 border-amber-200";
      label = "Pending";
      break;
    case 'FAILED':
    case 'DECLINED':
      badgeClasses = "bg-danger/10 text-danger border-danger/20";
      label = "Failed";
      break;
    case 'REFUNDED':
      badgeClasses = "bg-purple-100 text-purple-700 border-purple-200";
      label = "Refunded";
      break;
    case 'PARTIALLY_REFUNDED':
      badgeClasses = "bg-indigo-100 text-indigo-700 border-indigo-200";
      label = "Partial Refund";
      break;
    default:
      badgeClasses = "bg-surface text-text/60 border-border";
      label = status || "Unknown";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap",
      badgeClasses,
      className
    )}>
      {label}
    </span>
  );
};
