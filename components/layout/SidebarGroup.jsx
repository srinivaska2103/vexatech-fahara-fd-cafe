'use client';
import React, { useState } from 'react';
import { useLayoutStore } from '@/store/layout.store';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SidebarGroup = ({ label, children }) => {
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-0.5 mt-1.5 first:mt-0">
      {!isSidebarCollapsed && label && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#FFF8F0] transition-all cursor-pointer group/header select-none"
        >
          <span className="text-[9.5px] font-black tracking-widest text-[#8C6D58] group-hover/header:text-[#6F4E37] uppercase transition-colors">
            {label}
          </span>
          <div className="w-5 h-5 rounded-lg bg-[#FAF5EF] group-hover/header:bg-[#6F4E37] group-hover/header:text-white text-[#8C6D58] flex items-center justify-center transition-all duration-300 shadow-2xs">
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-0' : '-rotate-90'}`} 
            />
          </div>
        </button>
      )}
      {isSidebarCollapsed && label && (
        <div className="h-px bg-border/40 my-0.5 mx-2" />
      )}
      {(isOpen || isSidebarCollapsed) && (
        <div className={cn(
          "space-y-0.5 transition-all duration-300 ease-in-out",
          !isSidebarCollapsed && "pl-2 border-l border-[#6F4E37]/15 ml-2.5 my-1"
        )}>
          {children}
        </div>
      )}
    </div>
  );
};
