import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export const useRegister = (onSuccessCallback) => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success('Registration successful. Please verify your email.');
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed.');
    },
  });
};
