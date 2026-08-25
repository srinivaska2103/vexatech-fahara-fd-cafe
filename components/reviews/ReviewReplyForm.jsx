import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewReplySchema } from '@/schemas/review.schema';
import { Button } from '../ui/Button';
import { MessageSquareReply } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ReviewReplyForm = ({ defaultValues, onSubmit, isSubmitting, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reviewReplySchema),
    defaultValues: {
      reply: defaultValues?.reply || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <textarea
          {...register('reply')}
          rows={5}
          placeholder="Write your response to this customer..."
          className={cn(
            "w-full rounded-2xl border bg-white px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none shadow-sm",
            errors.reply ? "border-danger" : "border-border"
          )}
        />
        {errors.reply && <p className="mt-1.5 text-xs text-danger px-1">{errors.reply.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting} className="flex items-center gap-2">
          <MessageSquareReply className="w-4 h-4" />
          {defaultValues ? 'Update Reply' : 'Post Reply'}
        </Button>
      </div>
    </form>
  );
};
