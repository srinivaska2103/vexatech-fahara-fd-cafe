import React from 'react';
import { CalendarCheck, ShoppingBag, Utensils, CreditCard, Star, Clock } from 'lucide-react';

export const CustomerStats = ({ customer, isWalkingCafe = false }) => {
  if (!customer) return null;

  const totalSpend = Number(customer.total_spend || 0);
  const foodSpend = Number(customer.food_spend || 0);
  const bookingSpend = Number(customer.booking_spend || 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 font-sans">
      {/* 1. Food Orders */}
      <div className="bg-[#FFF5F5] p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#FEE2E2] shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-black text-[#E50914] uppercase tracking-wider truncate">Food Orders</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-[#FEE2E2] text-[#E50914] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#E50914]">{customer.total_food_orders || 0}</div>
        <p className="text-[9px] text-stone-500 font-semibold">₹{foodSpend.toLocaleString()} food spend</p>
      </div>

      {/* 2. Table Bookings */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-black text-stone-500 uppercase tracking-wider truncate">Table Bookings</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
            <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#252525]">{customer.total_bookings || 0}</div>
        <p className="text-[9px] text-stone-400 font-semibold">₹{bookingSpend.toLocaleString()} booking spend</p>
      </div>

      {/* 3. Total Spending */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#FEE2E2] shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-black text-[#E50914] uppercase tracking-wider truncate">Total Spending</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E50914] flex items-center justify-center shrink-0">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#E50914] truncate">₹{totalSpend.toLocaleString()}</div>
        <p className="text-[9px] text-emerald-700 font-bold">Paid Lifetime Spend</p>
      </div>

      {/* 4. Customer Source & Rating */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wider truncate">Rating &amp; Source</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-black text-[#252525]">{Number(customer.average_rating || 0).toFixed(1)} ★</div>
        <p className="text-[9px] text-stone-500 font-bold uppercase truncate">{customer.customer_source || 'Customer'}</p>
      </div>
    </div>
  );
};
