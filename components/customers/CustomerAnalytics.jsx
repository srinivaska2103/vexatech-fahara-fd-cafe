'use client';
import React from 'react';
import { Users, UserPlus, TrendingUp, CreditCard, Activity, Crown, ArrowUpRight, Award, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export const CustomerAnalytics = ({ analytics, customers = [] }) => {
  const router = useRouter();

  // Extract analytics stats or calculate dynamically from real customer list
  const totalCustomers = analytics?.totalCustomers ?? customers.length;
  
  const now = new Date();
  const currentMonthNewCount = customers.filter(c => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const newCustomers = analytics?.newCustomers ?? currentMonthNewCount;

  const repeatCount = customers.filter(c => (c.total_bookings || 0) > 1).length;
  const retentionPercentage = totalCustomers > 0 ? Math.round((repeatCount / totalCustomers) * 100) : 0;
  const returningRate = analytics?.returningCustomers ?? retentionPercentage;

  const totalSpendSum = customers.reduce((sum, c) => sum + (Number(c.total_spend) || 0), 0);
  const avgSpendCalculated = totalCustomers > 0 ? Math.round(totalSpendSum / totalCustomers) : 0;
  const averageSpend = analytics?.averageSpend ?? avgSpendCalculated;

  // Derive top LTV customers sorted by total_spend descending
  const topCustomersList = (analytics?.topCustomers && analytics.topCustomers.length > 0)
    ? analytics.topCustomers
    : [...customers].sort((a, b) => (Number(b.total_spend) || 0) - (Number(a.total_spend) || 0)).slice(0, 5);

  // Derive most active customers sorted by total_bookings descending
  const activeCustomersList = (analytics?.activeCustomers && analytics.activeCustomers.length > 0)
    ? analytics.activeCustomers
    : [...customers].sort((a, b) => (Number(b.total_bookings) || 0) - (Number(a.total_bookings) || 0)).slice(0, 5);

  return (
    <div className="space-y-6 text-[#2C1810]">
      
      {/* 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalCustomers}</p>
          <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
            <span>+{retentionPercentage}% Retention</span>
          </p>
        </div>

        {/* New Diners */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-wider">New This Month</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{newCustomers}</p>
          <p className="text-[10px] text-text/50 font-medium">Acquired in {now.toLocaleString('default', { month: 'short' })}</p>
        </div>

        {/* Retention Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Returning Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{returningRate}%</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">{repeatCount} Repeat regular diners</p>
        </div>

        {/* Avg Spend per Customer */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase tracking-wider">Avg Spend / Diner</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#6F4E37]">₹{Number(averageSpend).toLocaleString()}</p>
          <p className="text-[10px] text-text/50 font-medium">Average LTV revenue</p>
        </div>

      </div>

      {/* Leaderboard Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top LTV Customers */}
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810]">Top LTV Guests</h3>
                <p className="text-xs text-text/60">Highest spending diner customer accounts</p>
              </div>
            </div>
          </div>

          {topCustomersList.length === 0 ? (
            <div className="py-10 text-center text-xs text-text/50">
              No diner customer record available yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topCustomersList.map((c, i) => {
                const name = c.name || 'Guest Diner';
                const spend = Number(c.total_spend || 0);
                const bookings = c.total_bookings || c.recent_bookings || 0;

                return (
                  <div 
                    key={c.id || i}
                    onClick={() => c.id && router.push(`/owner/customers/${c.id}`)}
                    className="p-3 rounded-2xl border border-border/40 hover:bg-[#FFF8F0] hover:border-[#DDB892]/60 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] font-black text-xs flex items-center justify-center shrink-0">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">
                          {name}
                        </p>
                        <p className="text-[10px] text-text/50">
                          {bookings} Reservation{bookings !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-[#6F4E37]">₹{spend.toLocaleString()}</p>
                      <span className="text-[9px] text-text/40 font-bold uppercase">Lifetime Value</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Active This Week */}
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810]">Most Frequent Diners</h3>
                <p className="text-xs text-text/60">Guests with highest booking frequency</p>
              </div>
            </div>
          </div>

          {activeCustomersList.length === 0 ? (
            <div className="py-10 text-center text-xs text-text/50">
              No diner booking activity recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeCustomersList.map((c, i) => {
                const name = c.name || 'Guest Diner';
                const bookings = c.total_bookings || c.recent_bookings || 1;

                return (
                  <div 
                    key={c.id || i}
                    onClick={() => c.id && router.push(`/owner/customers/${c.id}`)}
                    className="p-3 rounded-2xl border border-border/40 hover:bg-surface/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">
                          {name}
                        </p>
                        <p className="text-[10px] text-text/50">
                          {c.email || 'Frequent diner'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-700 text-[10px] font-extrabold">
                        {bookings} Booking{bookings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
