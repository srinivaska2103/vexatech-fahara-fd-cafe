'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRevenueAnalytics } from '@/hooks/analytics';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { KPICard } from '@/components/analytics/KPICard';
import { BarChart } from '@/components/analytics/charts/BarChart';
import { LineChart } from '@/components/analytics/charts/LineChart';
import { RevenueBreakdown } from '@/components/analytics/RevenueBreakdown';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '@/components/analytics/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, IndianRupee, CreditCard, TrendingUp, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ date_range: 'THIS_YEAR', cafe_id: '' });
  const { data: revenueData, isLoading, isError } = useRevenueAnalytics(filters);

  const data = revenueData?.data;

  // Mock data for visualizations
  const mockMonthlyData = [12000, 15000, 14000, 22000, 18000, 26000, 24000, 32000, 28000, 35000, 31000, 42000];
  const mockMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (isLoading) return <div className="p-6 md:p-8"><LoadingSkeleton type="dashboard" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/analytics')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Button>
          <AnalyticsHeader 
            title="Revenue Analytics" 
            description="Deep dive into financial performance and income sources."
          />
        </div>
        <div className="flex gap-3 items-center">
           <AnalyticsFilters filters={filters} setFilters={setFilters} />
           <Button variant="outline" className="hidden sm:flex shadow-sm">
             <Download className="w-4 h-4 mr-2" /> Export
           </Button>
        </div>
      </div>

      {!data ? (
        <EmptyAnalyticsState title="No Revenue Data" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <KPICard 
               title="Net Revenue" 
               value={data.net_revenue || 0} 
               prefix="₹"
               trend={data.net_trend || 0}
               icon={IndianRupee}
               color="primary"
             />
             <KPICard 
               title="Average Booking Value" 
               value={data.avg_order_value || 0} 
               prefix="₹"
               trend={data.aov_trend || 0}
               icon={TrendingUp}
               color="blue"
             />
             <KPICard 
               title="Total Transactions" 
               value={data.total_transactions || 0} 
               trend={data.transaction_trend || 0}
               icon={CreditCard}
               color="green"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text mb-8">Monthly Revenue Comparison</h3>
                <div className="flex-1 min-h-[300px]">
                  <BarChart 
                    data={data.monthly_revenue || mockMonthlyData} 
                    labels={data.months || mockMonths} 
                  />
                </div>
             </div>

             <div className="lg:col-span-1">
                <RevenueBreakdown data={data.breakdown} />
             </div>
          </div>
          
          {/* Detailed trend line */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
            <h3 className="text-lg font-bold text-text mb-8">Cumulative Revenue Growth</h3>
            <div className="h-64">
               <LineChart 
                 data={data.cumulative_revenue || [...mockMonthlyData].reduce((a, b, i) => [...a, b + (a[i-1] || 0)], [])} 
                 labels={data.months || mockMonths} 
                 colorClass="bg-green-500" 
               />
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
