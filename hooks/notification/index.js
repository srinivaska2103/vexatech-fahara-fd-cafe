import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import toast from 'react-hot-toast';

export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useNotification = (id) => {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getNotificationById(id),
    enabled: !!id,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification', id] });
    }
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Failed to mark notifications as read');
    }
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success('Notification deleted');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Failed to delete notification');
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => notificationService.sendMessage(data),
    onSuccess: () => {
      toast.success('Message sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    }
  });
};

export const useNotificationTemplates = (channel) => {
  return useQuery({
    queryKey: ['notificationTemplates', channel],
    queryFn: () => notificationService.getTemplates(channel),
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: () => notificationService.getPreferences(),
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => notificationService.updatePreferences(data),
    onSuccess: () => {
      toast.success('Preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
    onError: () => {
      toast.error('Failed to update preferences');
    }
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notificationStats'],
    queryFn: () => notificationService.getStats(),
  });
};
