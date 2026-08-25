'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingAnalytics } from '@/hooks/analytics';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { KPICard } from '@/components/analytics/KPICard';
import { LineChart } from '@/components/analytics/charts/LineChart';
import { DonutChart } from '@/components/analytics/charts/DonutChart';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, CalendarCheck, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingAnalyticsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ date_range: 'THIS_MONTH', cafe_id: '' });
  const { data: bookingData, isLoading, isError } = useBookingAnalytics(filters);

  const data = bookingData?.data;

  // Mock data
  const mockTrendData = [12, 18, 15, 25, 30, 22, 35];
  const mockTrendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const mockStatusData = [150, 45, 12, 5];
  const statusLabels = ['Completed', 'Upcoming', 'Cancelled', 'No-Show'];
  const statusColors = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  if (isLoading) return <div className="p-6 md:p-8"><LoadingSkeleton type="dashboard" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/analytics')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Button>
          <AnalyticsHeader 
            title="Booking Analytics" 
            description="Understand booking patterns, peak times, and completion rates."
          />
        </div>
        <AnalyticsFilters filters={filters} setFilters={setFilters} />
      </div>

      {!data ? (
        <EmptyAnalyticsState title="No Booking Data" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <KPICard 
               title="Total Bookings" 
               value={data.total_bookings || 0} 
               trend={data.booking_trend || 0}
               icon={CalendarCheck}
               color="primary"
             />
             <KPICard 
               title="Cancellation Rate" 
               value={data.cancellation_rate || 0} 
               suffix="%"
               trend={data.cancellation_trend || 0}
               icon={XCircle}
               color="amber"
             />
             <KPICard 
               title="Peak Booking Time" 
               value={data.peak_time || '7:00 PM'} 
               prefix=""
               icon={Clock}
               color="blue"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text mb-8">Daily Booking Trends</h3>
                <div className="flex-1 min-h-[300px]">
                  <LineChart 
                    data={data.trend_data || mockTrendData} 
                    labels={data.trend_labels || mockTrendLabels} 
                  />
                </div>
             </div>

             <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text mb-8">Status Distribution</h3>
                <div className="flex-1 min-h-[300px]">
                  <DonutChart 
                    data={data.status_breakdown || mockStatusData} 
                    labels={statusLabels} 
                    colors={statusColors} 
                  />
                </div>
             </div>
          </div>
          
        </motion.div>
      )}
    </div>
  );
}
