import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cafeService } from '@/services/cafe.service';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/auth.store';

// GET ALL CAFES
export const useCafes = (params = {}, options = {}) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: ['cafes', { ...params, owner_id: user?.id }],
    queryFn: () => cafeService.getCafes({ ...params, owner_id: user?.id }),
    enabled: !!user?.id && (options.enabled !== false),
    ...options,
  });
};

// GET CAFE BY ID
export const useCafe = (id) => {
  return useQuery({
    queryKey: ['cafe', id],
    queryFn: () => cafeService.getCafeById(id),
    enabled: !!id, // Only run if ID exists
  });
};

// CREATE CAFE
export const useCreateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cafeService.createCafe,
    onSuccess: () => {
      toast.success('Cafe created successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create cafe');
    },
  });
};

// UPDATE CAFE
export const useUpdateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => cafeService.updateCafe(id, data),
    onSuccess: (data, variables) => {
      toast.success('Cafe updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update cafe');
    },
  });
};

// DELETE CAFE
export const useDeleteCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cafeService.deleteCafe,
    onSuccess: () => {
      toast.success('Cafe deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete cafe');
    },
  });
};

// UPLOAD GALLERY IMAGES
export const useUploadGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => cafeService.uploadGalleryImages(id, formData),
    onSuccess: (data, variables) => {
      toast.success('Images uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe', variables.id] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to upload images');
    },
  });
};
