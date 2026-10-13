'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionStore } from '@/store/subscription.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { OwnerOnboardingTour } from '@/components/onboarding/OwnerOnboardingTour';
import { LiveNotificationListener } from '@/components/notifications/LiveNotificationListener';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/Button';
import { 
  Loader2, 
  Coffee, 
  Sparkles, 
  Store, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Armchair, 
  CalendarDays, 
  Megaphone, 
  BarChart3, 
  CreditCard 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isMounted, setIsMounted] = useState(false);

  const { 
    subscription,
    status: subStatus,
    isActive: isSubActive, 
    isLoading: isSubLoading, 
    hasFetched,
    error: subError,
    fetchSubscription,
    createSubscription, 
    verifySubscription 
  } = useSubscriptionStore();

  const user = useAuthStore((state) => state.user);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated, fetchSubscription]);

  useEffect(() => {
    if (isMounted && hasHydrated) {
      if (!isAuthenticated) {
        router.push('/owner/login');
      } else if (role !== 'CAFE_OWNER' && role !== 'WALKING_CAFE_OWNER' && role !== 'RESTAURANT_OWNER' && role !== 'ADMIN') {
        router.push('/owner/login'); 
      }
    }
  }, [isAuthenticated, role, router, isMounted, hasHydrated]);

  // Determine if current path requires active subscription
  // Inactive partners must still have access to subscription, profile, payment status, support and logout
  const openPaths = [
    '/owner/subscription', 
    '/owner/support',
    '/owner/settings/profile',
    '/owner/payments/account',
    '/owner/settings/security'
  ];
  const isProtectedPath = !openPaths.some(p => pathname.startsWith(p));


  // Determine subscription states strictly:
  // 1. Loading state (Never treat loading as inactive, but allow open paths like /owner/subscription to render immediately)
  const isCheckingSubscription = isProtectedPath && (!isMounted || !hasHydrated || isSubLoading || (!hasFetched && subStatus === 'LOADING'));

  // 2. Active state
  const isSubscriptionActive = isSubActive || subStatus === 'ACTIVE';

  // 3. Locked state (ONLY when backend confirmed inactive after loading)
  const showLockedState = isProtectedPath && !isSubscriptionActive && hasFetched && !isSubLoading && !subError;

  // 4. Server/Verification Error state (Do NOT show locked screen on 500 error)
  const showServerErrorState = isProtectedPath && !isSubscriptionActive && hasFetched && !isSubLoading && !!subError;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDirectSubscribe = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError('Razorpay SDK failed to load. Please check connection.');
        setCheckoutLoading(false);
        return;
      }

      const orderData = await createSubscription();
      if (orderData?.alreadyActive) {
        await fetchSubscription(true);
        setCheckoutLoading(false);
        return;
      }

      const resolvedAmount = orderData.amount || (role === 'RESTAURANT_OWNER' ? 149 : 299);
      const options = {
        key: orderData.razorpayKeyId,
        amount: Math.round(resolvedAmount * 100),
        currency: orderData.currency || 'INR',
        name: 'Fahara Partner',
        description: `${orderData.planName || 'Fahara Partner'} Monthly Subscription ₹${resolvedAmount}/month`,
        image: '/logo.jpeg',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },

        theme: {
          color: '#6F4E37'
        },
        handler: async function (response) {
          try {
            await verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });
            await fetchSubscription(true);
          } catch (err) {
            setCheckoutError(err.response?.data?.message || 'Payment verification failed.');
          } finally {
            setCheckoutLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
          }
        }
      };

      if (orderData.orderId) {
        options.order_id = orderData.orderId;
      } else if (orderData.subscriptionId) {
        options.subscription_id = orderData.subscriptionId;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.response?.data?.message || 'Failed to start payment checkout.');
      setCheckoutLoading(false);
    }
  };

  const isRestaurantOwner = role === 'RESTAURANT_OWNER' || String(role).toUpperCase().includes('RESTAURANT');

  const faharaFeatures = [
    {
      title: 'Table Seating & Reservation Engine',
      description: 'Interactive floor maps, live table reservation locks, and walk-in capacity management.',
      icon: Armchair,
      color: 'text-amber-700',
      bg: 'bg-amber-100/80',
      border: 'border-amber-200'
    },
    {
      title: 'Cafe & Restaurant Management',
      description: 'Showcase your venue profile, digital menu, operating hours, and photo gallery.',
      icon: Store,
      color: 'text-indigo-700',
      bg: 'bg-indigo-100/80',
      border: 'border-indigo-200'
    },
    ...(!isRestaurantOwner ? [{
      title: 'Event Packages & Party Bookings',
      description: 'Offer custom event packages for birthdays, anniversaries, corporate parties, and celebrations.',
      icon: CalendarDays,
      color: 'text-cyan-700',
      bg: 'bg-cyan-100/80',
      border: 'border-cyan-200'
    }] : []),
    {
      title: 'Marketing Campaigns & Deals',
      description: 'Run targeted promotional offers, discount campaigns, and boost customer retention.',
      icon: Megaphone,
      color: 'text-fuchsia-700',
      bg: 'bg-fuchsia-100/80',
      border: 'border-fuchsia-200'
    },
    {
      title: 'Customer Analytics & Review Insights',
      description: 'Monitor visitor trends, peak dining hours, track customer ratings and review replies.',
      icon: BarChart3,
      color: 'text-purple-700',
      bg: 'bg-purple-100/80',
      border: 'border-purple-200'
    },
    {
      title: 'Automated Payments & Settlements',
      description: 'Track earnings, automated vendor payout splits, refund requests, and financial receipts.',
      icon: CreditCard,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100/80',
      border: 'border-emerald-200'
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-text">
      <Sidebar />
      <MobileSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20 lg:pb-0 relative">
          
          {/* STATE 1: LOADING STATE (While verifying subscription on page refresh) */}
          {isCheckingSubscription ? (
            <div className="flex flex-col items-center justify-center min-h-[65vh] p-8 text-center text-[#2C1810]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#DDB892] flex items-center justify-center mb-3.5 shadow-2xs">
                <Loader2 className="w-6 h-6 animate-spin text-[#6F4E37]" />
              </div>
              <h3 className="text-sm font-extrabold text-[#2C1810]">Loading your partner account...</h3>
              <p className="text-xs text-[#6F4E37] font-medium mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6F4E37] animate-ping" />
                <span>Checking subscription access...</span>
              </p>
            </div>
          ) : showServerErrorState ? (
            /* STATE 2: SERVER / VERIFICATION ERROR STATE (500 or Network Error) */
            <div className="flex flex-col items-center justify-center min-h-[65vh] p-8 text-center text-[#2C1810] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-2xs">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-base font-black text-[#2C1810]">Unable to verify your partner subscription</h3>
              <p className="text-xs text-stone-500 max-w-sm text-center leading-relaxed font-medium">
                {subError || "A server or network error occurred while checking your subscription access."}
              </p>
              <Button 
                onClick={() => fetchSubscription(true)} 
                className="py-2 px-5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white font-bold text-xs shadow-2xs"
              >
                Retry Verification
              </Button>
            </div>
          ) : showLockedState ? (
            /* STATE 3: CONFIRMED INACTIVE SUBSCRIPTION LOCK SCREEN */
            <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
              
              {/* Hero Banner */}
              <div className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FAF0E6] to-[#F5E6D3] text-[#2C1810] p-8 sm:p-10 rounded-3xl shadow-xl overflow-hidden border border-[#DDB892]/80">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#6F4E37]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-black uppercase tracking-wider border border-[#6F4E37]/20 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <Lock className="w-3.5 h-3.5" />
                      {role === 'EVENT_MANAGER' ? 'FAHARA EVENT PARTNER • INSTANT UNLOCK' : 'FAHARA PARTNER SUITE • INSTANT UNLOCK'}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#2C1810]">
                      Empower Your Business with <span className="text-[#6F4E37]">{role === 'EVENT_MANAGER' ? 'Fahara Event Partner' : (isRestaurantOwner ? 'Fahara Restaurant Partner' : 'Fahara Cafe Partner')}</span>
                    </h1>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
                      {role === 'EVENT_MANAGER'
                        ? 'Unlock event packages, inclusions, client bookings, calendar availability, gallery showcase, reviews, and event business analytics.'
                        : (isRestaurantOwner 
                            ? 'Unlock live dining table reservations, interactive floor map seating, digital menu management, promotional campaigns, customer analytics, and automated payouts.'
                            : 'Unlock live dining table reservations, interactive floor map seating, custom event booking packages, promotional campaigns, customer analytics, and automated payouts.')}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 font-bold pt-1">
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click Instant Activation</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Gateway</span>
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-600" /> All Modules Included</span>
                    </div>
                  </div>

                    {/* Price Action Card */}
                    <div className="w-full lg:w-80 bg-white/90 backdrop-blur-xl border border-[#DDB892]/80 hover:border-[#6F4E37]/50 p-6 rounded-3xl shrink-0 text-center space-y-4 shadow-xl transition-all">
                      <div className="space-y-1">
                        <span className="text-stone-500 text-[11px] font-black uppercase tracking-widest block">Partner Membership</span>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-[#6F4E37] tracking-tight">{role === 'RESTAURANT_OWNER' ? '₹149' : '₹299'}</span>
                          <span className="text-xs font-bold text-stone-500"> / month</span>
                        </div>
                        <p className="text-[10px] text-stone-400">Monthly recurring partner membership</p>
                      </div>

                      <button
                        onClick={handleDirectSubscribe}
                        disabled={checkoutLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#593E2B] to-[#452718] hover:from-[#593E2B] hover:to-[#2C1810] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#6F4E37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Initializing Payment...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                            <span>Subscribe Now for {role === 'RESTAURANT_OWNER' ? '₹149' : '₹299'}/month</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>


              {checkoutError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Feature Highlights Grid */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#2C1810]">Everything included in Fahara Partner</h2>
                    <p className="text-xs text-stone-500 font-medium">Complete toolkit designed to maximize venue bookings and revenue</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#6F4E37] text-xs font-black border border-[#DDB892]/60 w-fit">
                    {faharaFeatures.length} {isRestaurantOwner ? 'Restaurant Modules' : 'Enterprise Modules'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faharaFeatures.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div 
                        key={idx} 
                        className="p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-amber-500/50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} border ${feat.border} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform`}>
                              <IconComp className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-stone-100 text-stone-600">
                              Module 0{idx + 1}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-snug">
                            {feat.title}
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed font-medium">
                            {feat.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-extrabold text-emerald-700">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Full Access Unlocked
                          </span>
                          <span className="text-[#6F4E37] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Footer Banner */}
              <div className="bg-gradient-to-r from-[#FAF0E6] via-[#FFF5EA] to-[#FAF0E6] border border-[#DDB892]/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-lg font-black text-[#2C1810]">Ready to transform your venue management?</h4>
                  <p className="text-xs text-stone-600 font-medium">Instant 1-click subscription for {role === 'RESTAURANT_OWNER' ? '₹149' : '₹299'}/month. Cancel renewal anytime.</p>
                </div>

                <button
                  onClick={handleDirectSubscribe}
                  disabled={checkoutLoading}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#4A3225] to-[#2C1810] hover:from-[#4A3225] hover:to-[#1A0F0A] text-white text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Subscribe Now for {role === 'RESTAURANT_OWNER' ? '₹149' : '₹299'}/month</span>
                </button>
              </div>


            </div>
          ) : (
            /* STATE 4: CONFIRMED ACTIVE SUBSCRIPTION OR OPEN PATH (Render Portal) */
            children
          )}

        </main>
      </div>
      <MobileBottomNav />
      <LiveNotificationListener />
      <OwnerOnboardingTour />
    </div>
  );
}
