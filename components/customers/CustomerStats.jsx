import React from 'react';
import { CalendarCheck, CalendarX, CreditCard, Star } from 'lucide-react';

export const CustomerStats = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Bookings */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-text/60">Total Bookings</span>
        </div>
        <div className="text-2xl font-bold text-text mt-auto">{customer.total_bookings || 0}</div>
      </div>

      {/* Cancelled Bookings */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger">
            <CalendarX className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-text/60">Cancellations</span>
        </div>
        <div className="text-2xl font-bold text-text mt-auto">{customer.cancelled_bookings || 0}</div>
      </div>

      {/* Total Spend */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-text/60">Total Spend</span>
        </div>
        <div className="text-2xl font-bold text-text mt-auto">₹{Number(customer.total_spend || 0).toLocaleString()}</div>
      </div>

      {/* Average Rating */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-text/60">Average Rating</span>
        </div>
        <div className="text-2xl font-bold text-text mt-auto">{Number(customer.average_rating || 0).toFixed(1)}</div>
      </div>
    </div>
  );
};
