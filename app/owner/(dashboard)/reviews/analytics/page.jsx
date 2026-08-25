'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useReviewAnalytics, useRatingSummary, useReviews } from '@/hooks/review';
import { ReviewAnalytics } from '@/components/reviews/ReviewAnalytics';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { ArrowLeft, Sparkles, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewAnalyticsPage() {
  const router = useRouter();
  const { data: analyticsRes, isLoading: isAnalyticsLoading } = useReviewAnalytics();
  const { data: summaryRes, isLoading: isSummaryLoading } = useRatingSummary();
  const { data: reviewRes, isLoading: isReviewsLoading, refetch } = useReviews();

  const analyticsData = analyticsRes?.data || {};
  const summaryData = summaryRes?.data || {};
  const reviews = Array.isArray(reviewRes?.data) ? reviewRes.data : (Array.isArray(reviewRes) ? reviewRes : []);

  const isLoading = isAnalyticsLoading && isSummaryLoading && isReviewsLoading;

  const handleExportCSV = () => {
    let csv = 'Customer Name,Rating,Review Comment,Venue Name,Created Date\n';
    if (reviews && reviews.length > 0) {
      reviews.forEach(r => {
        csv += `"${r.users?.name || 'Anonymous'}","${r.rating || 5}","${(r.review || r.comment || '').replace(/"/g, '""')}","${r.cafes?.name || 'Cafe'}","${r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_review_analytics_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/owner/reviews')}
              className="px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold flex items-center gap-1 hover:bg-[#6F4E37] hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Reviews</span>
            </button>
            <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">• REPUTATION INTELLIGENCE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Review Analytics & Rating Summary
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Analyze customer satisfaction scores, star rating distribution, positive feedback sentiment, and response velocity across your cafe venues.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button 
            type="button"
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report CSV</span>
          </button>

          <button 
            onClick={() => refetch()}
            className="w-10 h-10 rounded-2xl border border-border/60 bg-surface/40 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-48 bg-surface rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface rounded-3xl" />)}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Rating Summary Breakdown */}
          <section>
            <RatingSummary summary={summaryData} reviews={reviews} />
          </section>

          {/* Quick Performance Analytics Cards */}
          <section>
            <ReviewAnalytics analytics={analyticsData} reviews={reviews} />
          </section>
        </motion.div>
      )}

    </div>
  );
}
