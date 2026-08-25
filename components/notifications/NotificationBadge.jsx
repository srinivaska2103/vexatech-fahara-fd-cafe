import React from 'react';
import { cn } from '@/utils/cn';

export const NotificationBadge = ({ type, className }) => {
  let badgeClasses = "";
  let label = type;

  switch (type) {
    case 'BOOKING_CREATED':
    case 'BOOKING_APPROVED':
    case 'BOOKING_COMPLETED':
      badgeClasses = "bg-green-100 text-green-700";
      label = "Booking";
      break;
    case 'BOOKING_CANCELLED':
      badgeClasses = "bg-danger/10 text-danger";
      label = "Cancelled";
      break;
    case 'NEW_REVIEW':
      badgeClasses = "bg-amber-100 text-amber-700";
      label = "Review";
      break;
    case 'PAYMENT_RECEIVED':
      badgeClasses = "bg-blue-100 text-blue-700";
      label = "Payment";
      break;
    case 'EVENT_UPDATED':
      badgeClasses = "bg-purple-100 text-purple-700";
      label = "Event";
      break;
    case 'SYSTEM':
      badgeClasses = "bg-surface text-text/60";
      label = "System";
      break;
    default:
      badgeClasses = "bg-primary/10 text-primary";
      label = type ? type.replace('_', ' ') : "Notification";
  }

  return (
    <span className={cn(
      "inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
      badgeClasses,
      className
    )}>
      {label}
    </span>
  );
};
