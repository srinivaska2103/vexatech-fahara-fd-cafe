'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReview, useReplyReview, useUpdateReply, useDeleteReply } from '@/hooks/review';
import { ReviewDetails } from '@/components/reviews/ReviewDetails';
import { CustomerReviewCard } from '@/components/reviews/CustomerReviewCard';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { motion } from 'framer-motion';

export default function ReviewDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data, isLoading, isError } = useReview(id);

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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
        <BackButton href="/owner/reviews" label="Back to Reviews" />
        <div className="bg-rose-500/10 text-rose-700 p-8 rounded-3xl border border-rose-500/20 text-center space-y-2">
          <p className="font-black text-lg">Review Not Found</p>
          <p className="text-xs text-text/60 max-w-md mx-auto">This review record could not be loaded or may have been removed.</p>
        </div>
      </div>
    );
  }

  const review = data.data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
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
    </div>
  );
}
