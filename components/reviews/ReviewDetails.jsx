'use client';
import React, { useState } from 'react';
import { Star, MapPin, Calendar, Copy, Check, Sparkles, MessageSquare, Utensils, Package, Truck, ShoppingBag } from 'lucide-react';
import { ReviewImages } from './ReviewImages';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ReviewDetails = ({ review }) => {
  const [copied, setCopied] = useState(false);
  if (!review) return null;

  const isFoodOrder = review.review_type === 'FOOD_ORDER' || review.is_food_order || Boolean(review.order_id);
  const refId = isFoodOrder
    ? (review.food_orders?.order_number || review.booking_number || (review.order_id ? `#${review.order_id.slice(0, 8).toUpperCase()}` : 'Order'))
    : (review.bookings?.booking_number || review.booking_number || (review.booking_id ? review.booking_id.substring(0, 8).toUpperCase() : 'N/A'));

  const handleCopyRefId = () => {
    if (refId && refId !== 'N/A') {
      navigator.clipboard.writeText(refId);
      setCopied(true);
      toast.success(`${isFoodOrder ? 'Order' : 'Booking'} Reference copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6 text-[#252525]">
      
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
              <span className="text-xs font-black text-[#252525] ml-1.5">{review.rating || 5}.0 / 5.0</span>
            </div>
            <p className="text-xs text-text/60 mt-1 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Reviewed on {review.created_at ? format(new Date(review.created_at), 'MMMM dd, yyyy') : 'Unknown Date'}</span>
            </p>
          </div>
        </div>

        {/* Reference Badge with Copy Button */}
        <div className="bg-[#FFF5F5] p-3 px-4 rounded-2xl border border-[#EF5350]/60 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block">
              {isFoodOrder ? 'Food Order Reference' : 'Booking Reference'}
            </span>
            <span className="text-xs font-mono font-extrabold text-[#252525]">{refId}</span>
          </div>
          {refId && refId !== 'N/A' && (
            <button
              type="button"
              onClick={handleCopyRefId}
              className="p-1.5 rounded-xl bg-white border border-[#EF5350]/60 hover:bg-[#E50914] text-[#E50914] hover:text-white transition-all shadow-2xs cursor-pointer"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Review Comment Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#E50914] uppercase tracking-wider block">Customer Feedback</span>
          {isFoodOrder ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-[#E50914] border border-[#FEE2E2]">
              <Utensils className="w-3 h-3" /> Food Order Review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
              Table Booking Review
            </span>
          )}
        </div>

        {review.review_title && (
          <h4 className="text-sm font-black text-[#252525] pt-1">{review.review_title}</h4>
        )}

        <div className="bg-gradient-to-br from-[#FFF5F5] via-[#FFF5F5] to-[#FFF3E4] p-5 sm:p-6 rounded-2xl border border-[#EF5350]/60 shadow-2xs">
          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-[#252525] font-medium italic">
            "{review.review || review.comment || <span className="not-italic text-text/50">No written text provided. The customer submitted a star rating feedback.</span>}"
          </p>
        </div>
      </div>

      {/* Food Order Specific Ratings */}
      {(review.food_quality_rating || review.packaging_rating || review.delivery_rating) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {review.food_quality_rating && (
            <div className="p-3 rounded-2xl bg-surface/40 border border-border/50 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-text/70 font-bold">
                <Utensils className="w-3.5 h-3.5 text-[#E50914]" /> Food Quality
              </span>
              <span className="font-black text-[#252525]">{review.food_quality_rating} ★</span>
            </div>
          )}
          {review.packaging_rating && (
            <div className="p-3 rounded-2xl bg-surface/40 border border-border/50 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-text/70 font-bold">
                <Package className="w-3.5 h-3.5 text-[#E50914]" /> Packaging
              </span>
              <span className="font-black text-[#252525]">{review.packaging_rating} ★</span>
            </div>
          )}
          {review.delivery_rating && (
            <div className="p-3 rounded-2xl bg-surface/40 border border-border/50 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-text/70 font-bold">
                <Truck className="w-3.5 h-3.5 text-[#E50914]" /> Delivery Service
              </span>
              <span className="font-black text-[#252525]">{review.delivery_rating} ★</span>
            </div>
          )}
        </div>
      )}

      {/* Ordered Food Items List if available */}
      {review.food_order?.order_items && review.food_order.order_items.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <span className="text-[11px] uppercase font-extrabold text-[#E50914] tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Ordered Food Items
          </span>
          <div className="flex flex-wrap gap-2">
            {review.food_order.order_items.map((item) => (
              <span key={item.id} className="px-3 py-1 bg-surface/50 border border-border/60 rounded-xl text-xs font-bold text-[#252525]">
                {item.quantity}x {item.item_name_snapshot}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <ReviewImages images={review.images} />
      )}

      {/* Cafe & Venue Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="bg-surface/30 p-4 rounded-2xl border border-border/50 space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#E50914] tracking-wider block">Reviewed Cafe Venue</span>
          <span className="font-extrabold text-[#252525] text-xs sm:text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E50914]" />
            {review.cafes?.name || 'Your Cafe'}
          </span>
          {review.cafes?.address && (
            <p className="text-[11px] text-text/60 pl-6">{review.cafes.address}</p>
          )}
        </div>

        {review.event_services?.name && (
          <div className="bg-surface/30 p-4 rounded-2xl border border-border/50 space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#E50914] tracking-wider block">Event Package</span>
            <span className="font-extrabold text-[#252525] text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              {review.event_services.name}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
