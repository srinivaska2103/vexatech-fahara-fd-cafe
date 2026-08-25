'use client';
import React from 'react';
import { useLayoutStore } from '@/store/layout.store';
import { cn } from '@/utils/cn';

export const SidebarGroup = ({ label, children }) => {
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);

  return (
    <div className="flex flex-col gap-0.5 mt-1.5 first:mt-0">
      {!isSidebarCollapsed && label && (
        <div className="px-3 mb-0.5 text-[10px] font-extrabold tracking-widest text-text/40 uppercase">
          {label}
        </div>
      )}
      {isSidebarCollapsed && label && (
        <div className="h-px bg-border/40 my-0.5 mx-2" />
      )}
      {children}
    </div>
  );
};
