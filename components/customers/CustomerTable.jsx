'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowUpRight, User, Mail, Phone, Calendar, ShoppingBag, Utensils } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { cn } from '@/utils/cn';

export const CustomerTable = ({ customers, isRestaurant }) => {
  const router = useRouter();

  const getSourceBadge = (source) => {
    switch (source) {
      case 'FOOD_ORDER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
            <ShoppingBag className="w-3 h-3 text-[#E50914]" /> Food Order
          </span>
        );
      case 'TABLE_BOOKING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-stone-100 text-stone-700 border border-stone-200">
            <Utensils className="w-3 h-3 text-stone-600" /> Table Booking
          </span>
        );
      case 'MULTIPLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
            ★ Food &amp; Booking
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-50 text-stone-600 border border-stone-200">
            Visitor
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white border border-[#FEE2E2] rounded-3xl shadow-xs text-[#252525]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[11px] font-extrabold uppercase bg-[#FFF5F5]/80 text-[#E50914] border-b border-[#FEE2E2] tracking-wider">
            <tr>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Phone &amp; Email</th>
              <th className="px-6 py-4 text-center">Food Orders</th>
              <th className="px-6 py-4 text-center">Bookings</th>
              <th className="px-6 py-4 text-right">Total Spending</th>
              <th className="px-6 py-4 text-center">Customer Source</th>
              <th className="px-6 py-4 text-center">Last Activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {customers.map((customer) => {
              const name = customer.name || 'Guest Diner';
              const email = customer.email || 'N/A';
              const phone = customer.phone || 'N/A';
              const bookingsCount = customer.total_bookings || 0;
              const foodOrdersCount = customer.total_food_orders || 0;
              const totalSpend = Number(customer.total_spend || 0);
              const lastActivity = customer.last_interaction 
                ? new Date(customer.last_interaction).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent';

              return (
                <tr 
                  key={customer.id} 
                  onClick={() => router.push(`/owner/customers/${customer.id}`)}
                  className="hover:bg-[#FFF5F5]/40 transition-colors cursor-pointer group"
                >
                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {customer.profile_image ? (
                          <img src={customer.profile_image} alt={name} className="w-10 h-10 rounded-full object-cover border border-[#FEE2E2]" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#FFF5F5] border border-[#FEE2E2] text-[#E50914] font-black text-sm flex items-center justify-center">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {customer.status === 'BLOCKED' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center border border-white">
                            <ShieldAlert className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-extrabold text-[#252525] flex items-center gap-2">
                          <span>{name}</span>
                          {customer.is_vip && <VIPBadge isVip={true} className="scale-75 origin-left px-2" />}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          ID: {customer.id ? customer.id.slice(0, 8) : 'GUEST'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      {phone !== 'N/A' && phone !== '' ? (
                        <p className="font-extrabold text-[#252525] flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-[#E50914]" />
                          <span>{phone}</span>
                        </p>
                      ) : null}
                      {email !== 'N/A' && email !== '' ? (
                        <p className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{email}</span>
                        </p>
                      ) : null}
                    </div>
                  </td>

                  {/* Food Orders Count */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-xs font-black ${
                      foodOrdersCount > 0 ? 'bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]' : 'text-stone-400'
                    }`}>
                      {foodOrdersCount}
                    </span>
                  </td>

                  {/* Table Bookings Count */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-xs font-black ${
                      bookingsCount > 0 ? 'bg-stone-100 text-stone-700 border border-stone-200' : 'text-stone-400'
                    }`}>
                      {bookingsCount}
                    </span>
                  </td>

                  {/* Total Spending */}
                  <td className="px-6 py-4 text-right">
                    <div className="font-black text-[#E50914] text-sm">
                      ₹{totalSpend.toLocaleString()}
                    </div>
                    {customer.food_spend > 0 && customer.booking_spend > 0 && (
                      <div className="text-[9px] text-stone-400 font-semibold">
                        Food: ₹{customer.food_spend.toLocaleString()} | Bookings: ₹{customer.booking_spend.toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* Customer Source */}
                  <td className="px-6 py-4 text-center">
                    {getSourceBadge(customer.customer_source)}
                  </td>

                  {/* Last Activity Date */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-[11px] font-bold text-stone-600">
                      {lastActivity}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white group-hover:bg-[#E50914] text-stone-700 group-hover:text-white border border-stone-200 group-hover:border-[#E50914] font-black text-xs transition-all shadow-2xs">
                      View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
