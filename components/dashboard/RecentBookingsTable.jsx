'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { CalendarCheck, ChevronRight, User, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const RecentBookingsTable = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSkeleton type="list" className="rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={CalendarCheck} 
        title="No Recent Bookings" 
        message="Your recent customer venue reservations will appear here once booked."
        className="rounded-3xl min-h-[300px]"
      />
    );
  }

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'confirmed':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-surface text-text/70 border border-border/50 text-xs font-bold rounded-full capitalize">
            {status}
          </span>
        );
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 shadow-sm overflow-hidden space-y-0">
      <div className="flex items-center justify-between p-6 border-b border-border/40">
        <div>
          <h3 className="text-lg font-bold text-text">Recent Bookings</h3>
          <p className="text-xs text-text/50">Latest customer venue reservations and details</p>
        </div>
        <Link 
          href="/owner/bookings" 
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors group"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text/50 uppercase bg-surface/40 border-b border-border/40">
            <tr>
              <th className="px-6 py-3.5 font-bold tracking-wider">Customer</th>
              <th className="px-6 py-3.5 font-bold tracking-wider">Date & Time</th>
              <th className="px-6 py-3.5 font-bold tracking-wider text-center">Guests</th>
              <th className="px-6 py-3.5 font-bold tracking-wider text-right">Amount</th>
              <th className="px-6 py-3.5 font-bold tracking-wider text-center">Status</th>
              <th className="px-6 py-3.5 font-bold tracking-wider text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-surface/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 shadow-2xs">
                      {getInitials(booking.customerName)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-text truncate group-hover:text-primary transition-colors">{booking.customerName}</div>
                      <div className="text-xs text-text/50 truncate">{booking.customerEmail || 'Registered Customer'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-text">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-xs text-text/50 font-medium">{booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : ''}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface text-text/80 border border-border/40">
                    <Users className="w-3 h-3 text-text/40" />
                    <span>{booking.guests || 0}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-text font-sans">
                  ₹{Number(booking.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/owner/bookings`}>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
