import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MoreVertical, Crown, Calendar, ShieldAlert, ShoppingBag, Utensils, IndianRupee } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { motion } from 'framer-motion';

export const CustomerCard = ({ customer, isRestaurant }) => {
  const router = useRouter();

  if (!customer) return null;

  const name = customer.name || 'Guest Diner';
  const email = customer.email || 'N/A';
  const phone = customer.phone || 'N/A';
  const bookingsCount = customer.total_bookings || 0;
  const foodOrdersCount = customer.total_food_orders || 0;
  const totalSpend = Number(customer.total_spend || 0);
  const lastActivity = customer.last_interaction 
    ? new Date(customer.last_interaction).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : (customer.last_booking_date ? new Date(customer.last_booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent');

  const getSourceBadge = (source) => {
    switch (source) {
      case 'FOOD_ORDER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
            <ShoppingBag className="w-3 h-3 text-[#E50914]" /> Food Orders
          </span>
        );
      case 'TABLE_BOOKING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-stone-700 border border-stone-200">
            <Utensils className="w-3 h-3 text-stone-600" /> Table Booking
          </span>
        );
      case 'MULTIPLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
            ★ Food &amp; Tables
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-50 text-stone-600 border border-stone-200">
            Visitor
          </span>
        );
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      onClick={() => router.push(`/owner/customers/${customer.id}`)}
      className="bg-white p-5 sm:p-6 rounded-3xl border border-[#FEE2E2] shadow-xs cursor-pointer hover:shadow-md hover:border-[#E50914]/40 transition-all relative overflow-hidden flex flex-col justify-between group"
    >
      {/* Blocked Overlay */}
      {customer.status === 'BLOCKED' && (
        <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
           <div className="bg-white px-4 py-2 rounded-full font-black text-rose-600 text-xs shadow-md border border-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> BLOCKED DINER
           </div>
        </div>
      )}

      {/* Header: Avatar, Name & Joined date */}
      <div>
        <div className="flex justify-between items-start mb-4 relative z-0">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              {customer.profile_image ? (
                <img 
                  src={customer.profile_image} 
                  alt={name} 
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#FEE2E2] shadow-2xs group-hover:border-[#E50914]/40 transition-colors" 
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FFF5F5] to-rose-100 flex items-center justify-center text-[#E50914] font-black text-lg border-2 border-[#FEE2E2]">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {customer.is_vip && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white text-white shadow-xs">
                  <Crown className="w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-[#252525] text-base group-hover:text-[#E50914] transition-colors line-clamp-1">
                  {name}
                </h4>
                {customer.is_vip && <VIPBadge isVip={true} className="scale-75 origin-left" />}
              </div>
              <div className="text-[11px] text-stone-400 font-semibold mt-0.5">
                Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Recently'}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {getSourceBadge(customer.customer_source)}
          </div>
        </div>

        {/* Contact info list */}
        <div className="space-y-2 mb-5 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-2xl border border-stone-100">
          <div className="flex items-center gap-2.5 font-bold text-[#252525]">
             <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
             <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium text-stone-600 truncate">
             <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
             <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium text-stone-500">
             <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
             <span>Last Activity: <strong className="text-stone-700 font-bold">{lastActivity}</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Row: Food Orders, Bookings, Spending */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#FEE2E2] relative z-0">
         <div className="bg-[#FFF5F5] rounded-xl p-2.5 text-center border border-[#FEE2E2]">
            <div className="text-base font-black text-[#E50914]">{foodOrdersCount}</div>
            <div className="text-[10px] text-stone-500 font-black uppercase tracking-wider mt-0.5">Food</div>
         </div>

         <div className="bg-stone-50 rounded-xl p-2.5 text-center border border-stone-200">
            <div className="text-base font-black text-stone-800">{bookingsCount}</div>
            <div className="text-[10px] text-stone-500 font-black uppercase tracking-wider mt-0.5">Bookings</div>
         </div>

         <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-200">
            <div className="text-base font-black text-emerald-700">₹{totalSpend.toFixed(0)}</div>
            <div className="text-[10px] text-emerald-800 font-black uppercase tracking-wider mt-0.5">Total Spend</div>
         </div>
      </div>
    </motion.div>
  );
};
