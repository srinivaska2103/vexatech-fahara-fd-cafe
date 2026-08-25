'use client';
import React, { useState } from 'react';
import { Star, MapPin, Calendar, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { ReviewImages } from './ReviewImages';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ReviewDetails = ({ review }) => {
  const [copied, setCopied] = useState(false);
  if (!review) return null;

  const bookingId = review.bookings?.booking_number || review.booking_id || review.bookingId || 'N/A';
  const formattedBookingId = review.bookings?.booking_number || (review.booking_id ? review.booking_id.substring(0, 8).toUpperCase() : 'N/A');

  const handleCopyBookingId = () => {
    if (bookingId && bookingId !== 'N/A') {
      navigator.clipboard.writeText(bookingId);
      setCopied(true);
      toast.success('Booking ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6 text-[#2C1810]">
      
      {/* Top Rating & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center text-amber-700 shrink-0 shadow-2xs">
            <span className="text-xl font-black">{review.rating || 5}.0</span>
            <span className="text-[9px] font-extrabold uppercase text-amber-600/80">Rating</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-surface/60 text-border/60'}`} 
                />
              ))}
              <span className="text-xs font-black text-[#2C1810] ml-1.5">{review.rating || 5}.0 / 5.0</span>
            </div>
            <p className="text-xs text-text/60 mt-1 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
              <span>Reviewed on {review.created_at ? format(new Date(review.created_at), 'MMMM dd, yyyy') : 'Unknown Date'}</span>
            </p>
          </div>
        </div>

        {/* Booking ID Badge with Copy Button */}
        <div className="bg-[#FFF8F0] p-3 px-4 rounded-2xl border border-[#DDB892]/60 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Booking Reference</span>
            <span className="text-xs font-mono font-extrabold text-[#2C1810]">{formattedBookingId}</span>
          </div>
          {bookingId && bookingId !== 'N/A' && (
            <button
              type="button"
              onClick={handleCopyBookingId}
              className="p-1.5 rounded-xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white transition-all shadow-2xs cursor-pointer"
              title="Copy Booking ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Review Comment Box */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider block">Diner Review Feedback</span>
        <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] p-5 sm:p-6 rounded-2xl border border-[#DDB892]/60 shadow-2xs">
          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-[#2C1810] font-medium italic">
            "{review.review || review.comment || <span className="not-italic text-text/50">No written text provided. The diner submitted a star rating feedback.</span>}"
          </p>
        </div>
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <ReviewImages images={review.images} />
      )}

      {/* Cafe & Venue Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="bg-surface/30 p-4 rounded-2xl border border-border/50 space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#6F4E37] tracking-wider block">Reviewed Cafe Venue</span>
          <span className="font-extrabold text-[#2C1810] text-xs sm:text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#6F4E37]" />
            {review.cafes?.name || 'Your Cafe'}
          </span>
          {review.cafes?.address && (
            <p className="text-[11px] text-text/60 pl-6">{review.cafes.address}</p>
          )}
        </div>

        {review.event_services?.name && (
          <div className="bg-surface/30 p-4 rounded-2xl border border-border/50 space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#6F4E37] tracking-wider block">Event Package</span>
            <span className="font-extrabold text-[#2C1810] text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              {review.event_services.name}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
