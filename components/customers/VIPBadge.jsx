import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/utils/cn';

export const VIPBadge = ({ isVip, className }) => {
  if (!isVip) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
      "bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider",
      className
    )}>
      <Crown className="w-3.5 h-3.5" />
      VIP
    </div>
  );
};
