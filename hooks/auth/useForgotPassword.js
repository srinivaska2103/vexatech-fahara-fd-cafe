import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export const useForgotPassword = (onSuccessCallback) => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success('OTP sent to your email.');
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reset email.');
    },
  });
};
