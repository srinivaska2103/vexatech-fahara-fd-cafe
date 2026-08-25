import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/event.service';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/auth.store';

// GET ALL EVENTS (PACKAGES)
export const useEvents = (params = {}) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: ['events', { ...params, owner_id: user?.id }],
    queryFn: () => eventService.getEvents({ ...params, owner_id: user?.id }),
    enabled: !!user?.id,
  });
};

// GET EVENT BY ID
export const useEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

// CREATE EVENT
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cafeId, data }) => eventService.createEvent(cafeId, data),
    onSuccess: () => {
      toast.success('Event package created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // Also invalidate cafes since events are nested inside cafes
      queryClient.invalidateQueries({ queryKey: ['cafes'] }); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create event');
    },
  });
};

// UPDATE EVENT
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eventService.updateEvent(id, data),
    onSuccess: (data, variables) => {
      toast.success('Event package updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['cafes'] }); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update event');
    },
  });
};

// DELETE EVENT
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      toast.success('Event package deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['cafes'] }); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete event');
    },
  });
};

// UPLOAD GALLERY (MOCKED)
export const useUploadGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => eventService.uploadGalleryImages(id, formData),
    onSuccess: (data, variables) => {
      toast.success('Images uploaded successfully! (Mocked)');
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
    onError: (error) => {
      toast.error('Failed to upload images');
    },
  });
};
