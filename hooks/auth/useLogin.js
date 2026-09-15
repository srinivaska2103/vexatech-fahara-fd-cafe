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
    onSuccess: (data, variables) => {
      const userRole = data?.user?.role;
      const selectedRole = variables?.expectedRole;

      // Prevent non-owners or wrong role selections from logging in
      if (
        (userRole !== 'CAFE_OWNER' && userRole !== 'RESTAURANT_OWNER' && userRole !== 'WALKING_CAFE_OWNER' && userRole !== 'ADMIN') ||
        (selectedRole && selectedRole !== 'PARTNER' && userRole !== 'ADMIN' && selectedRole !== userRole)
      ) {
        toast.error("You don't have permission to login in this portal");
        return;
      }
      
      setAuth(data.accessToken, data.refreshToken, data.user, data.user.role);
      toast.success('Successfully logged in');
      redirectByRole(data.user.role);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "You don't have permission to login in this portal");
    },
  });
};
