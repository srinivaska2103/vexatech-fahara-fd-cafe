'use client';
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export const RatingBreakdown = ({ breakdown = {}, reviews = [] }) => {
  // Compute distribution from breakdown object or directly from real reviews list
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, ...breakdown };
  
  if (reviews.length > 0) {
    reviews.forEach(r => {
      const star = r.rating || 5;
      if (distribution[star] !== undefined) {
        distribution[star] += 1;
      }
    });
  }

  const rows = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: distribution[stars] || 0
  }));

  const totalReviews = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-3.5 text-[#2C1810]">
      {rows.map((row) => {
        const percentage = totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0;
        
        return (
          <div key={row.stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-14 text-xs font-extrabold text-[#2C1810]">
              <span>{row.stars}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            
            <div className="flex-1 h-3 bg-surface/70 rounded-full overflow-hidden relative border border-border/40">
              <div 
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full transition-all duration-700",
                  row.stars === 5 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                  row.stars === 4 ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
                  row.stars === 3 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                  row.stars === 2 ? "bg-gradient-to-r from-orange-400 to-amber-600" : 
                  "bg-gradient-to-r from-rose-500 to-rose-600"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="w-16 text-right text-xs text-text/60 font-bold flex items-center justify-end gap-1">
              <span>{percentage}%</span>
              <span className="text-[10px] text-text/40 font-normal">({row.count})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
