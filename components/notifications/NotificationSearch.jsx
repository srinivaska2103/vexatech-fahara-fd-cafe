import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export const NotificationSearch = ({ value, onChange, placeholder = "Search notifications..." }) => {
  return (
    <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 h-4 text-[#E50914]" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full h-10 pl-10 pr-4 bg-[#FFF5F5] border border-[#EF5350]/80 rounded-2xl text-xs font-bold",
          "placeholder:text-stone-400 text-[#252525] focus:bg-[#FFF5F5] focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914] transition-all shadow-2xs"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

