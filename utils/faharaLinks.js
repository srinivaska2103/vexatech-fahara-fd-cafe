// Canonical URLs for Fahara Web Platform
const IS_PROD = typeof window !== 'undefined' 
  ? !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
  : process.env.NODE_ENV === 'production';

export const USER_APP_URL = process.env.NEXT_PUBLIC_USER_URL || (IS_PROD ? 'https://fahara.in' : 'http://localhost:3001');
export const CAFE_APP_URL = process.env.NEXT_PUBLIC_CAFE_URL || (IS_PROD ? 'https://cafe.fahara.in' : 'http://localhost:3002');
export const EVENT_APP_URL = process.env.NEXT_PUBLIC_EVENT_URL || (IS_PROD ? 'https://em.fahara.in' : 'http://localhost:3004');
export const ADMIN_APP_URL = process.env.NEXT_PUBLIC_ADMIN_URL || (IS_PROD ? 'https://admin.fahara.in' : 'http://localhost:3003');

/**
 * Cross-application role redirection helper
 */
export const getRedirectUrlForRole = (role) => {
  switch (role) {
    case 'CUSTOMER':
      return `${USER_APP_URL}/customer/discover`;
    case 'CAFE_OWNER':
    case 'WALKING_CAFE_OWNER':
    case 'RESTAURANT_OWNER':
      return '/owner/dashboard';
    case 'EVENT_MANAGER':
      return `${EVENT_APP_URL}/event/dashboard`;
    case 'ADMIN':
      return `${ADMIN_APP_URL}/admin/dashboard`;
    default:
      return '/owner/login';
  }
};
