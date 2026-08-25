import React from 'react';
import { cn } from '@/utils/cn';

export const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-medium leading-none text-text mb-2",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = 'Label';
