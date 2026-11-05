'use client';
import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Store, Clock, ExternalLink, Edit3, MapPin } from 'lucide-react';
import Link from 'next/link';

export const DashboardHeader = ({ summary, cafe }) => {
  const user = useAuthStore(state => state.user) || { name: 'Owner' };
  const role = useAuthStore(state => state.role);
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  
  const hour = now.getHours();
  let greeting = 'Good afternoon';
  let greetingEmoji = '☕';
  if (hour < 12) {
    greeting = 'Good morning';
    greetingEmoji = '☀️';
  } else if (hour >= 18) {
    greeting = 'Good evening';
    greetingEmoji = '🌙';
  }

  const firstName = user.name ? user.name.split(' ')[0] : (user.full_name ? user.full_name.split(' ')[0] : 'Owner');

  // Cafe details from summary.primary_cafe or passed cafe prop
  const activeCafe = summary?.primary_cafe || cafe || null;
  const cafeName = activeCafe?.name || user.cafe_name || 'My Cafe';
  const cafeCity = activeCafe?.city || activeCafe?.address || '';
  const cafeId = activeCafe?.id;

  const todayHours = summary?.today_hours || '12:00 PM – 10:00 PM';
  const isOpen = (summary?.open_status || 'OPEN_NOW') === 'OPEN_NOW';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#E50914] text-white p-5 sm:p-7 md:p-8 mb-6 shadow-lg shadow-[#E50914]/20 border border-[#B71C1C]/20">
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Greeting, Cafe Identity & Live Status */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Top Pill: Live Status & Today's Hours */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${
              isOpen 
                ? 'bg-emerald-500/30 text-white border border-emerald-400/50' 
                : 'bg-white/20 text-white border border-white/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-300 animate-pulse' : 'bg-white/70'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            
            <span className="text-white/40">•</span>
            
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white">
              <Clock className="w-3 h-3 text-white" />
              <span>Today: {todayHours}</span>
            </span>

            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-white/90 text-[11px]">{dateStr}</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{greeting}, {firstName}!</span> 
              <span className="inline-block animate-bounce">{greetingEmoji}</span>
            </h1>
            
            <div className="flex items-center gap-2 mt-1.5 text-white font-medium text-sm sm:text-base">
              <Store className="w-4 h-4 text-white shrink-0" />
              <span className="font-bold text-white tracking-tight">{cafeName}</span>
              {cafeCity && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-white/90 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white" />
                    {cafeCity}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/95 max-w-xl leading-relaxed">
            Welcome to your hospitality command center. Monitor live guest reservations, manage seating, and track daily earnings in real time.
          </p>
        </div>
        
        {/* Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {cafeId ? (
              <Link href={`/owner/cafes/${cafeId}`} className="flex-1 sm:flex-initial">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">View Cafe</span>
                </Button>
              </Link>
            ) : (
              <Link href="/owner/cafes" className="flex-1 sm:flex-initial">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold"
                >
                  <Store className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Manage Cafe</span>
                </Button>
              </Link>
            )}

            <Link href={cafeId ? `/owner/cafes/${cafeId}/edit` : "/owner/settings"} className="flex-1 sm:flex-initial">
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full sm:w-auto bg-white hover:bg-white/90 text-[#E50914] font-extrabold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5] text-[#E50914]" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
