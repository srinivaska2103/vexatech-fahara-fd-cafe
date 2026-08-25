'use client';
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

export const RevenueChart = ({ data, isLoading }) => {
  const [timeframe, setTimeframe] = useState('12M');

  if (isLoading) return <LoadingSkeleton type="chart" className="min-h-[380px] rounded-3xl" />;
  
  if (!data || data.length === 0) {
    return (
      <EmptyState 
        icon={BarChart3} 
        title="No Revenue Data" 
        message="Revenue trend data will automatically appear here once you receive bookings."
        className="min-h-[380px] rounded-3xl"
      />
    );
  }

  // Coffee accent colors
  const primaryColor = '#6F4E37';
  const secondaryColor = '#A67B5B';

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/70 shadow-sm w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text">Revenue Trend</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Earnings Overview</span>
            </span>
          </div>
          <p className="text-xs text-text/50">Track monthly earnings and revenue growth trajectory</p>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border/50 shrink-0">
          {['7D', '30D', '12M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                timeframe === tf
                  ? "bg-white text-primary shadow-sm border border-border/40"
                  : "text-text/50 hover:text-text hover:bg-white/50"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4}/>
                <stop offset="50%" stopColor={secondaryColor} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#2C1810', opacity: 0.6, fontSize: 12, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#2C1810', opacity: 0.6, fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `₹${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
            />
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E7D8C9" opacity={0.6} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(12px)',
                borderRadius: '16px', 
                border: '1px solid #E7D8C9', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
                padding: '12px 16px'
              }}
              itemStyle={{ color: primaryColor, fontWeight: '700', fontSize: '14px' }}
              labelStyle={{ color: '#2C1810', fontWeight: '600', opacity: 0.7, marginBottom: '6px', fontSize: '12px' }}
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={primaryColor} 
              strokeWidth={3.5}
              activeDot={{ r: 6, fill: primaryColor, stroke: '#ffffff', strokeWidth: 3 }}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
