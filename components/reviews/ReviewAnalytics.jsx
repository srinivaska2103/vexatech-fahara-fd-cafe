'use client';
import React from 'react';
import { MessageSquare, Star, ThumbsUp, MessageCircle, Sparkles, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ReviewAnalytics = ({ analytics = {}, reviews = [] }) => {
  const router = useRouter();

  const totalReviews = analytics.totalReviews ?? reviews.length;
  const calculatedAvg = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const averageRating = analytics.averageRating ?? calculatedAvg;

  const positiveCount = reviews.filter(r => (r.rating || 5) >= 4).length;
  const positivePercentage = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 100;
  const positiveReviews = analytics.positiveReviews ?? positivePercentage;

  const repliedCount = reviews.filter(r => Boolean(r.owner_reply || r.reply)).length;
  const responseRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0;

  return (
    <div className="space-y-6 text-[#2C1810]">
      
      {/* 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Reviews */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Total Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalReviews}</p>
          <p className="text-[10px] text-text/50 font-medium">All recorded guest feedback</p>
        </div>

        {/* Avg Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{Number(averageRating).toFixed(1)} ★</p>
          <p className="text-[10px] text-amber-700/80 font-bold">Diner satisfaction score</p>
        </div>

        {/* Positive Sentiment */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Positive Sentiment</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{positiveReviews}%</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">{positiveCount} 4 & 5-Star ratings</p>
        </div>

        {/* Response Velocity */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1.5">
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

      {/* Featured Diner Praise Showcase */}
      {reviews.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810]">Recent Diner Praise</h3>
                <p className="text-xs text-text/60">Verified customer feedback and venue reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {reviews.slice(0, 4).map((r) => {
              const name = r.users?.name || 'Anonymous Diner';
              const rating = r.rating || 5;

              return (
                <div 
                  key={r.id}
                  onClick={() => router.push(`/owner/reviews/${r.id}`)}
                  className="p-4 rounded-2xl border border-border/40 hover:bg-[#FFF8F0] hover:border-[#DDB892]/60 transition-all space-y-2 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] font-black text-xs flex items-center justify-center shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">{name}</p>
                        <p className="text-[10px] text-text/50">{r.cafes?.name || 'Cafe Venue'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-surface text-border/60'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text/70 line-clamp-2 leading-relaxed italic">
                    "{r.review || r.comment || 'Great experience!'}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
