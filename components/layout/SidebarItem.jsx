'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useLayoutStore } from '@/store/layout.store';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { CornerDownRight, ChevronRight } from 'lucide-react';

export const SidebarItem = ({ icon: Icon, label, href, onClick, exact = false, color = 'text-[#6F4E37]', bg = 'bg-[#FFF8F0]' }) => {
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
        "relative flex items-center min-h-[34px] rounded-xl transition-all duration-200 ease-out cursor-pointer group my-0.5 leading-snug",
        isSidebarCollapsed ? "justify-center px-0 py-1.5" : "px-2.5 py-1.5 gap-2",
        isActive
          ? "bg-gradient-to-r from-[#6F4E37] to-[#4A3225] text-white font-extrabold shadow-md shadow-[#6F4E37]/20 scale-[1.01]"
          : "text-[#4A3225]/85 hover:bg-[#FFF8F0] hover:text-[#6F4E37] hover:translate-x-0.5 font-bold border border-transparent hover:border-[#6F4E37]/15"
      )}
    >
      {/* Active Left Indicator Bar */}
      {isActive && !isSidebarCollapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-[#E6C5A8]" />
      )}

      {/* Sub-navigation Branch Arrow */}
      {!isSidebarCollapsed && (
        <CornerDownRight 
          className={cn(
            "w-3 h-3 shrink-0 stroke-[2] transition-colors",
            isActive ? "text-white/80" : "text-[#8C6D58]/40 group-hover:text-[#6F4E37]"
          )}
        />
      )}

      {/* Icon Badge Container */}
      <div 
        className={cn(
          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
          isActive ? "bg-white/20 text-white" : `${bg} ${color}`
        )}
      >
        <Icon className="w-3.5 h-3.5 stroke-[2]" />
      </div>
      
      {!isSidebarCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="text-[11px] font-bold tracking-tight truncate leading-none">
            {label}
          </span>
          <ChevronRight 
            className={cn(
              "w-3 h-3 transition-all duration-200",
              isActive 
                ? "text-white/80 translate-x-0.5 opacity-100" 
                : "text-[#8C6D58]/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#6F4E37]"
            )} 
          />
        </div>
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
