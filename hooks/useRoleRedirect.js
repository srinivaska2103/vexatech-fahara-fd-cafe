import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useRoleRedirect = () => {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  const redirectByRole = useCallback((forceRole = null) => {
    const targetRole = forceRole || role;

    switch (targetRole) {
      case 'CUSTOMER':
        router.push('/customer/dashboard');
        break;
      case 'CAFE_OWNER':
        router.push('/owner/cafes');
        break;
      case 'EVENT_MANAGER':
        router.push('/event/dashboard');
        break;
      case 'ADMIN':
        router.push('/admin/dashboard');
        break;
      default:
        // Fallback or unauthorized handling
        break;
    }
  }, [router, role]);

  return { redirectByRole };
};
