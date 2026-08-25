import React from 'react';
import { cn } from '@/utils/cn';

export const Input = React.forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
          error && "border-danger focus:ring-danger",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger animate-fade-in">{error}</p>
      )}
    </div>
  );
});
Input.displayName = 'Input';
