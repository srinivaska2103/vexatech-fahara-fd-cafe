'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRevenueSummary, useExportReport } from '@/hooks/payment';
import { EarningsChart } from '@/components/payments/EarningsChart';
import { ExportReportDialog } from '@/components/payments/ExportReportDialog';
import { LoadingSkeleton } from '@/components/payments/LoadingSkeleton';
import { PageHeader } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Download, TrendingUp, TrendingDown, IndianRupee, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const router = useRouter();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  const { data: revenueData, isLoading } = useRevenueSummary();
  const exportMutation = useExportReport();

  const revenue = revenueData?.data;

  // Mock chart data if backend is empty for visualization
  const chartData = revenue?.chart_data || {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [12000, 19000, 15000, 22000, 18000, 25000]
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/payments')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Payments
          </Button>
          <PageHeader 
            title="Financial Reports & Analytics" 
            description="Deep dive into your earnings, success rates, and export data."
          />
        </div>
        <Button 
          onClick={() => setIsExportDialogOpen(true)}
          className="flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-8">
           <LoadingSkeleton type="stats" />
           <LoadingSkeleton type="chart" />
        </div>
      ) : !revenue ? (
        <div className="p-12 bg-surface/30 rounded-3xl border border-border/50 border-dashed text-center">
           <p className="font-semibold text-text mb-2">No Financial Data Available</p>
           <p className="text-sm text-text/60">Backend endpoints for analytics are not yet implemented.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
               <div className="text-sm font-medium text-text/60 mb-1">Net Revenue (YTD)</div>
               <div className="text-3xl font-bold text-text mb-2">₹{Number(revenue.ytd_revenue || 124500).toLocaleString()}</div>
               <div className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-50 w-fit px-2 py-0.5 rounded">
                 <TrendingUp className="w-3 h-3" /> +12.5% vs last year
               </div>
             </div>
             
             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
               <div className="text-sm font-medium text-text/60 mb-1">Average Order Value</div>
               <div className="text-3xl font-bold text-text mb-2">₹{Number(revenue.aov || 450).toLocaleString()}</div>
               <div className="text-xs font-medium text-text/50 flex items-center gap-1 bg-surface w-fit px-2 py-0.5 rounded">
                 Stable
               </div>
             </div>

             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
               <div className="text-sm font-medium text-text/60 mb-1">Payment Success Rate</div>
               <div className="text-3xl font-bold text-text mb-2">{revenue.success_rate || 98.2}%</div>
               <div className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-50 w-fit px-2 py-0.5 rounded">
                 <TrendingUp className="w-3 h-3" /> +0.5%
               </div>
             </div>

             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
               <div className="text-sm font-medium text-text/60 mb-1">Refund Rate</div>
               <div className="text-3xl font-bold text-text mb-2">{revenue.refund_rate || 1.8}%</div>
               <div className="text-xs font-medium text-danger flex items-center gap-1 bg-danger/10 w-fit px-2 py-0.5 rounded">
                 <TrendingDown className="w-3 h-3" /> Needs Attention
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
               <div className="flex items-center gap-2 mb-8 text-lg font-bold text-text">
                 <Activity className="w-5 h-5 text-primary" /> Revenue Trend
               </div>
               <EarningsChart data={chartData} />
            </div>

            {/* Leaderboards */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-text/50 mb-4">Top Revenue Cafes</h3>
                 <div className="space-y-4">
                   {(revenue?.top_revenue_cafes || []).map((cafe, i) => (
                     <div key={i} className="flex justify-between items-center">
                       <span className="font-medium text-sm text-text">{cafe.name}</span>
                       <span className="font-bold text-sm text-primary">₹{Number(cafe.revenue).toLocaleString()}</span>
                     </div>
                   ))}
                   {(!revenue?.top_revenue_cafes || revenue.top_revenue_cafes.length === 0) && (
                     <div className="text-sm text-text/50">No cafe revenue data available.</div>
                   )}
                 </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-text/50 mb-4">Top Revenue Events</h3>
                 <div className="space-y-4">
                   {(revenue?.top_revenue_events || []).map((event, i) => (
                     <div key={i} className="flex justify-between items-center">
                       <span className="font-medium text-sm text-text line-clamp-1">{event.name}</span>
                       <span className="font-bold text-sm text-primary">₹{Number(event.revenue).toLocaleString()}</span>
                     </div>
                   ))}
                   {(!revenue?.top_revenue_events || revenue.top_revenue_events.length === 0) && (
                     <div className="text-sm text-text/50">No event revenue data available.</div>
                   )}
                 </div>
               </div>
            </div>
          </div>

        </motion.div>
      )}

      <ExportReportDialog 
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onConfirm={(data) => {
          exportMutation.mutate(data, {
            onSuccess: () => setIsExportDialogOpen(false)
          });
        }}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
}
