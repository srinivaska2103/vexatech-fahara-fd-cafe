import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export const NotificationSearch = ({ value, onChange, placeholder = "Search notifications..." }) => {
  return (
    <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 h-4 text-[#6F4E37]" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full h-10 pl-10 pr-4 bg-[#FFF8F0] border border-[#DDB892]/80 rounded-2xl text-xs font-bold",
          "placeholder:text-stone-400 text-[#2C1810] focus:bg-[#FFF5EA] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 focus:border-[#6F4E37] transition-all shadow-2xs"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

