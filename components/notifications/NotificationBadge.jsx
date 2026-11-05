import React from 'react';
import { cn } from '@/utils/cn';

export const NotificationBadge = ({ type, category, priority, className }) => {
  let badgeClasses = "";
  let label = type || category || 'NOTIFICATION';

  const normalized = (type || category || '').toUpperCase();

  if (normalized.includes('FOOD_ORDER') || normalized.includes('ORDER')) {
    badgeClasses = "bg-rose-50 text-[#E50914] border border-[#E50914]/20";
    label = "Food Order";
  } else if (normalized.includes('BOOKING')) {
    badgeClasses = "bg-emerald-50 text-emerald-700 border border-emerald-200";
    label = "Booking";
  } else if (normalized.includes('PAYMENT') || normalized.includes('REFUND') || normalized.includes('PAYOUT')) {
    badgeClasses = "bg-indigo-50 text-indigo-700 border border-indigo-200";
    label = "Payment";
  } else if (normalized.includes('REVIEW')) {
    badgeClasses = "bg-amber-50 text-amber-700 border border-amber-200";
    label = "Review";
  } else if (normalized.includes('DELIVERY') || normalized.includes('DRIVER')) {
    badgeClasses = "bg-cyan-50 text-cyan-700 border border-cyan-200";
    label = "Delivery";
  } else if (normalized.includes('CUSTOMER')) {
    badgeClasses = "bg-teal-50 text-teal-700 border border-teal-200";
    label = "Customer";
  } else if (normalized.includes('SUBSCRIPTION')) {
    badgeClasses = "bg-purple-50 text-purple-700 border border-purple-200";
    label = "Subscription";
  } else {
    badgeClasses = "bg-gray-100 text-gray-700 border border-gray-200";
    label = type ? type.replace(/_/g, ' ') : "System";
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={cn(
        "inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap",
        badgeClasses,
        className
      )}>
        {label}
      </span>

      {priority && priority !== 'MEDIUM' && (
        <span className={cn(
          "inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap border",
          priority === 'CRITICAL' || priority === 'HIGH'
            ? "bg-rose-100 text-rose-800 border-rose-300"
            : "bg-slate-100 text-slate-600 border-slate-200"
        )}>
          {priority}
        </span>
      )}
    </div>
  );
};
