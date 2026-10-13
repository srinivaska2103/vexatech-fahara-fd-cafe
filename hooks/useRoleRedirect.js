import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getRedirectUrlForRole } from '@/utils/faharaLinks';

export const useRoleRedirect = () => {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  const redirectByRole = useCallback((forceRole = null) => {
    const targetRole = forceRole || role;

    switch (targetRole) {
      case 'CAFE_OWNER':
      case 'WALKING_CAFE_OWNER':
      case 'RESTAURANT_OWNER':
        router.push('/owner/dashboard');
        break;
      case 'CUSTOMER':
      case 'EVENT_MANAGER':
      case 'ADMIN': {
        const dest = getRedirectUrlForRole(targetRole);
        if (dest.startsWith('http')) {
          window.location.href = dest;
        } else {
          router.push(dest);
        }
        break;
      }
      default:
        router.push('/owner/login');
        break;
    }
  }, [router, role]);

  return { redirectByRole };
};
