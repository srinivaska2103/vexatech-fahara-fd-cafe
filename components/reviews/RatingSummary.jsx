'use client';
import React from 'react';
import { Star, Award, MessageSquare } from 'lucide-react';
import { RatingBreakdown } from './RatingBreakdown';

export const RatingSummary = ({ summary = {}, reviews = [] }) => {
  const totalReviews = summary.totalReviews || reviews.length || 0;
  
  const calculatedAvg = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  const averageRating = Number(summary.averageRating || calculatedAvg).toFixed(1);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/60 shadow-2xs flex flex-col md:flex-row items-center gap-8 md:gap-12 text-[#2C1810]">
      
      {/* Overall Score */}
      <div className="flex flex-col items-center text-center shrink-0 p-6 rounded-3xl bg-[#FFF8F0] border border-[#DDB892]/50 w-full md:w-56">
        <div className="text-5xl font-black text-[#6F4E37] tracking-tight mb-1">
          {averageRating}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'fill-surface/60 text-border/60'}`} 
            />
          ))}
        </div>
        <p className="text-xs font-extrabold text-[#2C1810]">Overall Diner Rating</p>
        <p className="text-[10px] text-text/50 mt-0.5">
          Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Breakdown */}
      <div className="flex-1 w-full">
        <h4 className="text-xs font-extrabold text-[#2C1810] uppercase tracking-wider mb-3">Star Rating Distribution</h4>
        <RatingBreakdown breakdown={summary.ratingDistribution || {}} reviews={reviews} />
      </div>
      
    </div>
  );
};
