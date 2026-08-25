'use client';
import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export const TooltipProvider = ({ children }) => <>{children}</>;

export const Tooltip = ({ children, delayDuration = 200 }) => {
  return (
    <div className="group relative inline-block">
      {children}
    </div>
  );
};

export const TooltipTrigger = ({ asChild, children }) => {
  return children;
};

export const TooltipContent = ({ side = 'top', children, className }) => {
  return (
    <div
      className={cn(
        "absolute z-50 hidden px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm opacity-0 group-hover:block group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",
        {
          'bottom-full left-1/2 -translate-x-1/2 mb-2': side === 'top',
          'top-1/2 left-full -translate-y-1/2 ml-2': side === 'right',
          'top-full left-1/2 -translate-x-1/2 mt-2': side === 'bottom',
          'top-1/2 right-full -translate-y-1/2 mr-2': side === 'left',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
