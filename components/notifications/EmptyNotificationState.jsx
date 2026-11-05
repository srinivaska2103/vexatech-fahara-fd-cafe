'use client';
import React from 'react';
import { BellOff, RefreshCw, Send, Sparkles, FilterX } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const EmptyNotificationState = ({ 
  title = "No Notifications Found", 
  description = "You're all caught up! There are no new alerts, booking updates, or payout notifications at this time.", 
  showClear = false, 
  onClear 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-border/60 shadow-xs relative overflow-hidden text-[#252525]"
    >
      {/* Glow Blob Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Bell Animated Badge */}
      <div className="relative mb-5">
        <div className="w-20 h-20 bg-gradient-to-br from-[#E50914]/10 to-amber-500/10 rounded-3xl flex items-center justify-center border border-[#E50914]/20 shadow-xs">
          <BellOff className="w-10 h-10 text-[#E50914]" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white shadow-xs">
          ✓
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-[#252525] tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-text/70 max-w-md mx-auto mt-2 leading-relaxed">
        {description}
      </p>

      {/* Quick CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {showClear && onClear ? (
          <button 
            onClick={onClear}
            className="px-5 py-2.5 bg-[#E50914]/10 hover:bg-[#E50914] text-[#E50914] hover:text-white font-extrabold rounded-2xl transition-all text-xs flex items-center gap-2 shadow-2xs"
          >
            <FilterX className="w-4 h-4" /> Reset Search Filters
          </button>
        ) : (
          <>
            <Link 
              href="/owner/notifications/compose"
              className="px-5 py-2.5 bg-gradient-to-r from-[#E50914] to-[#B71C1C] hover:shadow-md text-white font-extrabold rounded-2xl transition-all text-xs flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Compose Broadcast
            </Link>
            <Link 
              href="/owner/dashboard"
              className="px-5 py-2.5 border border-border/60 hover:border-[#E50914] text-text/80 hover:text-[#E50914] font-bold rounded-2xl transition-all text-xs"
            >
              Go to Dashboard →
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
};
