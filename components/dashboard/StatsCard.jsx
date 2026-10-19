'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const StatsCard = ({ 
  title, 
  value, 
  subtitle,
  trend, 
  trendValue, 
  icon: Icon, 
  isLoading, 
  href,
  badgeText,
  colorScheme = 'primary',
  className 
}) => {
  if (isLoading) return <LoadingSkeleton type="card" className={cn("rounded-3xl min-h-[140px]", className)} />;

  const isPositive = trend === 'up';

  // Palette configurations matching Fahara theme and semantic indicators
  const themeStyles = {
    revenue: {
      bg: "from-emerald-500/12 via-emerald-500/4 to-transparent",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white",
      borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
      accent: "text-emerald-700"
    },
    confirmed: {
      bg: "from-teal-500/12 via-teal-500/4 to-transparent",
      iconBg: "bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-teal-600 group-hover:text-white",
      borderHover: "hover:border-teal-500/40 hover:shadow-teal-500/10",
      accent: "text-teal-700"
    },
    pending: {
      bg: "from-amber-500/15 via-amber-500/4 to-transparent",
      iconBg: "bg-amber-50 text-amber-800 border-amber-300 group-hover:bg-amber-600 group-hover:text-white",
      borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/10",
      accent: "text-amber-800"
    },
    cancelled: {
      bg: "from-rose-500/12 via-rose-500/4 to-transparent",
      iconBg: "bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white",
      borderHover: "hover:border-rose-500/40 hover:shadow-rose-500/10",
      accent: "text-rose-700"
    },
    primary: {
      bg: "from-[#6F4E37]/12 via-[#6F4E37]/4 to-transparent",
      iconBg: "bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/60 group-hover:bg-[#6F4E37] group-hover:text-white",
      borderHover: "hover:border-[#6F4E37]/40 hover:shadow-[#6F4E37]/10",
      accent: "text-[#6F4E37]"
    }
  };

  const scheme = themeStyles[colorScheme] || themeStyles.primary;

  const cardContent = (
    <div className={cn(
      "bg-white p-4 sm:p-5 rounded-3xl border border-border/80 shadow-2xs hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full hover:-translate-y-0.5",
      scheme.borderHover,
      className
    )}>
      {/* Decorative gradient aura */}
      <div className={cn("absolute top-0 right-0 w-28 h-28 bg-gradient-to-br rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125 opacity-70", scheme.bg)} />

      <div className="relative z-10 flex justify-between items-start gap-2 mb-3">
        {/* Icon */}
        <div className={cn("p-2.5 rounded-2xl border transition-all duration-300 group-hover:scale-105 shadow-2xs", scheme.iconBg)}>
          {Icon && <Icon className="w-5 h-5 stroke-[2.2]" />}
        </div>

        {/* Optional Badge or Trend */}
        {badgeText && (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-surface border border-border/60 text-text/70 shrink-0">
            {badgeText}
          </span>
        )}

        {trendValue && !badgeText && (
          <div className={cn(
            "flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-2xs",
            isPositive 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-rose-50 text-rose-800 border-rose-200"
          )}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5 text-rose-600 stroke-[2.5]" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-text/60 line-clamp-1">
          {title}
        </span>
        <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2C1810] tracking-tight font-sans truncate">
          {value}
        </div>
      </div>

      {subtitle ? (
        <div className="relative z-10 mt-2.5 pt-2.5 border-t border-border/40 text-[11px] text-text/50 font-medium truncate">
          {subtitle}
        </div>
      ) : (
        <div className="relative z-10 mt-2.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-text/50 font-semibold">
          <span>Click to view details</span>
          <ArrowUpRight className="w-3 h-3 text-[#6F4E37] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
