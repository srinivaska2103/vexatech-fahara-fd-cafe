import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableService } from '@/services/table.service';
import toast from 'react-hot-toast';

// GET TABLES & CAPACITY SUMMARY FOR CAFE
export const useTables = (cafeId, options = {}) => {
  return useQuery({
    queryKey: ['cafe-tables', cafeId],
    queryFn: () => tableService.getTablesByCafe(cafeId),
    enabled: !!cafeId && options.enabled !== false,
    ...options,
  });
};

// GET NEXT TABLE NUMBER
export const useNextTableNumber = (cafeId, options = {}) => {
  return useQuery({
    queryKey: ['next-table-number', cafeId],
    queryFn: () => tableService.getNextTableNumber(cafeId),
    enabled: !!cafeId && options.enabled !== false,
    ...options,
  });
};

// CREATE TABLE
export const useCreateTable = (cafeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tableService.createTable(cafeId, data),
    onSuccess: (data) => {
      toast.success(data?.message || 'Table created successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe-tables', cafeId] });
      queryClient.invalidateQueries({ queryKey: ['next-table-number', cafeId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create table');
    },
  });
};

// UPDATE TABLE
export const useUpdateTable = (cafeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, data }) => tableService.updateTable(cafeId, tableId, data),
    onSuccess: (data) => {
      toast.success(data?.message || 'Table updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe-tables', cafeId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update table');
    },
  });
};

// UPDATE TABLE STATUS
export const useUpdateTableStatus = (cafeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, status }) => tableService.updateTableStatus(cafeId, tableId, status),
    onSuccess: (data) => {
      toast.success(data?.message || 'Table status updated!');
      queryClient.invalidateQueries({ queryKey: ['cafe-tables', cafeId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update table status');
    },
  });
};

// DELETE TABLE
export const useDeleteTable = (cafeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId) => tableService.deleteTable(cafeId, tableId),
    onSuccess: (data) => {
      toast.success(data?.message || 'Table deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe-tables', cafeId] });
      queryClient.invalidateQueries({ queryKey: ['next-table-number', cafeId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete table');
    },
  });
};

// SET TABLE COMBINATIONS
export const useSaveTableCombinations = (cafeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, combinedTableIds }) => tableService.setTableCombinations(cafeId, tableId, combinedTableIds),
    onSuccess: (data) => {
      toast.success(data?.message || 'Table combinations updated!');
      queryClient.invalidateQueries({ queryKey: ['cafe-tables', cafeId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to save combinations');
    },
  });
};

// REALTIME TABLE AVAILABILITY
export const useTableAvailability = (cafeId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['table-availability', cafeId, params],
    queryFn: () => tableService.getRealtimeTableAvailability(cafeId, params),
    enabled: !!cafeId && !!params.booking_date && !!params.start_time && !!params.end_time && options.enabled !== false,
    ...options,
  });
};
