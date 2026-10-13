// Centralized Endpoint Definitions for Fahara Application

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
  },
  users: {
    me: '/users/me',
    onboardingStatus: '/users/onboarding-status',
  },
  subscriptions: {
    status: '/subscriptions/status',
    plans: '/subscriptions/plans',
    create: '/subscriptions/create',
    verify: '/subscriptions/verify',
    cancel: '/subscriptions/cancel',
    reactivate: '/subscriptions/reactivate',
  },

  cafes: {
    list: '/cafes',
    detail: (id) => `/cafes/${id}`,
    create: '/cafes',
    update: (id) => `/cafes/${id}`,
  },
  events: {
    list: '/event-packages',
    detail: (id) => `/event-packages/${id}`,
    create: '/event-packages',
    update: (id) => `/event-packages/${id}`,
    delete: (id) => `/event-packages/${id}`,
  },
  bookings: {
    list: '/bookings',
    detail: (id) => `/bookings/${id}`,
    updateStatus: (id) => `/bookings/${id}/status`,
  },
  tables: {
    list: '/tables',
    create: '/tables',
    detail: (id) => `/tables/${id}`,
    update: (id) => `/tables/${id}`,
    delete: (id) => `/tables/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    events: '/analytics/events',
    bookings: '/analytics/bookings',
    customers: '/analytics/customers',
    revenue: '/analytics/revenue',
  },
  notifications: {
    list: '/notifications',
    detail: (id) => `/notifications/${id}`,
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
    send: '/notifications/send',
    templates: '/notifications/templates',
    preferences: '/notifications/preferences',
    stats: '/notifications/stats',
  },
  payments: {
    list: '/payments',
    detail: (id) => `/payments/${id}`,
    settlements: '/payments/settlements',
    refunds: '/payments/refunds',
    account: '/payments/account',
    payouts: '/payments/payouts',
  },
  reviews: {
    list: '/reviews',
    detail: (id) => `/reviews/${id}`,
    reply: (id) => `/reviews/${id}/reply`,
    analytics: '/reviews/analytics',
  },
  customers: {
    list: '/customers',
    detail: (id) => `/customers/${id}`,
    analytics: '/customers/analytics',
  },
  settings: {
    get: '/settings',
    update: '/settings',
  },
};
