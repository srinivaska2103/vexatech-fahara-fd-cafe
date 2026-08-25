import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.');
      router.push('/owner/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    },
  });
};
