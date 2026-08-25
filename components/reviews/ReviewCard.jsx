import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { ReviewImages } from './ReviewImages';
import { motion } from 'framer-motion';

export const ReviewCard = ({ review, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => onClick(review.id)}
      className="bg-white p-6 rounded-3xl border border-border shadow-sm cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {review.customer_avatar ? (
            <img src={review.customer_avatar} alt={review.customer_name} className="w-12 h-12 rounded-full object-cover border border-primary/20" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {review.customer_name?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-text">{review.customer_name || 'Anonymous Customer'}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-surface'}`} />
                ))}
              </div>
              <span className="text-xs text-text/50">&bull; {new Date(review.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <ReviewStatusBadge hasReplied={!!review.reply} />
      </div>

      <div className="mb-4">
        <p className="text-sm text-text/80 line-clamp-3">
          {review.review || <span className="italic opacity-50">No text provided with this rating.</span>}
        </p>
        <ReviewImages images={review.images} />
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="flex flex-col">
           <span className="text-xs text-text/50 uppercase font-medium tracking-wider mb-1">Reviewed For</span>
           <span className="text-sm font-medium text-text">{review.cafe_name || 'Cafe'}</span>
        </div>
        {!review.reply && (
          <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
             <MessageSquare className="w-4 h-4" />
             Reply
          </div>
        )}
      </div>
    </motion.div>
  );
};
