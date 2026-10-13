import { create } from 'zustand';
import { subscriptionService } from '@/services/subscription.service';

export const useSubscriptionStore = create((set, get) => ({
  subscription: null,
  plans: [],
  status: 'LOADING', // Three required states: 'LOADING', 'ACTIVE', 'INACTIVE'
  isActive: false,
  isLoading: true,
  hasFetched: false,
  error: null,
  currentUserId: null,

  resetSubscription: () => {
    set({
      subscription: null,
      status: 'LOADING',
      isActive: false,
      isLoading: false,
      hasFetched: false,
      error: null,
      currentUserId: null
    });
  },

  fetchPlans: async () => {
    try {
      const res = await subscriptionService.getPlans();
      const plans = res?.data || res || [];
      set({ plans });
      return plans;
    } catch (err) {
      console.warn('Fetch Plans Error:', err);
      return [];
    }
  },

  fetchSubscription: async (force = false) => {
    // Check if auth user has changed
    let authUserId = null;
    try {
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('fahara-auth-storage');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          authUserId = parsed?.state?.user?.id || null;
        }
      }
    } catch (e) {}

    const state = get();

    // If active user ID is different from cached subscription user ID, force refetch!
    const userMismatch = authUserId && state.currentUserId && authUserId !== state.currentUserId;
    const shouldForce = force || userMismatch;

    // Return cached subscription if already fetched & active unless forced or mismatched
    if (!shouldForce && state.hasFetched && state.isActive && !state.isLoading && state.currentUserId === authUserId) {
      return { subscription: state.subscription, status: state.status, isActive: state.isActive };
    }

    set({ isLoading: true, error: null, currentUserId: authUserId });
    try {
      const res = await subscriptionService.getStatus();
      const data = res?.data || res || {};
      
      const active = Boolean(data.isActive || data.status === 'ACTIVE' || data.subscription?.status === 'ACTIVE');
      const subStatus = data.status || (active ? 'ACTIVE' : 'INACTIVE');

      set({
        subscription: data.subscription || null,
        status: subStatus,
        isActive: active,
        isLoading: false,
        hasFetched: true,
        currentUserId: authUserId,
        error: null
      });
      return data;
    } catch (err) {
      console.error('Fetch Subscription Error:', err);
      const isServerError = err.response?.status >= 500 || !err.response;
      const errorMsg = err.response?.data?.message || err.message || 'Failed to verify subscription status';

      set((currentState) => {
        // If server error (500/network error), preserve last known status instead of falsely marking inactive
        if (isServerError && currentState.hasFetched) {
          return {
            isLoading: false,
            error: errorMsg,
          };
        }

        return {
          isLoading: false,
          hasFetched: true,
          status: isServerError ? currentState.status : 'INACTIVE',
          isActive: isServerError ? currentState.isActive : false,
          error: errorMsg,
        };
      });

      return { 
        isActive: get().isActive, 
        status: get().status, 
        error: errorMsg 
      };
    }
  },

  createSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await subscriptionService.create();
      set({ isLoading: false });
      return data?.data || data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create subscription';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  verifySubscription: async (paymentDetails) => {
    set({ isLoading: true, error: null });
    try {
      const res = await subscriptionService.verify(paymentDetails);
      const data = res?.data || res || {};
      
      set({
        subscription: data.subscription || { status: 'ACTIVE' },
        status: 'ACTIVE',
        isActive: true,
        isLoading: false,
        hasFetched: true,
        error: null
      });

      // Refetch to confirm backend state
      await get().fetchSubscription(true);

      return res;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Verification failed' });
      throw err;
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await subscriptionService.cancel();
      set({ isLoading: false });
      await get().fetchSubscription(true);
      return res;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Cancellation failed' });
      throw err;
    }
  },

  reactivateSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await subscriptionService.reactivate();
      set({ isLoading: false });
      await get().fetchSubscription(true);
      return res;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Reactivation failed' });
      throw err;
    }
  }
}));
