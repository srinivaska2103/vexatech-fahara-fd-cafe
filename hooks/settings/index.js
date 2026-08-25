import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import toast from 'react-hot-toast';

export const useBusinessProfile = () => {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: () => settingsService.getBusinessProfile(),
  });
};

export const useUpdateBusinessProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => settingsService.updateBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings', 'profile']);
      toast.success('Business profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });
};

export const useBranches = () => {
  return useQuery({
    queryKey: ['settings', 'branches'],
    queryFn: () => settingsService.getBranches(),
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['settings', 'team'],
    queryFn: () => settingsService.getTeamMembers(),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => settingsService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    }
  });
};

export const useBookingSettings = () => {
  return useQuery({
    queryKey: ['settings', 'booking'],
    queryFn: () => settingsService.getBookingSettings(),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted successfully');
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login';
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete account');
    }
  });
};
