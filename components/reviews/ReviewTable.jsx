'use client';
import React from 'react';
import { Star, ArrowUpRight, Store, Calendar, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export const ReviewTable = ({ reviews }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs text-[#2C1810]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
            <tr>
              <th className="px-6 py-4">Customer Diner</th>
              <th className="px-6 py-4">Rating & Review Comment</th>
              <th className="px-6 py-4">Reviewed Venue</th>
              <th className="px-6 py-4">Submitted Date</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {reviews.map((review) => {
              const userName = review.users?.name || 'Anonymous Diner';
              const cafeName = review.cafes?.name || 'Cafe Venue';
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
                      {review.users?.profile_image ? (
                        <img src={review.users.profile_image} alt={userName} className="w-10 h-10 rounded-full object-cover border border-[#DDB892]/50" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 border border-[#DDB892]/40 text-[#6F4E37] font-black text-sm flex items-center justify-center shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-[#2C1810]">{userName}</p>
                        <p className="text-[10px] text-[#6F4E37] font-mono font-bold">
                          Booking ID: {review.bookings?.booking_number || (review.booking_id ? review.booking_id.substring(0, 8).toUpperCase() : (review.bookingId || 'N/A'))}
                        </p>
                      </div>
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
                        <span className="text-[10px] font-black text-[#2C1810] ml-1">{rating}.0</span>
                      </div>
                      <p className="text-xs text-text/80 line-clamp-2 leading-relaxed">
                        {review.review || review.comment || <span className="italic text-text/40">No written comment provided</span>}
                      </p>
                    </div>
                  </td>

                  {/* Cafe Venue */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-[#2C1810] flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-[#6F4E37]" />
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
                    <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white transition-all inline-flex items-center justify-center">
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
