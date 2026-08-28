import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import toast from 'react-hot-toast';

export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentService.getPayments(params),
  });
};

export const usePayment = (id) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });
};

export const usePaymentAccount = () => {
  return useQuery({
    queryKey: ['payment-account'],
    queryFn: () => paymentService.getPaymentAccount(),
  });
};

export const useUpdatePaymentAccount = () => {
  return useMutation({
    mutationFn: (data) => paymentService.updatePaymentAccount(data),
  });
};

export const useSettlements = (params = {}) => {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => paymentService.getSettlements(params),
  });
};

export const useSyncSettlements = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => paymentService.syncSettlements(params),
    onSuccess: (data) => {
      toast.success(data?.message || 'Razorpay settlements synced successfully');
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to sync Razorpay settlements');
    }
  });
};

export const useSettlement = (id) => {
  return useQuery({
    queryKey: ['settlement', id],
    queryFn: () => paymentService.getSettlementById(id),
    enabled: !!id,
  });
};

export const useInvoices = (params = {}) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => paymentService.getInvoices(params),
  });
};

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (id) => paymentService.downloadInvoice(id),
    onSuccess: (data) => {
      toast.success('Invoice download started');
      try {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invoice.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch(err) {
        toast.error('Failed to download invoice.');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to download invoice');
    }
  });
};

export const useRefunds = (params = {}) => {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: () => paymentService.getRefunds(params),
  });
};

export const usePayouts = (params = {}) => {
  return useQuery({
    queryKey: ['payouts', params],
    queryFn: () => paymentService.getPayoutHistory(params),
  });
};

export const useRevenueSummary = (params = {}) => {
  return useQuery({
    queryKey: ['revenue', params],
    queryFn: () => paymentService.getRevenueSummary(params),
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: (data) => paymentService.exportReport(data),
    onSuccess: (data) => {
      toast.success('Report generation started. It will download shortly.');
      try {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'financial_report.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch(err) {
        toast.error('Failed to download the file.');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to export report');
    }
  });
};
