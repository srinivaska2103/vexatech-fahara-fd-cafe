import React from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CustomerReviews = ({ reviews }) => {
  const router = useRouter();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface/30 rounded-3xl border border-border/50 border-dashed">
        <Star className="w-10 h-10 text-text/20 mb-3" />
        <p className="text-text/60 font-medium">No reviews submitted</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          onClick={() => router.push(`/owner/reviews/${review.id}`)}
          className="bg-white p-5 rounded-2xl border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-surface'}`} />
              ))}
            </div>
            <span className="text-xs text-text/50">{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          
          <p className="text-sm text-text/80 line-clamp-3 mb-4">
            {review.review || <span className="italic opacity-50">No text provided.</span>}
          </p>
          
          <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
             <span className="font-medium text-primary">{review.cafe_name || 'Cafe'}</span>
             {review.reply ? (
               <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Replied</span>
             ) : (
               <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Needs Reply</span>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};
