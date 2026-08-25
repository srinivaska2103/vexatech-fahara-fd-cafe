'use client';
import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/analytics';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { KPICard } from '@/components/analytics/KPICard';
import { LineChart } from '@/components/analytics/charts/LineChart';
import { DonutChart } from '@/components/analytics/charts/DonutChart';
import { TopEventsTable } from '@/components/analytics/TopEventsTable';
import { TopCustomersTable } from '@/components/analytics/TopCustomersTable';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { IndianRupee, CalendarCheck, Users, Activity, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnalyticsDashboardPage() {
  const [filters, setFilters] = useState({ date_range: 'THIS_MONTH', cafe_id: '' });
  const { data: analyticsData, isLoading, isError } = useAnalytics(filters);

  const data = analyticsData?.data;

  // Mock data for visualizations if backend returns null (to show UI)
  const mockRevenueChart = {
    data: [15000, 22000, 18000, 28000, 25000, 32000, 38000],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const mockOccupancy = [45, 75, 20];
  const occupancyLabels = ['Booked', 'Available', 'Maintenance'];

  if (isLoading) {
    return <div className="p-6 md:p-8"><LoadingSkeleton type="dashboard" /></div>;
  }

  if (isError) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-danger/10 text-danger p-6 rounded-3xl border border-danger/20 text-center">
          <p className="font-semibold mb-2">Error Loading Analytics</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      <AnalyticsHeader 
        title="Business Overview" 
        description="Monitor your cafe's performance at a glance."
        actions={<AnalyticsFilters filters={filters} setFilters={setFilters} />}
      />

      {!data ? (
        <EmptyAnalyticsState />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <KPICard 
               title="Total Revenue" 
               value={data.total_revenue || 0} 
               prefix="₹"
               trend={data.revenue_trend || 0}
               icon={IndianRupee}
               color="primary"
             />
             <KPICard 
               title="Total Bookings" 
               value={data.total_bookings || 0} 
               trend={data.booking_trend || 0}
               icon={CalendarCheck}
               color="blue"
             />
             <KPICard 
               title="New Customers" 
               value={data.new_customers || 0} 
               trend={data.customer_trend || 0}
               icon={Users}
               color="green"
             />
             <KPICard 
               title="Avg Occupancy Rate" 
               value={data.occupancy_rate || 0} 
               suffix="%"
               trend={data.occupancy_trend || 0}
               icon={Activity}
               color="amber"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             
             {/* Revenue Trend Chart */}
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-text">Revenue Trend</h3>
                  <Link href="/owner/analytics/revenue" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Detailed Report <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <LineChart data={data.revenue_chart?.data || mockRevenueChart.data} labels={data.revenue_chart?.labels || mockRevenueChart.labels} />
                </div>
             </div>

             {/* Occupancy Donut */}
             <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-text">Space Occupancy</h3>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[250px]">
                  <DonutChart 
                    data={data.occupancy_breakdown || mockOccupancy} 
                    labels={occupancyLabels} 
                    colors={['#6F4E37', '#e5e7eb', '#ef4444']} 
                  />
                </div>
             </div>

          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <TopEventsTable events={data.top_events} />
             <TopCustomersTable customers={data.top_customers} />
          </div>

        </motion.div>
      )}
    </div>
  );
}
