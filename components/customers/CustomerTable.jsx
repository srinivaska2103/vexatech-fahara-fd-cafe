'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowUpRight, User, Mail, Phone, Calendar } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { cn } from '@/utils/cn';

export const CustomerTable = ({ customers }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs text-[#2C1810]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
            <tr>
              <th className="px-6 py-4">Diner Customer</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4 text-center">Total Bookings</th>
              <th className="px-6 py-4 text-right">Lifetime Spend (LTV)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {customers.map((customer) => {
              const name = customer.name || 'Guest Diner';
              const email = customer.email || 'N/A';
              const phone = customer.phone || 'N/A';
              const bookingsCount = customer.total_bookings || 0;
              const spend = Number(customer.total_spend || 0);

              return (
                <tr 
                  key={customer.id} 
                  onClick={() => router.push(`/owner/customers/${customer.id}`)}
                  className="hover:bg-surface/40 transition-colors cursor-pointer group"
                >
                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {customer.profile_image ? (
                          <img src={customer.profile_image} alt={name} className="w-10 h-10 rounded-full object-cover border border-[#DDB892]/50" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 border border-[#DDB892]/40 text-[#6F4E37] font-black text-sm flex items-center justify-center">
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
                        <div className="font-extrabold text-[#2C1810] flex items-center gap-2">
                          <span>{name}</span>
                          {customer.is_vip && <VIPBadge isVip={true} className="scale-75 origin-left px-2" />}
                        </div>
                        <div className="text-[10px] text-text/50">
                          Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#2C1810] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>{email}</span>
                      </p>
                      {phone !== 'N/A' && (
                        <p className="text-[10px] text-text/60 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-text/40" />
                          <span>{phone}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Total Bookings */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-surface/60 border border-border/40 font-extrabold text-[#2C1810]">
                      {bookingsCount} Slot{bookingsCount !== 1 ? 's' : ''}
                    </span>
                  </td>

                  {/* Lifetime Spend (LTV) */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-[#6F4E37] text-sm">
                      ₹{spend.toLocaleString()}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    {customer.status === 'BLOCKED' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-700 border border-rose-500/30">
                        Blocked
                      </span>
                    ) : customer.status === 'INACTIVE' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-surface text-text/60 border border-border/40">
                        Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                        Active Diner
                      </span>
                    )}
                  </td>

                  {/* Profile Action */}
                  <td className="px-6 py-4 text-right">
                    <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white transition-all inline-flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
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
