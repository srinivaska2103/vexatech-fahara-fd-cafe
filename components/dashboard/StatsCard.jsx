'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const cardColorMap = {
  "Total Revenue": {
    bg: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6",
    borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10"
  },
  "Total Customers": {
    bg: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/10 text-indigo-700 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6",
    borderHover: "hover:border-indigo-500/40 hover:shadow-indigo-500/10"
  },
  "Active Bookings": {
    bg: "from-amber-500/15 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-800 border border-amber-500/30 group-hover:bg-amber-700 group-hover:text-white group-hover:rotate-6",
    borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/10"
  },
  "Average Rating": {
    bg: "from-rose-500/15 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/10 text-rose-700 border border-rose-500/30 group-hover:bg-rose-600 group-hover:text-white group-hover:rotate-6",
    borderHover: "hover:border-rose-500/40 hover:shadow-rose-500/10"
  }
};

export const StatsCard = ({ title, value, trend, trendValue, icon: Icon, isLoading, className }) => {
  if (isLoading) return <LoadingSkeleton type="card" className={className} />;

  const isPositive = trend === 'up';
  const colorTheme = cardColorMap[title] || {
    bg: "from-[#6F4E37]/15 via-[#6F4E37]/5 to-transparent",
    iconBg: "bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/30 group-hover:bg-[#6F4E37] group-hover:text-white group-hover:rotate-6",
    borderHover: "hover:border-[#6F4E37]/40 hover:shadow-[#6F4E37]/10"
  };

  return (
    <div className={cn(
      "bg-white p-5 sm:p-6 rounded-3xl border border-border/70 shadow-2xs hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 cursor-pointer",
      colorTheme.borderHover,
      className
    )}>
      {/* Decorative Gradient Flare */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125 opacity-70", colorTheme.bg)} />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        {/* Interactive Icon Box */}
        <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-xs", colorTheme.iconBg)}>
          {Icon && <Icon className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />}
        </div>

        {trendValue && (
          <div className={cn(
            "flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-2xs transition-transform group-hover:scale-105",
            isPositive 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-rose-50 text-rose-800 border-rose-200"
          )}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 text-rose-600 stroke-[2.5]" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10 space-y-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-text/50">{title}</span>
        <p className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight font-sans">
          {value}
        </p>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text/50 font-extrabold">
        <span>vs last month</span>
        <TrendingUp className="w-3.5 h-3.5 text-[#6F4E37] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
      </div>
    </div>
  );
};
