'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAnalytics } from '@/hooks/analytics';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { KPICard } from '@/components/analytics/KPICard';
import { LineChart } from '@/components/analytics/charts/LineChart';
import { TopCustomersTable } from '@/components/analytics/TopCustomersTable';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Users, UserPlus, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerAnalyticsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ date_range: 'THIS_YEAR', cafe_id: '' });
  const { data: customerData, isLoading, isError } = useCustomerAnalytics(filters);

  const data = customerData?.data;

  // Mock data
  const mockGrowthData = [50, 80, 120, 190, 250, 310, 400, 480];
  const mockGrowthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  if (isLoading) return <div className="p-6 md:p-8"><LoadingSkeleton type="dashboard" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/analytics')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Button>
          <AnalyticsHeader 
            title="Customer Analytics" 
            description="Track customer acquisition, retention, and lifetime value."
          />
        </div>
        <AnalyticsFilters filters={filters} setFilters={setFilters} hideCafeFilter />
      </div>

      {!data ? (
        <EmptyAnalyticsState title="No Customer Data" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <KPICard 
               title="Total Customers" 
               value={data.total_customers || 0} 
               trend={data.total_trend || 0}
               icon={Users}
               color="primary"
             />
             <KPICard 
               title="New Customers" 
               value={data.new_customers || 0} 
               trend={data.new_trend || 0}
               icon={UserPlus}
               color="green"
             />
             <KPICard 
               title="Returning Customers" 
               value={data.returning_customers || 0} 
               trend={data.retention_trend || 0}
               icon={UserCheck}
               color="blue"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text mb-8">Customer Growth Over Time</h3>
                <div className="flex-1 min-h-[300px]">
                  <LineChart 
                    data={data.growth_data || mockGrowthData} 
                    labels={data.growth_labels || mockGrowthLabels} 
                    colorClass="bg-primary"
                  />
                </div>
             </div>

             <div className="lg:col-span-1">
                <TopCustomersTable customers={data.top_customers} />
             </div>
          </div>
          
        </motion.div>
      )}
    </div>
  );
}
