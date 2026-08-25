import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import toast from 'react-hot-toast';

export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params),
  });
};

export const useReview = (id) => {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewService.getReviewById(id),
    enabled: !!id,
  });
};

export const useReplyReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => reviewService.replyToReview(id, data),
    onSuccess: (_, variables) => {
      toast.success('Reply posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['review', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to post reply.');
    },
  });
};

export const useUpdateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => reviewService.updateReply(id, data),
    onSuccess: (_, variables) => {
      toast.success('Reply updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['review', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update reply.');
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => reviewService.deleteReply(id),
    onSuccess: (_, id) => {
      toast.success('Reply deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete reply.');
    },
  });
};

export const useReviewAnalytics = () => {
  return useQuery({
    queryKey: ['reviewAnalytics'],
    queryFn: () => reviewService.getReviewAnalytics(),
  });
};

export const useRatingSummary = () => {
  return useQuery({
    queryKey: ['ratingSummary'],
    queryFn: () => reviewService.getRatingSummary(),
  });
};
