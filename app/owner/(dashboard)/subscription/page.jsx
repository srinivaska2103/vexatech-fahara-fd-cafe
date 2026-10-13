'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';
import { 
  Check, ShieldCheck, Sparkles, AlertTriangle, Calendar, CreditCard, RefreshCw, Lock, 
  Copy, ExternalLink, ArrowRight, Utensils, CalendarDays, Megaphone, BarChart3, 
  Layers, Receipt, CheckCircle2, Zap, Award, Coffee, Briefcase, HelpCircle, Info
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { 
    subscription, 
    plans,
    status, 
    isActive, 
    isLoading, 
    error, 
    fetchSubscription, 
    fetchPlans,
    createSubscription, 
    verifySubscription, 
    cancelSubscription,
    reactivateSubscription
  } = useSubscriptionStore();
  
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || user?.roles?.name || 'CAFE_OWNER';

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (typeof fetchSubscription === 'function') {
      fetchSubscription(true);
    }
    if (typeof fetchPlans === 'function') {
      fetchPlans();
    }
  }, [user?.id, fetchSubscription, fetchPlans]);


  // Determine authenticated partner type
  const isRestaurantOwner = userRole === 'RESTAURANT_OWNER' || String(userRole).toUpperCase().includes('RESTAURANT');
  const isEventManager = userRole === 'EVENT_MANAGER' || String(userRole).toUpperCase().includes('EVENT');
  const isCafeOwner = !isRestaurantOwner && !isEventManager;

  const currentRole = isEventManager ? 'EVENT_MANAGER' : (isRestaurantOwner ? 'RESTAURANT_OWNER' : 'CAFE_OWNER');
  const currentPartnerLabel = isEventManager ? 'Event Manager' : (isRestaurantOwner ? 'Restaurant Owner' : 'Cafe Owner');
  const currentPlanPrice = isRestaurantOwner ? 149 : 299;

  // Plan metadata with accurate features matching application capability
  const allPlans = useMemo(() => [
    {
      id: 'cafe-plan',
      role: 'CAFE_OWNER',
      title: 'Cafe Owner',
      price: 299,
      billingCycle: 'MONTHLY',
      tagline: 'Take bookings, showcase custom event packages & grow cafe footfall.',
      icon: Coffee,
      badge: 'Popular for Cafes',
      features: [
        'Business profile and location',
        'Photos and gallery',
        'Customer discovery',
        'Booking and availability management',
        'Custom event packages and inclusions',
        'Deals and offers',
        'Reviews and ratings',
        'Business analytics'
      ]
    },
    {
      id: 'restaurant-plan',
      role: 'RESTAURANT_OWNER',
      title: 'Restaurant Owner',
      price: 149,
      billingCycle: 'MONTHLY',
      tagline: 'Connect with diners and manage tables, digital menu & reservations.',
      icon: Utensils,
      badge: 'Best for Dining',
      features: [
        'Restaurant profile and location',
        'Photos and business information',
        'Customer discovery',
        'Menu display',
        'Booking management',
        'Offers and promotions',
        'Reviews and ratings',
        'Business insights'
      ]
    },
    {
      id: 'event-manager-plan',
      role: 'EVENT_MANAGER',
      title: 'Event Manager',
      price: 299,
      billingCycle: 'MONTHLY',
      tagline: 'Receive party bookings, manage custom services & client inquiries.',
      icon: CalendarDays,
      badge: 'Full Event Suite',
      features: [
        'Event Manager profile',
        'Custom event services',
        'User-created packages and inclusions',
        'Service pricing and availability',
        'Customer enquiries and bookings',
        'Reviews and ratings',
        'Business insights'
      ]
    }
  ], []);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleSubscribe = async () => {
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setMsg({ type: 'error', text: 'Razorpay SDK failed to load. Please check your network connection.' });
        setSubmitting(false);
        return;
      }

      const orderData = await createSubscription();
      if (orderData?.alreadyActive) {
        setMsg({ type: 'success', text: 'You already have an active subscription!' });
        await fetchSubscription(true);
        setSubmitting(false);
        return;
      }

      const resolvedAmount = orderData.amount || currentPlanPrice;
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
            setMsg({ type: 'success', text: 'Subscription activated successfully! Welcome to Fahara Partner.' });
            await fetchSubscription(true);
          } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Subscription payment verification failed.' });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
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
      console.error('Subscription error:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to initialize subscription checkout.' });
      setSubmitting(false);
    }
  };

  const confirmCancelRenewal = async () => {
    setShowCancelModal(false);
    setSubmitting(true);
    try {
      await cancelSubscription();
      setMsg({ type: 'success', text: 'Subscription auto-renewal has been cancelled. Your dashboard remains unlocked until the billing period ends.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel renewal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactivateRenewal = async () => {
    setSubmitting(true);
    setMsg(null);
    try {
      if (typeof reactivateSubscription === 'function') {
        await reactivateSubscription();
      } else {
        await subscriptionService.reactivate();
        await fetchSubscription(true);
      }
      setMsg({ type: 'success', text: 'Auto-renewal has been successfully turned back on! Your subscription will continue seamlessly.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reactivate auto-renewal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const unlockedModules = [
    { 
      title: isRestaurantOwner ? 'Restaurant Profile & Menu' : 'Business Profile & Media', 
      desc: isRestaurantOwner ? 'Showcase dining profile, digital menu cards, photos & operating hours' : 'Manage photos, descriptions & business location details', 
      href: '/owner/settings/profile', 
      icon: Utensils, 
      badge: isRestaurantOwner ? 'Digital Menu' : 'Live Profile' 
    },
    { 
      title: isRestaurantOwner ? 'Dining Table Seating & Layout' : 'Floor & Table Seating', 
      desc: isRestaurantOwner ? 'Live guest table reservations, floor plans & dining capacity manager' : 'Real-time reservation manager & dining capacity controls', 
      href: '/owner/tables', 
      icon: Layers, 
      badge: 'Seating' 
    },
    ...(!isRestaurantOwner ? [{ 
      title: 'Event Packages & Inclusions', 
      desc: 'Configure custom celebration packages and inclusions', 
      href: '/owner/events', 
      icon: CalendarDays, 
      badge: 'Packages' 
    }] : []),
    { 
      title: isRestaurantOwner ? 'Promotional Offers & Dining Deals' : 'Promotional Campaigns', 
      desc: isRestaurantOwner ? 'Launch restaurant promo codes, weekend dining deals & customer discounts' : 'Launch targeted promo codes & customer discount deals', 
      href: '/owner/campaigns', 
      icon: Megaphone, 
      badge: 'Growth' 
    },
    { 
      title: isRestaurantOwner ? 'Dining Analytics & Customer Insights' : 'Business Analytics', 
      desc: isRestaurantOwner ? 'Monitor peak dining hours, recurring guests, footfall & diner trends' : 'Insights into footfall, recurring diners & visitor trends', 
      href: '/owner/analytics', 
      icon: BarChart3, 
      badge: 'Insights' 
    },
    { 
      title: 'Settlements & Payouts', 
      desc: 'Transparent Razorpay settlement logs, customer refunds & payout history', 
      href: '/owner/payments/settlements', 
      icon: Receipt, 
      badge: 'Finance Hub' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8 text-[#2C1810]">
      {/* 1. Header Banner adhering to Fahara Theme (#6F4E37, #A67B5B, #DDB892, #FFF8F0, #2C1810) */}
      <div className="relative bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#F5E6D3] text-[#2C1810] p-6 sm:p-10 rounded-3xl shadow-md border border-[#E8DED5] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A67B5B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#6F4E37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-black uppercase tracking-wider border border-[#6F4E37]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Fahara Partner Subscription</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#2C1810] leading-tight">
                Grow Your Business With Fahara
              </h1>
              <p className="text-[#6F4E37]/90 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Discover Fahara's partner tools and activate your subscription to access your business dashboard.
              </p>
            </div>

            {isActive && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Status</span>
                  <span className="text-xs font-black text-emerald-950 tracking-wide">ACTIVE & VERIFIED</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Inactive Notice Banner when subscription not active */}
      {!isActive && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0 border border-[#DDB892]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">
                {status === 'EXPIRED' ? 'Subscription Expired' : (status === 'CANCELLED' ? 'Subscription Cancelled' : 'Active Subscription Required')}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                {isRestaurantOwner 
                  ? 'An active subscription is required to unlock your restaurant dashboard, live table seating, dining reservation calendar, and promotions.'
                  : 'An active subscription is required to unlock your partner dashboard, live booking calendar, and venue management tools. Your business profile, packages, and historical records remain fully preserved.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
            <span>{status === 'EXPIRED' ? `Renew for ₹${currentPlanPrice}/month` : `Subscribe for ₹${currentPlanPrice}/month`}</span>
          </button>
        </div>
      )}

      {/* 2. Active Subscription Details View */}
      {isActive && subscription && (
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED5]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-300">
                  Active Subscription
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] text-[11px] font-bold border border-[#DDB892]">
                  {currentPartnerLabel}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
                {subscription.planName || `${currentPartnerLabel} Plan`}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Recurring monthly partner subscription
              </p>
            </div>

            <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#E8DED5] text-right min-w-[140px]">
              <div className="text-2xl sm:text-3xl font-black text-[#6F4E37]">
                ₹{subscription.price || currentPlanPrice}
                <span className="text-xs font-bold text-stone-500"> / month</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                {subscription.cancelAtPeriodEnd ? 'Cancels at Period End' : 'Renews Monthly'}
              </span>
            </div>
          </div>

          {/* Billing Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Status</span>
              <span className="text-xs sm:text-sm font-black text-emerald-800 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {subscription.status}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Current Period Start</span>
              <span className="text-xs sm:text-sm font-black text-[#2C1810] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                {subscription.currentPeriodStart ? format(new Date(subscription.currentPeriodStart), 'dd MMM yyyy') : 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">
                {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#2C1810] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A67B5B]" />
                {subscription.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), 'dd MMM yyyy') : 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Payment Reference</span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black text-stone-700 truncate max-w-[130px]">
                  {subscription.razorpaySubscriptionId || 'Direct'}
                </span>
                {subscription.razorpaySubscriptionId && (
                  <button 
                    onClick={() => copyToClipboard(subscription.razorpaySubscriptionId)}
                    className="p-1 text-stone-400 hover:text-[#6F4E37] cursor-pointer"
                    title="Copy ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation Notice & Controls */}
          <div className="pt-4 border-t border-[#E8DED5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {subscription.cancelAtPeriodEnd 
                  ? 'Auto-renewal is cancelled. Access will remain active until the billing period ends.' 
                  : 'Recurring monthly subscription managed securely via Razorpay. You can cancel auto-renewal anytime.'}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivateRenewal}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black shadow-sm hover:shadow transition-all cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Renewing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Renew Auto-Renewal</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Cancel Auto-Renewal
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Partner Subscription Plan (Hidden when subscription is active, or for restaurant owners) */}
      {!isActive && !isRestaurantOwner && (
        <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#2C1810]">Subscription Plan</h2>
            <p className="text-xs text-stone-500 font-medium">
              Monthly partner subscription tailored for your verified {currentPartnerLabel} account.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[11px] font-bold text-[#6F4E37] w-fit">
            <Info className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Your Account: <strong className="font-black">{currentPartnerLabel}</strong></span>
          </div>
        </div>

        {/* Single Plan Card or Applicable Plan */}
        <div className="max-w-xl mx-auto">
          {allPlans
            .filter((plan) => plan.role === currentRole)
            .map((plan) => {
              const isUserPlan = true;
              const PlanIcon = plan.icon;

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                  isUserPlan 
                    ? 'bg-white border-2 border-[#6F4E37] shadow-lg ring-4 ring-[#6F4E37]/10' 
                    : 'bg-white/80 border border-[#E8DED5] opacity-85 hover:opacity-100 shadow-xs'
                }`}
              >
                {/* Highlight Badge */}
                {isUserPlan && (
                  <div className="absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full bg-[#6F4E37] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#DDB892]" />
                    <span>Your Plan</span>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 pt-1">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] text-[#6F4E37] flex items-center justify-center shrink-0">
                        <PlanIcon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <h3 className="text-lg font-black text-[#2C1810] pt-2">{plan.title}</h3>
                      <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-[#FFF8F0] text-[#6F4E37] text-[10px] font-bold border border-[#E8DED5] shrink-0">
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5]/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#6F4E37]">₹{plan.price}</span>
                      <span className="text-xs font-bold text-stone-500"> / month</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
                      Recurring monthly billing • No hidden fees
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#6F4E37] block">
                      Included Features:
                    </span>
                    <ul className="space-y-2 text-xs text-stone-700">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#6F4E37] shrink-0 mt-0.5 stroke-[3]" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-6 mt-6 border-t border-[#E8DED5]">
                  {isUserPlan ? (
                    isActive ? (
                      <div className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Currently Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSubscribe}
                        disabled={submitting}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{status === 'EXPIRED' ? `Renew Subscription (₹${plan.price}/mo)` : `Subscribe Now (₹${plan.price}/mo)`}</span>
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      title="Partner type is assigned by your verified account role"
                      className="w-full py-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-bold text-center cursor-not-allowed border border-stone-200"
                    >
                      Different Partner Role
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* 4. Partner Dashboard Modules & Capabilities */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#2C1810]">
              {isActive ? 'Your Unlocked Partner Tools' : (isRestaurantOwner ? 'Restaurant Partner Modules & Features' : 'Cafe Partner Modules & Features')}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {isActive 
                ? 'Launch operational and business tools enabled by your active subscription.' 
                : (isRestaurantOwner 
                    ? 'Explore restaurant management tools, digital dining menus, table reservations, and marketing campaigns included in your plan.'
                    : 'Explore venue management tools, live table reservations, custom event packages, and marketing campaigns included in your plan.')}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[11px] font-bold text-[#6F4E37] w-fit">
            <Info className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Account: <strong className="font-black">{currentPartnerLabel}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {unlockedModules.map((mod, mIdx) => {
            const ModIcon = mod.icon;
            const CardContent = (
              <div className="p-6 rounded-3xl bg-white border border-[#E8DED5] hover:border-[#6F4E37]/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group space-y-4 h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center border border-[#E8DED5] group-hover:scale-105 group-hover:bg-[#6F4E37] group-hover:text-white transition-all duration-300">
                      <ModIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892] uppercase tracking-wider">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DED5]/70 flex items-center justify-between text-xs font-bold text-[#6F4E37]">
                  <span>{isActive ? 'Open Module' : 'Included in Plan'}</span>
                  {isActive ? (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
              </div>
            );

            return isActive ? (
              <Link key={mIdx} href={mod.href} className="block h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={mIdx} className="h-full">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E8DED5] space-y-5 text-[#2C1810]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#2C1810]">Cancel Auto-Renewal?</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your partner dashboard will stay unlocked until your paid period ends. You won't be charged for next month.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#E8DED5] text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 text-[#6F4E37] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Business data stays safe</span>
              </div>
              <p className="text-[11px] text-stone-500">
                All cafes, tables, packages, and bookings remain intact. You can renew whenever you're ready.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelRenewal}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                {submitting ? 'Cancelling...' : 'Confirm Cancel Renewal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
