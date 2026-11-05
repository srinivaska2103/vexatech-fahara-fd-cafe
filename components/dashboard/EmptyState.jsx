import React from 'react';
import { cn } from '@/utils/cn';

export const EmptyState = ({ icon: Icon, title, message, action, className }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-3xl border border-[#EF5350]/60 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 group cursor-pointer relative overflow-hidden",
      className
    )}>
      {/* Decorative Subtle Background Corner Flare */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFF5F5] to-transparent rounded-bl-full opacity-60 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      {Icon && (
        <div className="relative flex items-center justify-center z-10">
          {/* Interactive Icon Box with 3D Hover Tilt & Rotation */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF5F5] via-[#FFF5F5] to-[#FFF3E4] border-2 border-[#EF5350]/70 flex items-center justify-center text-[#E50914] shadow-2xs group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:border-[#E50914] transition-all duration-300">
            <Icon size={28} className="stroke-[2] transition-transform duration-300 group-hover:scale-110" />
          </div>
          {/* Subtle Ambient Pulse Ring behind icon */}
          <div className="absolute -inset-1.5 rounded-3xl bg-[#E50914]/10 opacity-0 group-hover:opacity-100 group-hover:scale-105 blur-sm transition-all duration-300 -z-10" />
        </div>
      )}

      <div className="space-y-1 max-w-sm z-10">
        <h3 className="text-base font-extrabold text-[#252525] group-hover:text-[#E50914] transition-colors">{title}</h3>
        <p className="text-xs text-text/60 leading-relaxed font-medium">{message}</p>
      </div>

      {action && <div className="pt-2 z-10">{action}</div>}
    </div>
  );
};
