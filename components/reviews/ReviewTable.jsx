'use client';
import React from 'react';
import { Star, ArrowUpRight, Store, Calendar, MessageSquare, Utensils, BookmarkCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export const ReviewTable = ({ reviews }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs text-[#252525]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#E50914] border-b border-border/50 tracking-wider">
            <tr>
              <th className="px-6 py-4">Customer Diner</th>
              <th className="px-6 py-4">Source & Reference</th>
              <th className="px-6 py-4">Rating & Review Comment</th>
              <th className="px-6 py-4">Reviewed Venue</th>
              <th className="px-6 py-4">Submitted Date</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {reviews.map((review) => {
              const userName = review.customer_name || review.user_name || review.users?.name || 'Valued Customer';
              const cafeName = review.cafe_name || review.service_name || review.cafes?.name || 'Cafe Venue';
              const isFoodOrder = review.review_type === 'FOOD_ORDER' || review.is_food_order || Boolean(review.order_id);
              const referenceNo = isFoodOrder 
                ? (review.order_number || review.booking_number || (review.order_id ? `#${String(review.order_id).slice(0, 8).toUpperCase()}` : 'Order'))
                : (review.booking_number || review.bookings?.booking_number || (review.booking_id ? `#${String(review.booking_id).slice(0, 8)}` : 'N/A'));
              const rating = review.rating || 5;

              return (
                <tr 
                  key={review.id} 
                  onClick={() => router.push(`/owner/reviews/${review.id}`)}
                  className="hover:bg-surface/40 transition-colors cursor-pointer group"
                >
                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {review.profile_image || review.users?.profile_image ? (
                        <img src={review.profile_image || review.users.profile_image} alt={userName} className="w-10 h-10 rounded-full object-cover border border-[#EF5350]/50" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E50914]/10 border border-[#EF5350]/40 text-[#E50914] font-black text-sm flex items-center justify-center shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-[#252525]">{userName}</p>
                        <p className="text-[10px] text-text/50 font-medium">
                          {review.customer_email || review.customer_phone || 'Verified Customer'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Review Source Badge & Reference */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {isFoodOrder ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-[#E50914] border border-[#FEE2E2]">
                          <Utensils className="w-3 h-3" /> Food Order Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                          <BookmarkCheck className="w-3 h-3" /> Table Booking Review
                        </span>
                      )}
                      <p className="text-[10px] text-[#252525] font-mono font-bold">
                        {isFoodOrder ? `Order: ${referenceNo}` : `Booking: ${referenceNo}`}
                      </p>
                      {review.order_items_summary && (
                        <p className="text-[10px] text-text/60 truncate max-w-[180px]">
                          {review.order_items_summary}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Rating & Text */}
                  <td className="px-6 py-4">
                    <div className="space-y-1 max-w-sm whitespace-normal">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={cn(
                              "w-3.5 h-3.5",
                              star <= rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "fill-surface/60 text-border/60"
                            )} 
                          />
                        ))}
                        <span className="text-[10px] font-black text-[#252525] ml-1">{rating}.0</span>
                        {review.review_title && (
                          <span className="text-[10px] font-black text-[#252525] ml-1.5">• {review.review_title}</span>
                        )}
                      </div>
                      <p className="text-xs text-text/80 line-clamp-2 leading-relaxed">
                        {review.review || review.comment || <span className="italic text-text/40">No written comment provided</span>}
                      </p>
                    </div>
                  </td>

                  {/* Cafe Venue */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-[#252525] flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>{cafeName}</span>
                      </p>
                      {review.event_services?.name && (
                        <p className="text-[10px] text-text/50">{review.event_services.name}</p>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-text/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-text/40" />
                      <span>{review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <div className="w-8 h-8 rounded-xl bg-[#E50914]/10 text-[#E50914] group-hover:bg-[#E50914] group-hover:text-white transition-all inline-flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
