import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import toast from 'react-hot-toast';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerBookings = (id) => {
  return useQuery({
    queryKey: ['customer-bookings', id],
    queryFn: () => customerService.getCustomerBookings(id),
    enabled: !!id,
  });
};

export const useCustomerPayments = (id) => {
  return useQuery({
    queryKey: ['customer-payments', id],
    queryFn: () => customerService.getCustomerPayments(id),
    enabled: !!id,
  });
};

export const useCustomerReviews = (id) => {
  return useQuery({
    queryKey: ['customer-reviews', id],
    queryFn: () => customerService.getCustomerReviews(id),
    enabled: !!id,
  });
};

export const useCustomerAnalytics = () => {
  return useQuery({
    queryKey: ['customerAnalytics'],
    queryFn: () => customerService.getCustomerAnalytics(),
  });
};

// Notes Mutations
export const useAddCustomerNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }) => customerService.addCustomerNote(customerId, data),
    onSuccess: (_, variables) => {
      toast.success('Note added successfully');
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add note');
    },
  });
};

export const useUpdateCustomerNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId, data }) => customerService.updateCustomerNote(customerId, noteId, data),
    onSuccess: (_, variables) => {
      toast.success('Note updated successfully');
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update note');
    },
  });
};

export const useDeleteCustomerNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId }) => customerService.deleteCustomerNote(customerId, noteId),
    onSuccess: (_, variables) => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete note');
    },
  });
};

// VIP Mutations
export const useToggleVIP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, isVip }) => 
      isVip ? customerService.removeCustomerVIP(customerId) : customerService.markCustomerVIP(customerId),
    onSuccess: (_, variables) => {
      toast.success(variables.isVip ? 'VIP status removed' : 'Marked as VIP');
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update VIP status');
    },
  });
};

// Block Mutations
export const useBlockCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }) => customerService.blockCustomer(customerId, data),
    onSuccess: (_, variables) => {
      toast.success('Customer blocked successfully');
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to block customer');
    },
  });
};

export const useUnblockCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId) => customerService.unblockCustomer(customerId),
    onSuccess: (_, customerId) => {
      toast.success('Customer unblocked successfully');
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to unblock customer');
    },
  });
};
