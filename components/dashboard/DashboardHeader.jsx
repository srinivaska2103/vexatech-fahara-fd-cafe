'use client';
import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Coffee, CalendarCheck, Plus, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const DashboardHeader = () => {
  const user = useAuthStore(state => state.user) || { name: 'Owner' };
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const hour = now.getHours();
  let greeting = 'Good evening';
  let greetingEmoji = '🌙';
  if (hour < 12) {
    greeting = 'Good morning';
    greetingEmoji = '☀️';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
    greetingEmoji = '☕';
  }

  const firstName = user.name ? user.name.split(' ')[0] : 'Owner';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2C1810] via-[#3D251E] to-[#6F4E37] text-white p-6 md:p-8 mb-8 shadow-xl shadow-primary/10 border border-white/10">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-16 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-amber-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Venue Dashboard</span>
            <span className="text-white/40">•</span>
            <span>{dateStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            {greeting}, {firstName}! <span className="inline-block animate-bounce">{greetingEmoji}</span>
          </h1>

          <p className="text-sm md:text-base text-amber-100/80 max-w-xl leading-relaxed">
            Here's an overview of your cafe performance, active bookings, and recent customer activities today.
          </p>
        </div>
        
        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/owner/bookings">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold"
            >
              <CalendarCheck className="w-4 h-4 text-amber-300" />
              <span>Bookings</span>
            </Button>
          </Link>

          <Link href="/owner/cafes">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold"
            >
              <Coffee className="w-4 h-4 text-amber-300" />
              <span>Cafes</span>
            </Button>
          </Link>

          <Link href="/owner/events">
            <Button 
              variant="primary" 
              size="sm" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-text font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
