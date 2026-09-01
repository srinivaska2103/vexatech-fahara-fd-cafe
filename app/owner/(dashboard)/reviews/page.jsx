'use client';
import React, { useState } from 'react';
import { useReviews } from '@/hooks/review';
import { ReviewTable } from '@/components/reviews/ReviewTable';
import { EmptyReviewState } from '@/components/reviews/EmptyReviewState';
import { LoadingSkeleton } from '@/components/reviews/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Star, 
  MessageSquare, 
  BarChart3, 
  Search, 
  Sparkles, 
  ThumbsUp, 
  MessageCircle, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const { data: reviewRes, isLoading, isError, error, refetch } = useReviews({ search });
  const rawReviews = Array.isArray(reviewRes?.data) ? reviewRes.data : (Array.isArray(reviewRes) ? reviewRes : []);

  // Filter reviews based on rating & search
  const reviews = rawReviews.filter(r => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (r.review || r.comment || r.content || '').toLowerCase().includes(searchLower) ||
      (r.customer_name || r.user_name || r.users?.name || '').toLowerCase().includes(searchLower) ||
      (r.cafe_name || r.service_name || r.cafes?.name || '').toLowerCase().includes(searchLower) ||
      (r.booking_number || r.bookings?.booking_number || '').toLowerCase().includes(searchLower);

    let matchesRating = true;
    if (ratingFilter === '5') {
      matchesRating = r.rating === 5;
    } else if (ratingFilter === '4') {
      matchesRating = r.rating === 4;
    } else if (ratingFilter === '3_BELOW') {
      matchesRating = (r.rating || 0) <= 3;
    } else if (ratingFilter === 'REPLIED') {
      matchesRating = Boolean(r.owner_reply || r.reply || r.reply_text);
    }

    return matchesSearch && matchesRating;
  });

  // Dynamic stats
  const totalCount = rawReviews.length;
  const avgRating = totalCount > 0 
    ? (rawReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';
  const fiveStarCount = rawReviews.filter(r => r.rating === 5).length;
  const repliedCount = rawReviews.filter(r => Boolean(r.owner_reply || r.reply || r.reply_text)).length;
  const responseRate = totalCount > 0 ? Math.round((repliedCount / totalCount) * 100) : 0;

  const handleExportCSV = () => {
    let csv = 'Customer Name,Booking ID,Rating,Review Comment,Venue Name,Created Date,Owner Reply\n';
    
    if (reviews && reviews.length > 0) {
      reviews.forEach(r => {
        const name = r.customer_name || r.user_name || r.users?.name || 'Valued Customer';
        const bookingNo = r.booking_number || r.bookings?.booking_number || (r.booking_id ? `#${String(r.booking_id).slice(0, 8)}` : 'N/A');
        const rating = r.rating || 5;
        const text = (r.review || r.comment || r.content || '').replace(/"/g, '""');
        const cafe = r.cafe_name || r.service_name || r.cafes?.name || 'Cafe';
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
        const reply = (r.owner_reply || r.reply || r.reply_text || '').replace(/"/g, '""');
        
        csv += `"${name}","${bookingNo}","${rating}","${text}","${cafe}","${date}","${reply}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_reviews_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const ratingTabs = [
    { id: 'ALL', label: 'All Reviews', count: totalCount },
    { id: '5', label: '5 ★ Stars', count: fiveStarCount },
    { id: '4', label: '4 ★ Stars', count: rawReviews.filter(r => r.rating === 4).length },
    { id: '3_BELOW', label: '3 ★ & Below', count: rawReviews.filter(r => (r.rating || 0) <= 3).length },
    { id: 'REPLIED', label: 'Replied', count: repliedCount },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DINER REPUTATION STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Monitor customer satisfaction, star ratings, diner feedback comments, and venue reputation across all cafes.
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
            <span>Export CSV</span>
          </button>

          <Button 
            onClick={() => router.push('/owner/reviews/analytics')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-white" />
            <span>Review Analytics</span>
          </Button>
        </div>
      </div>

      {/* 4 Dynamic Review Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Average Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{avgRating}</p>
            <span className="text-xs text-amber-600 font-bold">/ 5.0</span>
          </div>
          <p className="text-[10px] text-text/50 font-medium">Overall satisfaction score</p>
        </div>

        {/* Total Reviews */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider">Verified Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalCount}</p>
          <p className="text-[10px] text-text/50 font-medium">Total diner ratings submitted</p>
        </div>

        {/* 5-Star Praise */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">5-Star Praise</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{fiveStarCount}</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">Top ratings received</p>
        </div>

        {/* Response Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-wider">Response Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{responseRate}%</p>
          <p className="text-[10px] text-text/50 font-medium">{repliedCount} Owner replies posted</p>
        </div>

      </div>

      {/* Toolbar & Rating Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Rating Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {ratingTabs.map((tab) => {
              const isActive = ratingFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRatingFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#6F4E37] text-white shadow-2xs'
                      : 'bg-surface/50 text-[#2C1810] hover:bg-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#6F4E37]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Refresh Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
                placeholder="Search reviews, diner name..." 
              />
            </div>

            <button 
              onClick={() => refetch()}
              className="w-10 h-10 rounded-2xl border border-border/60 bg-surface/40 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
              title="Refresh Reviews"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Table / Empty State */}
      {isLoading ? (
        <LoadingSkeleton type="table" />
      ) : isError ? (
        <div className="bg-rose-500/10 text-rose-700 p-6 rounded-3xl border border-rose-500/20 text-center text-xs">
          <p className="font-extrabold text-sm mb-1">Unable to Load Reviews</p>
          <p>{error?.message || 'Please check backend connection and retry.'}</p>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyReviewState 
          showClear={Boolean(search || ratingFilter !== 'ALL')}
          onClear={() => {
            setSearch('');
            setRatingFilter('ALL');
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ReviewTable reviews={reviews} />
        </motion.div>
      )}

    </div>
  );
}
