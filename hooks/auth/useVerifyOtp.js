import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRoleRedirect } from '../useRoleRedirect';
import toast from 'react-hot-toast';

export const useVerifyOtp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { redirectByRole } = useRoleRedirect();

  return useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      // Assuming verify-otp returns auth data if successful
      if (data.accessToken) {
        setAuth(data.accessToken, data.refreshToken, data.user, data.role);
        toast.success('Email verified successfully');
        redirectByRole(data.role);
      } else {
        toast.success('OTP Verified. Please login.');
        window.location.href = '/owner/login'; // Or router.push('/owner/login')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid OTP.');
    },
  });
};
