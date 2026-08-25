'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useLayoutStore } from '@/store/layout.store';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';

export const SidebarItem = ({ icon: Icon, label, href, onClick, exact = false }) => {
  const pathname = usePathname();
  const isActive = exact 
    ? pathname === href 
    : pathname === href || (pathname.startsWith(`${href}/`) && href !== '/owner/payments');
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const closeMobileSidebar = useLayoutStore((state) => state.closeMobileSidebar);

  const handleClick = () => {
    closeMobileSidebar();
    if (onClick) onClick();
  };

  const tourId = href ? `nav-${href.split('/').pop() || 'dashboard'}` : undefined;

  const content = (
    <Link
      href={href}
      onClick={handleClick}
      data-tour={tourId}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 group relative overflow-hidden my-0.5 leading-snug",
        isActive
          ? "bg-gradient-to-r from-primary via-[#5D3F2B] to-secondary text-white shadow-2xs shadow-primary/20 border border-white/10"
          : "text-text/75 hover:bg-surface hover:text-primary hover:translate-x-0.5"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
          isActive ? "text-amber-200" : "text-text/50 group-hover:text-primary"
        )}
      />
      
      {!isSidebarCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </Link>
  );

  if (isSidebarCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};
