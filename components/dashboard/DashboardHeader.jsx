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
  let greeting = 'Good evening';
  let greetingEmoji = '🌙';
  if (hour < 12) {
    greeting = 'Good morning';
    greetingEmoji = '☀️';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
    greetingEmoji = '☕';
  }

  const firstName = user.name ? user.name.split(' ')[0] : (user.full_name ? user.full_name.split(' ')[0] : 'Owner');

  // Cafe details from summary.primary_cafe or passed cafe prop
  const activeCafe = summary?.primary_cafe || cafe || null;
  const cafeName = activeCafe?.name || user.cafe_name || 'My Cafe';
  const cafeCity = activeCafe?.city || activeCafe?.address || '';
  const coverImage = activeCafe?.cover_image || null;
  const cafeId = activeCafe?.id;

  const todayHours = summary?.today_hours || '12:00 PM – 10:00 PM';
  const isOpen = (summary?.open_status || 'OPEN_NOW') === 'OPEN_NOW';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2C1810] via-[#3A2218] to-[#5C3A24] text-white p-5 sm:p-7 md:p-8 mb-6 shadow-xl shadow-[#2C1810]/15 border border-white/10">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-[#DDB892]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-16 w-56 h-56 bg-[#6F4E37]/30 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Greeting, Cafe Identity & Live Status */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Top Pill: Live Status & Today's Hours */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-100">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${
              isOpen 
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40' 
                : 'bg-stone-500/30 text-stone-300 border border-stone-400/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            
            <span className="text-white/30">•</span>
            
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-200/90">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Today: {todayHours}</span>
            </span>

            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-white/60 text-[11px]">{dateStr}</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{greeting}, {firstName}!</span> 
              <span className="inline-block animate-bounce">{greetingEmoji}</span>
            </h1>
            
            <div className="flex items-center gap-2 mt-1.5 text-amber-100/90 font-medium text-sm sm:text-base">
              <Store className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-bold text-white tracking-tight">{cafeName}</span>
              {cafeCity && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-amber-200/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {cafeCity}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-100/70 max-w-xl leading-relaxed">
            Welcome to your hospitality command center. Monitor live guest reservations, manage seating, and track daily earnings in real time.
          </p>
        </div>
        
        {/* Right: Cover Image Thumbnail + Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {coverImage && (
            <div className="hidden sm:block w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={coverImage} 
                alt={cafeName} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {cafeId ? (
              <Link href={`/owner/cafes/${cafeId}`} className="flex-1 sm:flex-initial">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  <span>View Cafe</span>
                </Button>
              </Link>
            ) : (
              <Link href="/owner/cafes" className="flex-1 sm:flex-initial">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold"
                >
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span>Manage Cafe</span>
                </Button>
              </Link>
            )}

            <Link href={cafeId ? `/owner/cafes/${cafeId}/edit` : "/owner/settings"} className="flex-1 sm:flex-initial">
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#2C1810] font-extrabold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] gap-1.5 py-2.5 px-3.5 rounded-xl text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
