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
  RefreshCw,
  Utensils,
  BookmarkCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL'); // ALL, FOOD_ORDER, BOOKING

  const { data: reviewRes, isLoading, isError, error, refetch } = useReviews({ search });
  const rawReviews = Array.isArray(reviewRes?.data) ? reviewRes.data : (Array.isArray(reviewRes) ? reviewRes : []);

  // Filter reviews based on rating, source & search
  const reviews = rawReviews.filter(r => {
    const searchLower = search.toLowerCase();
    const isFoodOrder = r.review_type === 'FOOD_ORDER' || r.is_food_order || Boolean(r.order_id);

    const matchesSearch = !search || 
      (r.review || r.comment || r.content || '').toLowerCase().includes(searchLower) ||
      (r.review_title || '').toLowerCase().includes(searchLower) ||
      (r.customer_name || r.user_name || r.users?.name || '').toLowerCase().includes(searchLower) ||
      (r.cafe_name || r.service_name || r.cafes?.name || '').toLowerCase().includes(searchLower) ||
      (r.booking_number || r.order_number || r.bookings?.booking_number || '').toLowerCase().includes(searchLower);

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

    let matchesSource = true;
    if (sourceFilter === 'FOOD_ORDER') {
      matchesSource = isFoodOrder;
    } else if (sourceFilter === 'BOOKING') {
      matchesSource = !isFoodOrder;
    }

    return matchesSearch && matchesRating && matchesSource;
  });

  // Dynamic stats
  const totalCount = rawReviews.length;
  const avgRating = totalCount > 0 
    ? (rawReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';
  const fiveStarCount = rawReviews.filter(r => r.rating === 5).length;
  const repliedCount = rawReviews.filter(r => Boolean(r.owner_reply || r.reply || r.reply_text)).length;
  const responseRate = totalCount > 0 ? Math.round((repliedCount / totalCount) * 100) : 0;
  const foodOrdersCount = rawReviews.filter(r => r.review_type === 'FOOD_ORDER' || r.is_food_order || Boolean(r.order_id)).length;
  const bookingsCount = totalCount - foodOrdersCount;

  const handleExportCSV = () => {
    let csv = 'Customer Name,Type,Reference ID,Rating,Review Title,Review Comment,Venue Name,Created Date,Owner Reply\n';
    
    if (reviews && reviews.length > 0) {
      reviews.forEach(r => {
        const name = r.customer_name || r.user_name || r.users?.name || 'Valued Customer';
        const type = (r.review_type === 'FOOD_ORDER' || r.is_food_order || Boolean(r.order_id)) ? 'Food Order' : 'Table Booking';
        const refNo = r.order_number || r.booking_number || (r.order_id ? `#${String(r.order_id).slice(0, 8)}` : (r.booking_id ? `#${String(r.booking_id).slice(0, 8)}` : 'N/A'));
        const rating = r.rating || 5;
        const title = (r.review_title || '').replace(/"/g, '""');
        const text = (r.review || r.comment || r.content || '').replace(/"/g, '""');
        const cafe = r.cafe_name || r.service_name || r.cafes?.name || 'Cafe';
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
        const reply = (r.owner_reply || r.reply || r.reply_text || '').replace(/"/g, '""');
        
        csv += `"${name}","${type}","${refNo}","${rating}","${title}","${text}","${cafe}","${date}","${reply}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `grab2go_reviews_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const ratingTabs = [
    { id: 'ALL', label: 'All Ratings', count: totalCount },
    { id: '5', label: '5 ★ Stars', count: fiveStarCount },
    { id: '4', label: '4 ★ Stars', count: rawReviews.filter(r => r.rating === 4).length },
    { id: '3_BELOW', label: '3 ★ & Below', count: rawReviews.filter(r => (r.rating || 0) <= 3).length },
    { id: 'REPLIED', label: 'Replied', count: repliedCount },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#252525]">
      
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">Customer Reviews</h1>
            <span className="p-1.5 rounded-xl bg-[#E50914]/10 text-[#E50914] shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-text/60 mt-1">
            Monitor feedback, ratings, and customer satisfaction across Food Orders and Table Bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="rounded-2xl border-border/60 hover:bg-surface/50 text-xs font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
            Refresh
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="rounded-2xl border-border/60 hover:bg-surface/50 text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-text/60" />
            Export CSV
          </Button>

          <Button 
            onClick={() => router.push('/owner/reviews/analytics')}
            className="rounded-2xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-[#E50914]/20"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Review Analytics
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Average Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl sm:text-3xl font-black text-[#252525]">{avgRating}</p>
            <span className="text-xs text-amber-600 font-bold">/ 5.0</span>
          </div>
          <p className="text-[10px] text-text/50 font-medium">Overall satisfaction score</p>
        </div>

        {/* Total Reviews */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#E50914] uppercase tracking-wider">Verified Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#252525]">{totalCount}</p>
          <p className="text-[10px] text-text/50 font-medium">{foodOrdersCount} Food Orders • {bookingsCount} Bookings</p>
        </div>

        {/* 5-Star Praise */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">5-Star Praise</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#252525]">{fiveStarCount}</p>
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
          <p className="text-xl sm:text-3xl font-black text-[#252525]">{responseRate}%</p>
          <p className="text-[10px] text-text/50 font-medium">{repliedCount} Owner replies posted</p>
        </div>

      </div>

      {/* Toolbar & Rating Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        
        {/* Source Filter Tabs: All, Food Order Reviews, Booking Reviews */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-3">
          <button
            onClick={() => setSourceFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sourceFilter === 'ALL'
                ? 'bg-[#E50914] text-white shadow-xs'
                : 'bg-surface/50 text-[#757575] hover:bg-surface border border-border/40'
            }`}
          >
            All Reviews ({totalCount})
          </button>

          <button
            onClick={() => setSourceFilter('FOOD_ORDER')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sourceFilter === 'FOOD_ORDER'
                ? 'bg-[#E50914] text-white shadow-xs'
                : 'bg-surface/50 text-[#757575] hover:bg-surface border border-border/40'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Food Order Reviews ({foodOrdersCount})
          </button>

          <button
            onClick={() => setSourceFilter('BOOKING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sourceFilter === 'BOOKING'
                ? 'bg-[#E50914] text-white shadow-xs'
                : 'bg-surface/50 text-[#757575] hover:bg-surface border border-border/40'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Table Booking Reviews ({bookingsCount})
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Rating Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {ratingTabs.map((tab) => {
              const isActive = ratingFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRatingFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isActive 
                      ? 'bg-[#E50914] text-white shadow-xs' 
                      : 'text-text/70 hover:bg-surface hover:text-[#252525]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface text-text/60'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, dish or note..."
              className="w-full pl-9 pr-4 py-2 bg-surface/40 hover:bg-surface/60 focus:bg-white border border-border/60 rounded-2xl text-xs outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all text-[#252525] placeholder:text-text/40"
            />
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="bg-rose-500/10 text-rose-700 p-8 rounded-3xl border border-rose-500/20 text-center space-y-3">
          <p className="font-black text-sm">Failed to load customer reviews</p>
          <p className="text-xs text-text/60 max-w-md mx-auto">{error?.message || 'Please check your connection and try again.'}</p>
          <Button onClick={() => refetch()} variant="outline" className="text-xs font-bold">
            Try Again
          </Button>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyReviewState onReset={() => { setSearch(''); setRatingFilter('ALL'); setSourceFilter('ALL'); }} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ReviewTable reviews={reviews} />
        </motion.div>
      )}

    </div>
  );
}
