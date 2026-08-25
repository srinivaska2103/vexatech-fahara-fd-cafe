import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRoleRedirect } from '../useRoleRedirect';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { redirectByRole } = useRoleRedirect();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Prevent non-owners from logging into the Cafe portal
      if (data.user.role !== 'CAFE_OWNER' && data.user.role !== 'ADMIN') {
        toast.error('Access denied. You do not have owner permissions.');
        return;
      }
      
      // Assuming backend returns { accessToken, refreshToken, user }
      setAuth(data.accessToken, data.refreshToken, data.user, data.user.role);
      toast.success('Successfully logged in');
      redirectByRole(data.user.role);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    },
  });
};
