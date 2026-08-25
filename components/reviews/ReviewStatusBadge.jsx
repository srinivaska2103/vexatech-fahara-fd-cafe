import React from 'react';
import { cn } from '@/utils/cn';

export const ReviewStatusBadge = ({ hasReplied }) => {
  if (hasReplied) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-green-100 text-green-700 border border-green-200"
      )}>
        Replied
      </span>
    );
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      "bg-amber-100 text-amber-700 border border-amber-200"
    )}>
      Needs Reply
    </span>
  );
};
