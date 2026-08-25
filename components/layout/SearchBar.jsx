'use client';
import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="relative w-full max-w-xs lg:max-w-sm hidden md:block">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <Search className="w-4 h-4 text-primary/70" />
      </div>
      <input
        type="search"
        placeholder="Search cafes, bookings, customers..."
        className="w-full pl-9.5 pr-10 py-2 h-9 text-xs rounded-full bg-surface/70 border border-border text-text placeholder:text-text/40 hover:bg-white hover:border-primary/40 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-2xs font-medium"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
        <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-text/50 bg-white border border-border rounded-md shadow-2xs font-mono">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};
