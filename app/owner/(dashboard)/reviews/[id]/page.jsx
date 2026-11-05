'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReview, useReplyReview, useUpdateReply, useDeleteReply } from '@/hooks/review';
import { ReviewDetails } from '@/components/reviews/ReviewDetails';
import { CustomerReviewCard } from '@/components/reviews/CustomerReviewCard';
import { ReplyCard } from '@/components/reviews/ReplyCard';
import { ReviewReplyForm } from '@/components/reviews/ReviewReplyForm';
import { DeleteReplyDialog } from '@/components/reviews/DeleteReplyDialog';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ReviewDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data, isLoading, isError, refetch } = useReview(id);
  const { mutate: replyReview, isPending: isReplying } = useReplyReview();
  const { mutate: updateReplyMutate, isPending: isUpdating } = useUpdateReply();
  const { mutate: deleteReplyMutate, isPending: isDeleting } = useDeleteReply();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-36 bg-surface rounded-2xl mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[350px] bg-surface rounded-3xl" />
          </div>
          <div className="h-[300px] bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#252525]">
        <BackButton href="/owner/reviews" label="Back to Reviews" />
        <div className="bg-rose-500/10 text-rose-700 p-8 rounded-3xl border border-rose-500/20 text-center space-y-2">
          <p className="font-black text-lg">Review Not Found</p>
          <p className="text-xs text-text/60 max-w-md mx-auto">This review record could not be loaded or may have been removed.</p>
        </div>
      </div>
    );
  }

  const review = data.data;

  const handlePostReply = (formData) => {
    replyReview(
      { id: review.id, reply: formData.reply },
      {
        onSuccess: () => {
          toast.success('Your response has been published!');
          refetch();
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to post reply');
        }
      }
    );
  };

  const handleUpdateReply = (formData) => {
    updateReplyMutate(
      { id: review.id, reply: formData.reply },
      {
        onSuccess: () => {
          toast.success('Your response has been updated!');
          refetch();
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to update reply');
        }
      }
    );
  };

  const handleDeleteReply = () => {
    deleteReplyMutate(review.id, {
      onSuccess: () => {
        toast.success('Reply deleted');
        setIsDeleteDialogOpen(false);
        refetch();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to delete reply');
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#252525]">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/owner/reviews" label="Back to Reviews" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Content: Review Details (2/3 width) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <ReviewDetails review={review} />

          {/* Owner Response Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-[#252525] uppercase tracking-wider text-[#E50914]">
              Restaurant Owner Response
            </h3>

            {review.reply || review.owner_reply ? (
              <ReplyCard 
                reply={{
                  text: review.reply || review.owner_reply,
                  created_at: review.reply_at || review.created_at
                }}
                cafeName={review.cafes?.name || review.cafe_name}
                onUpdate={handleUpdateReply}
                onDelete={() => setIsDeleteDialogOpen(true)}
                isUpdating={isUpdating}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-text/70">
                  Respond to this customer directly. Your response will appear publicly below their review.
                </p>
                <ReviewReplyForm 
                  onSubmit={handlePostReply}
                  isSubmitting={isReplying}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar: Customer Info (1/3 width) */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <CustomerReviewCard customer={review.users} />
        </motion.div>

      </div>

      <DeleteReplyDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteReply}
        isDeleting={isDeleting}
      />
    </div>
  );
}
