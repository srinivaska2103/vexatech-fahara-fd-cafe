import React from 'react';
import { CalendarCheck, CalendarX, CreditCard, Star } from 'lucide-react';

export const CustomerStats = ({ customer, isWalkingCafe = false }) => {
  if (!customer) return null;

  if (isWalkingCafe) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Total Cafe Visits */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider truncate">Cafe Activity</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#2C1810]">
            {customer.total_bookings > 0 ? `${customer.total_bookings} Bookings` : 'Cafe Visitor'}
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider truncate">Average Rating</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#2C1810]">{Number(customer.average_rating || 0).toFixed(1)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Total Bookings */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider truncate">Total Bookings</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0">
            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#2C1810]">{customer.total_bookings || 0}</div>
      </div>

      {/* Cancelled Bookings */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-rose-600 uppercase tracking-wider truncate">Cancellations</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <CalendarX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#2C1810]">{customer.cancelled_bookings || 0}</div>
      </div>

      {/* Total Spend */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider truncate">Total Spend</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#6F4E37] truncate">₹{Number(customer.total_spend || 0).toLocaleString()}</div>
      </div>

      {/* Average Rating */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider truncate">Average Rating</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#2C1810]">{Number(customer.average_rating || 0).toFixed(1)}</div>
      </div>
    </div>
  );
};
