'use client';
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const RevenueChart = ({ 
  data, 
  isLoading, 
  selectedTimeframe = '7D', 
  onTimeframeChange,
  bookingBreakdown 
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState('7D');
  const activeTimeframe = onTimeframeChange ? selectedTimeframe : internalTimeframe;

  const handleTimeframe = (tf) => {
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    } else {
      setInternalTimeframe(tf);
    }
  };

  if (isLoading) return <LoadingSkeleton type="chart" className="min-h-[380px] rounded-3xl" />;
  
  // Normalize incoming data safely (handles array, { data: [...] }, or indexed object)
  const chartData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : (data && typeof data === 'object')
        ? Object.values(data).filter(v => v && typeof v === 'object' && ('name' in v || 'revenue' in v))
        : [];

  const hasData = chartData.length > 0;

  // Coffee accent colors matching Fahara guidelines
  const primaryColor = '#6F4E37';
  const secondaryColor = '#A67B5B';

  const totalPeriodRevenue = hasData 
    ? chartData.reduce((sum, item) => sum + Number(item.revenue || 0), 0)
    : 0;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-border/70 shadow-sm w-full space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-[#2C1810]">Revenue & Bookings Overview</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>₹{totalPeriodRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Total</span>
            </span>
          </div>
          <p className="text-xs text-text/50">Excludes cancelled and refunded reservations per standard accounting</p>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="flex items-center gap-1 bg-[#FFF8F0] p-1 rounded-2xl border border-[#DDB892]/60 shrink-0 self-start sm:self-auto">
          {[
            { key: '7D', label: '7 Days' },
            { key: '30D', label: '30 Days' },
            { key: '90D', label: '90 Days' },
            { key: '12M', label: '1 Year' },
          ].map((tf) => (
            <button
              key={tf.key}
              onClick={() => handleTimeframe(tf.key)}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                activeTimeframe === tf.key
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-text/60 hover:text-[#6F4E37] hover:bg-white/60"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Status Breakdown Chips */}
      {bookingBreakdown && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Confirmed: {bookingBreakdown.confirmed || 0}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending: {bookingBreakdown.pending || 0}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span>Completed: {bookingBreakdown.completed || 0}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Cancelled: {bookingBreakdown.cancelled || 0}</span>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      {!hasData ? (
        <EmptyState 
          icon={BarChart3} 
          title="No Revenue Data For This Period" 
          message="Revenue trend data will automatically update once eligible dining reservations are recorded."
          className="min-h-[260px] rounded-2xl"
        />
      ) : (
        <div className="w-full h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35}/>
                  <stop offset="50%" stopColor={secondaryColor} stopOpacity={0.12}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#2C1810', opacity: 0.65, fontSize: 11, fontWeight: 600 }} 
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#2C1810', opacity: 0.65, fontSize: 11, fontWeight: 600 }}
                tickFormatter={(value) => `₹${value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DED5" opacity={0.7} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px', 
                  border: '1px solid #E8DED5', 
                  boxShadow: '0 12px 24px -4px rgba(44, 24, 16, 0.12)',
                  padding: '10px 14px'
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Cafe Revenue']}
                labelStyle={{ color: '#2C1810', fontWeight: '700', marginBottom: '4px', fontSize: '12px' }}
                itemStyle={{ color: primaryColor, fontWeight: '700', fontSize: '13px' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={primaryColor} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, fill: primaryColor, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
