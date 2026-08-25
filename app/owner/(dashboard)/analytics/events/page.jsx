'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEventAnalytics } from '@/hooks/analytics';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { KPICard } from '@/components/analytics/KPICard';
import { BarChart } from '@/components/analytics/charts/BarChart';
import { TopEventsTable } from '@/components/analytics/TopEventsTable';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Calendar, Ticket, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventAnalyticsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ date_range: 'THIS_YEAR', cafe_id: '' });
  const { data: eventData, isLoading, isError } = useEventAnalytics(filters);

  const data = eventData?.data;

  // Mock data
  const mockAttendanceData = [45, 60, 85, 110, 150, 180];
  const mockAttendanceLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  if (isLoading) return <div className="p-6 md:p-8"><LoadingSkeleton type="dashboard" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/analytics')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Button>
          <AnalyticsHeader 
            title="Event Analytics" 
            description="Analyze attendance, popularity, and revenue of your hosted events."
          />
        </div>
        <AnalyticsFilters filters={filters} setFilters={setFilters} />
      </div>

      {!data ? (
        <EmptyAnalyticsState title="No Event Data" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <KPICard 
               title="Total Events Hosted" 
               value={data.total_events || 0} 
               trend={data.events_trend || 0}
               icon={Calendar}
               color="primary"
             />
             <KPICard 
               title="Tickets Sold" 
               value={data.tickets_sold || 0} 
               trend={data.tickets_trend || 0}
               icon={Ticket}
               color="blue"
             />
             <KPICard 
               title="Avg Event Rating" 
               value={data.avg_rating || 0} 
               prefix=""
               icon={Star}
               color="amber"
               trend={data.rating_trend || 0}
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text mb-8">Event Attendance Trends</h3>
                <div className="flex-1 min-h-[300px]">
                  <BarChart 
                    data={data.attendance_data || mockAttendanceData} 
                    labels={data.attendance_labels || mockAttendanceLabels} 
                    colorClass="bg-blue-500"
                  />
                </div>
             </div>

             <div className="lg:col-span-1 flex flex-col h-full">
                <TopEventsTable events={data.top_events} />
             </div>
          </div>
          
        </motion.div>
      )}
    </div>
  );
}
