import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export const NotificationSearch = ({ value, onChange, placeholder = "Search notifications..." }) => {
  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text/40" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl",
          "text-sm placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors shadow-sm"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
