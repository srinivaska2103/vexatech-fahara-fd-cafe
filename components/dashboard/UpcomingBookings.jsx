'use client';
import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { CalendarDays, Clock, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const UpcomingBookings = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSkeleton type="list" className="rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={CalendarDays} 
        title="No Upcoming Bookings" 
        message="You don't have any bookings scheduled for the near future."
        className="rounded-3xl"
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border/70 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h3 className="text-lg font-bold text-text">Upcoming Schedule</h3>
          <p className="text-xs text-text/50">Scheduled venue visits & events</p>
        </div>
        <Link 
          href="/owner/bookings" 
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors group"
        >
          <span>View schedule</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      
      <div className="space-y-3.5">
        {data.map((booking) => (
          <div 
            key={booking.id} 
            className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-white hover:bg-surface/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl shrink-0 border border-primary/20 text-center shadow-2xs group-hover:scale-105 transition-transform">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                {new Date(booking.date).toLocaleString('default', { month: 'short' })}
              </span>
              <span className="text-xl font-extrabold text-text leading-none mt-0.5 font-sans">
                {new Date(booking.date).getDate()}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <h4 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
                  {booking.customerName}
                </h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full shrink-0">
                  {booking.eventType || 'Regular'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-text/60">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary/70" />
                  <span>{new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary/70" />
                  <span>{booking.guests} Guests</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
