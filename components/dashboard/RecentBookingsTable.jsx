'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { CalendarCheck, ChevronRight, Users, ArrowUpRight, Clock, Armchair, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const RecentBookingsTable = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSkeleton type="list" className="rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={CalendarCheck} 
        title="No Bookings Yet" 
        message="Your recent customer venue reservations and table orders will appear here automatically."
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="capitalize">{s}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 bg-surface text-text/70 border border-border/50 text-xs font-bold rounded-full capitalize">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (['PAID', 'COMPLETED', 'SUCCESS'].includes(s)) {
      return (
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Paid
        </span>
      );
    }
    if (['REFUNDED', 'PARTIALLY_REFUNDED'].includes(s)) {
      return (
        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          Refunded
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
        Pending
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 shadow-sm overflow-hidden space-y-0">
      {/* Table Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/40">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#2C1810]">Recent Dining Bookings</h3>
          <p className="text-xs text-text/50">Latest customer venue reservations, guests & status</p>
        </div>
        <Link 
          href="/owner/bookings" 
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors group"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-text/50 uppercase bg-[#FFF8F0]/60 border-b border-border/40 whitespace-nowrap">
            <tr>
              <th className="px-5 py-3 font-bold tracking-wider">Ref & Customer</th>
              <th className="px-5 py-3 font-bold tracking-wider">Date & Time</th>
              <th className="px-5 py-3 font-bold tracking-wider">Table / Package</th>
              <th className="px-5 py-3 font-bold tracking-wider text-center">Guests</th>
              <th className="px-5 py-3 font-bold tracking-wider text-right">Amount</th>
              <th className="px-5 py-3 font-bold tracking-wider text-center">Status</th>
              <th className="px-5 py-3 font-bold tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 whitespace-nowrap">
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-[#FFF8F0]/30 transition-colors group">
                {/* Ref & Customer */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] font-bold text-xs shrink-0 shadow-2xs">
                      {getInitials(booking.customerName)}
                    </div>
                    <div className="min-w-0 max-w-[170px]">
                      <div className="font-bold text-[#2C1810] truncate group-hover:text-primary transition-colors text-xs sm:text-sm">
                        {booking.customerName}
                      </div>
                      <div className="text-[11px] font-mono text-text/50 truncate">
                        {booking.booking_reference || `#FAH-${booking.id.slice(0, 8).toUpperCase()}`}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-[#2C1810] text-xs">
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>
                  <div className="text-[11px] text-text/50 font-medium">
                    {booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : ''}
                  </div>
                </td>

                {/* Table or Package */}
                <td className="px-5 py-3.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C1810]">
                    <Armchair className="w-3.5 h-3.5 text-text/40" />
                    <span className="truncate max-w-[140px]">{booking.tableName || 'Standard Table'}</span>
                  </div>
                </td>

                {/* Guests */}
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface text-text/80 border border-border/40">
                    <Users className="w-3 h-3 text-text/40" />
                    <span>{booking.guests || 1}</span>
                  </span>
                </td>

                {/* Amount */}
                <td className="px-5 py-3.5 text-right">
                  <div className="font-extrabold text-[#2C1810] font-sans text-xs sm:text-sm">
                    ₹{Number(booking.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="pt-0.5">{getPaymentBadge(booking.payment_status)}</div>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5 text-center">
                  {getStatusBadge(booking.status)}
                </td>

                {/* Action */}
                <td className="px-5 py-3.5 text-right">
                  <Link href="/owner/bookings">
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

      {/* Mobile Card Transformation (< 768px) */}
      <div className="block md:hidden divide-y divide-border/30 p-4 space-y-3">
        {data.map((booking) => (
          <div key={booking.id} className="pt-3 first:pt-0 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] font-bold text-xs shrink-0">
                  {getInitials(booking.customerName)}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#2C1810]">{booking.customerName}</h4>
                  <p className="text-[10px] font-mono text-text/50">{booking.booking_reference || `#FAH-${booking.id.slice(0, 8).toUpperCase()}`}</p>
                </div>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FFF8F0]/50 p-2.5 rounded-xl border border-border/40">
              <div className="space-y-0.5">
                <span className="text-text/50 font-medium">Date & Time</span>
                <p className="font-bold text-[#2C1810]">
                  {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'} 
                  {booking.time ? ` • ${new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })}` : ''}
                </p>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-text/50 font-medium">Guests & Table</span>
                <p className="font-bold text-[#2C1810] truncate">
                  {booking.guests || 1} Guests • {booking.tableName || 'Table'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-text/50">Amount:</span>
                <span className="font-black text-[#2C1810]">
                  ₹{Number(booking.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                {getPaymentBadge(booking.payment_status)}
              </div>

              <Link 
                href="/owner/bookings" 
                className="text-xs font-bold text-[#6F4E37] flex items-center gap-0.5 hover:underline"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
