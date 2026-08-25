'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { useCafes } from '@/hooks/cafe';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Coffee, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Star,
  CalendarCheck,
  Zap,
  PartyPopper,
  Compass
} from 'lucide-react';
import toast from 'react-hot-toast';

// Floating Balloon Colors & Positions for Step 9 Celebration
const celebrationBalloons = [
  { color: 'from-rose-500 to-red-600', left: '10%', delay: 0, duration: 4 },
  { color: 'from-amber-400 to-orange-500', left: '25%', delay: 0.5, duration: 4.5 },
  { color: 'from-[#6F4E37] to-[#A67B5B]', left: '40%', delay: 1, duration: 3.8 },
  { color: 'from-emerald-400 to-teal-600', left: '60%', delay: 0.2, duration: 4.2 },
  { color: 'from-indigo-500 to-purple-600', left: '75%', delay: 0.7, duration: 4.8 },
  { color: 'from-pink-500 to-rose-500', left: '88%', delay: 0.4, duration: 4.1 },
];

export function OwnerOnboardingTour() {
  const router = useRouter();
  const pathname = usePathname();
  
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setOwnerOnboardingCompleted = useAuthStore((state) => state.setOwnerOnboardingCompleted);

  const [activeStep, setActiveStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch real cafe data to compute dynamic profile completion & setup status
  const { data: cafesResponse } = useCafes({}, { enabled: !!user?.id && role === 'CAFE_OWNER' });
  const cafes = cafesResponse?.data || [];
  const primaryCafe = cafes[0] || null;

  // Fire Canvas Confetti Celebration Cannon
  const triggerConfettiExplosion = useCallback(() => {
    try {
      // Main Center Pop
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#6F4E37', '#A67B5B', '#DDB892', '#10B981', '#F59E0B', '#EC4899', '#6366F1']
      });

      // Left Side Cannon Stream
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#6F4E37', '#A67B5B', '#DDB892', '#F59E0B']
        });
      }, 200);

      // Right Side Cannon Stream
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#10B981', '#EC4899', '#6366F1', '#A67B5B']
        });
      }, 400);
    } catch (e) {
      console.log('Confetti trigger fallback');
    }
  }, []);

  // Trigger celebration explosion whenever step 9 opens
  useEffect(() => {
    if (activeStep === 9 && isOpen) {
      triggerConfettiExplosion();
    }
  }, [activeStep, isOpen, triggerConfettiExplosion]);

  // Calculate dynamic cafe profile completion %
  const cafeCompletionPercentage = useMemo(() => {
    if (!primaryCafe) return 0;
    let score = 0;
    if (primaryCafe.name) score += 15;
    if (primaryCafe.address || primaryCafe.city) score += 15;
    if (primaryCafe.latitude && primaryCafe.longitude) score += 10;
    if (primaryCafe.description) score += 10;
    if (primaryCafe.price_per_hour || primaryCafe.price) score += 15;
    if (primaryCafe.minimum_persons && primaryCafe.maximum_persons) score += 10;
    if (primaryCafe.cover_image) score += 10;
    if (primaryCafe.gallery && Array.isArray(primaryCafe.gallery) && primaryCafe.gallery.length > 0) score += 10;
    if (primaryCafe.amenities) score += 5;
    return score;
  }, [primaryCafe]);

  // Determine real Bank Verification status
  const bankStatus = useMemo(() => {
    if (!primaryCafe) return 'Not Added';
    const status = primaryCafe.bank_verification_status || primaryCafe.cashfree_vendor_status || 'Not Added';
    if (status === 'VERIFIED' || status === 'SUCCESS') return 'Verified';
    if (status === 'PENDING' || status === 'PROCESSING') return 'Pending';
    if (status === 'FAILED' || status === 'REJECTED') return 'Failed';
    return 'Not Added';
  }, [primaryCafe]);

  // Mask bank account
  const maskedBankAccount = useMemo(() => {
    const last4 = primaryCafe?.bank_account_last4 || user?.account_number?.slice(-4);
    return last4 ? `XXXX-XXXX-XXXX-${last4}` : 'Not Configured';
  }, [primaryCafe, user]);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine whether tour should show automatically
  useEffect(() => {
    if (isAuthenticated && role === 'CAFE_OWNER' && user) {
      if (!user.owner_onboarding_completed) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [isAuthenticated, role, user]);

  // Handle manual restart listener
  useEffect(() => {
    const handleManualRestart = () => {
      setActiveStep(1);
      setIsOpen(true);
      toast.success('Restarting Cafe Owner Guided Tour!');
    };

    window.addEventListener('restart-owner-tour', handleManualRestart);
    return () => window.removeEventListener('restart-owner-tour', handleManualRestart);
  }, []);

  // Targets per step
  const getStepTargetSelector = (step) => {
    switch (step) {
      case 2:
        return '[data-tour="dashboard-overview"], [data-tour="nav-dashboard"]';
      case 3:
        return '[data-tour="nav-cafes"]';
      case 4:
        return '[data-tour="nav-cafes"]';
      case 5:
        return '[data-tour="nav-settlements"], [data-tour="nav-account"]';
      case 6:
        return '[data-tour="nav-bookings"]';
      case 7:
        return '[data-tour="nav-events"]';
      case 8:
        return '[data-tour="nav-[#owner#payments]"], [data-tour="nav-payments"]';
      case 9:
        return '[data-tour="nav-reviews"]';
      default:
        return null;
    }
  };

  // Position calculation for active target
  const updateTargetRect = useCallback(() => {
    if (!isOpen || activeStep === 1 || activeStep === 9) {
      setTargetRect(null);
      return;
    }

    const selector = getStepTargetSelector(activeStep);
    if (!selector) {
      setTargetRect(null);
      return;
    }

    const elem = document.querySelector(selector);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        viewportTop: rect.top,
        viewportLeft: rect.left,
      });

      // Scroll into view if offscreen
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null);
    }
  }, [isOpen, activeStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect, pathname, activeStep]);

  // Complete / Skip tour
  const handleFinishTour = async (skip = false) => {
    try {
      if (!skip) {
        triggerConfettiExplosion();
      }
      setIsOpen(false);
      setOwnerOnboardingCompleted(true);
      await userService.updateOnboardingStatus(true);
      toast.success(skip ? 'Tour skipped. You can restart anytime from Help & Support.' : 'Congratulations! Your portal tour is complete 🎉');
    } catch (error) {
      console.error('Failed to save onboarding completion', error);
    }
  };

  const nextStep = () => {
    if (activeStep < 9) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleFinishTour(false);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const navigateToAndNext = (path) => {
    if (pathname !== path) {
      router.push(path);
    }
    nextStep();
  };

  if (!isOpen || role !== 'CAFE_OWNER') return null;

  const ownerName = user?.name || 'Partner';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      
      {/* SVG Spotlight Mask Cutout Overlay (UNBLURS AND UN-DARKEN THE HIGHLIGHTED TAB 100%) */}
      {targetRect && !isMobile && activeStep !== 1 && activeStep !== 9 ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
          <defs>
            <mask id="tour-spotlight-mask">
              {/* White fills entire screen */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black punches a 100% transparent unblurred hole over the targeted tab */}
              <rect
                x={targetRect.viewportLeft - 6}
                y={targetRect.viewportTop - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="18"
                fill="black"
              />
            </mask>
          </defs>
          {/* Dark Translucent Backdrop with Cutout Hole */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(44, 24, 16, 0.78)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#2C1810]/78 backdrop-blur-[2px] transition-all duration-300 z-40"
        />
      )}

      {/* Glowing Animated Spotlight Ring Frame around target */}
      {targetRect && !isMobile && activeStep !== 1 && activeStep !== 9 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            top: targetRect.viewportTop - 6,
            left: targetRect.viewportLeft - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed pointer-events-none z-40 rounded-2xl ring-4 ring-[#DDB892] shadow-[0_0_35px_rgba(221,184,146,0.8)] border-2 border-white/80"
        />
      )}

      {/* STEP 1: WELCOME MODAL */}
      {activeStep === 1 && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-[#FFF8F0] border-2 border-[#DDB892]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-[#2C1810]"
          >
            {/* Background Decorative Gradient Blob */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-[#6F4E37]/20 to-[#A67B5B]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20">
                <Compass className="w-3.5 h-3.5" /> Step 1 of 9
              </span>
              <button
                onClick={() => handleFinishTour(true)}
                className="text-[#2C1810]/50 hover:text-[#2C1810] transition-colors p-1.5 rounded-full hover:bg-[#6F4E37]/10 cursor-pointer"
                title="Skip Tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-[#6F4E37]/20 border-2 border-[#DDB892] p-1.5 transform hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/logo.jpeg" 
                  alt="Fahara Logo" 
                  className="w-full h-full object-contain rounded-2xl" 
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] tracking-tight">
                Welcome to Fahara, {ownerName} 👋
              </h2>

              <p className="text-sm sm:text-base text-[#2C1810]/80 leading-relaxed max-w-md font-medium">
                Let's take an interactive guided tour and show you how to set up your cafe, manage bookings, and receive payouts.
              </p>

              <div className="w-full pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={nextStep}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#6F4E37]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Guided Tour <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFinishTour(true)}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl border-2 border-[#6F4E37]/20 hover:border-[#6F4E37]/40 text-[#6F4E37] font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* STEPS 2 to 8: MODERN INTERACTIVE TOOLTIP GUIDE BOX */}
      {activeStep >= 2 && activeStep <= 8 && (
        <div
          className={
            isMobile
              ? 'fixed bottom-0 left-0 right-0 p-4 z-50'
              : 'fixed z-50 bottom-8 right-8 max-w-md w-full'
          }
        >
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-gradient-to-b from-white via-[#FFF8F0] to-[#FFF3E4] border-2 border-[#DDB892] rounded-3xl p-6 shadow-2xl text-[#2C1810] relative overflow-hidden"
          >
            {/* Top Step Progress Bar Indicator */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#6F4E37]/15">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#6F4E37] text-white shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Step {activeStep} of 9
                </span>
                
                {/* 9 Mini Progress Dots */}
                <div className="flex items-center gap-1 hidden sm:flex">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <span 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx + 1 === activeStep 
                          ? 'w-4 bg-[#6F4E37]' 
                          : idx + 1 < activeStep 
                          ? 'w-1.5 bg-[#A67B5B]' 
                          : 'w-1.5 bg-[#DDB892]/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleFinishTour(true)}
                className="text-[#2C1810]/50 hover:text-[#6F4E37] text-xs font-extrabold hover:underline cursor-pointer"
              >
                Skip Tour
              </button>
            </div>

            {/* STEP 2 CONTENT */}
            {activeStep === 2 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Your Business at a Glance</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">PORTFOLIO SUMMARY</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Track your bookings, customers, revenue, ratings, and important business updates from one place.
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-[#DDB892]/50 text-xs space-y-1.5 shadow-2xs">
                  <p className="font-extrabold text-[#6F4E37] text-[11px] uppercase tracking-wider">Key Metrics Tracked:</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold text-[#2C1810]/80">
                    <div className="flex items-center gap-1">✓ Total Revenue</div>
                    <div className="flex items-center gap-1">✓ Total Customers</div>
                    <div className="flex items-center gap-1">✓ Active Bookings</div>
                    <div className="flex items-center gap-1">✓ Average Rating</div>
                    <div className="flex items-center gap-1">✓ Upcoming Schedule</div>
                    <div className="flex items-center gap-1">✓ Revenue Analytics</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 CONTENT */}
            {activeStep === 3 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Add Your Cafe Profile</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">VENUE LISTING</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Create your cafe profile so customers can discover and book your dining venue.
                </p>

                {primaryCafe ? (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-300 p-3 rounded-2xl text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600" />
                    <span>Your cafe <strong>"{primaryCafe.name}"</strong> is already created. You can update details anytime.</span>
                  </div>
                ) : (
                  <div className="bg-white p-3.5 rounded-2xl border border-[#DDB892]/50 text-xs space-y-1 text-[#2C1810]/80 shadow-2xs">
                    <p className="font-extrabold text-[#6F4E37] text-[11px] uppercase tracking-wider">Details Required:</p>
                    <p className="text-[11px] leading-relaxed font-medium">
                      Cafe Name, Address & Map Coordinates, Photos, Pricing, Amenities, Capacity & Operating Hours.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 CONTENT */}
            {activeStep === 4 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Make Your Cafe Ready</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">PROFILE OPTIMIZATION</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Complete your cafe information to give customers everything they need before booking.
                </p>

                {/* Dynamic Completion Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#DDB892]/50 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2C1810]">
                    <span>Profile Setup Completion</span>
                    <span className="text-[#6F4E37]">{cafeCompletionPercentage}% Complete</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cafeCompletionPercentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 CONTENT */}
            {activeStep === 5 && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#2C1810]">Settlement Account</h3>
                      <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">RAZORPAY PAYOUTS</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      bankStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : bankStatus === 'Pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : bankStatus === 'Failed'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {bankStatus}
                  </span>
                </div>

                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Add and verify your bank account so eligible payments and settlements can be processed securely via Razorpay.
                </p>

                <div className="bg-white p-3.5 rounded-2xl border border-[#DDB892]/50 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#2C1810]/80 font-bold">
                    <span>Account Status:</span>
                    <span className="font-mono">{maskedBankAccount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 CONTENT */}
            {activeStep === 6 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Manage Bookings</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">DINER RESERVATIONS</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  View and manage all customer table and venue reservations from one place.
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-[#DDB892]/50 text-xs text-[#2C1810]/80 space-y-1 shadow-2xs">
                  <p className="font-extrabold text-[#6F4E37] text-[11px] uppercase tracking-wider">Features:</p>
                  <p className="text-[11px] leading-relaxed font-medium">
                    Inspect guest details, event dates, guest counts, and approve or complete reservations.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 7 CONTENT */}
            {activeStep === 7 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Manage Events</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">PARTY PACKAGES</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Create and manage event offerings for birthdays, meetings, parties, and special setups.
                </p>
              </div>
            )}

            {/* STEP 8 CONTENT */}
            {activeStep === 8 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">Track Earnings</h3>
                    <p className="text-[10px] text-[#6F4E37] font-extrabold uppercase tracking-wider">PAYMENTS & SETTLEMENTS</p>
                  </div>
                </div>
                <p className="text-xs text-[#2C1810]/80 leading-relaxed font-medium">
                  Monitor customer payments, settlement amounts, refunds, and transaction history.
                </p>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#6F4E37]/15 gap-2">
              <button
                onClick={prevStep}
                className="py-2.5 px-4 rounded-2xl border border-[#6F4E37]/30 hover:bg-[#6F4E37]/10 text-[#6F4E37] font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center gap-2">
                {activeStep === 3 && (
                  <button
                    onClick={() => navigateToAndNext('/owner/cafes')}
                    className="py-2.5 px-3.5 rounded-2xl bg-[#A67B5B] hover:bg-[#6F4E37] text-white font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    Go to Cafes →
                  </button>
                )}
                {activeStep === 6 && (
                  <button
                    onClick={() => navigateToAndNext('/owner/bookings')}
                    className="py-2.5 px-3.5 rounded-2xl bg-[#A67B5B] hover:bg-[#6F4E37] text-white font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    View Bookings →
                  </button>
                )}
                {activeStep === 7 && (
                  <button
                    onClick={() => navigateToAndNext('/owner/events')}
                    className="py-2.5 px-3.5 rounded-2xl bg-[#A67B5B] hover:bg-[#6F4E37] text-white font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    Manage Events →
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white font-extrabold text-xs shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span> <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* STEP 9: FINAL CELEBRATION MODAL WITH FLOATING BALLOONS & CONFETTI */}
      {activeStep === 9 && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          
          {/* Floating Celebration Balloons Background Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-45">
            {celebrationBalloons.map((balloon, index) => (
              <motion.div
                key={index}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: balloon.duration,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: balloon.delay,
                }}
                className="absolute flex flex-col items-center"
                style={{ left: balloon.left }}
              >
                {/* 3D Balloon Body */}
                <div className={`w-14 h-18 sm:w-16 sm:h-20 rounded-full bg-gradient-to-tr ${balloon.color} shadow-lg relative flex items-center justify-center border border-white/30`}>
                  <div className="w-3 h-3 rounded-full bg-white/40 absolute top-2 left-3 blur-2xs" />
                  <PartyPopper className="w-5 h-5 text-white/80" />
                </div>
                {/* Balloon Tie Knot */}
                <div className={`w-3 h-2 bg-gradient-to-r ${balloon.color} -mt-0.5 rounded-b-xs`} />
                {/* Balloon Wavy String */}
                <div className="w-0.5 h-16 bg-white/40 border-l border-dashed border-white/60" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-lg bg-[#FFF8F0] border-2 border-[#DDB892]/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center z-50"
          >
            {/* Background Festive Flare */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-[#6F4E37] flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-orange-500/25 border-2 border-white/50 transform hover:scale-110 hover:rotate-3 transition-transform cursor-pointer" onClick={triggerConfettiExplosion}>
              <Star className="w-10 h-10 fill-white animate-pulse" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20 mb-3">
              <PartyPopper className="w-3.5 h-3.5 text-[#6F4E37]" /> Step 9 of 9 • Complete
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight mb-2">
              You're All Set! 🎉
            </h2>

            <p className="text-sm text-[#2C1810]/80 leading-relaxed mb-6 max-w-md mx-auto font-medium">
              Your Fahara Owner Portal is ready. Monitor reviews, ratings, and revenue to start managing your cafe and growing your business.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleFinishTour(false);
                  router.push('/owner/dashboard');
                }}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PartyPopper className="w-4 h-4 text-white" />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={() => {
                  handleFinishTour(false);
                  router.push('/owner/cafes');
                }}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl border-2 border-[#6F4E37]/30 hover:border-[#6F4E37] hover:bg-[#6F4E37]/10 text-[#6F4E37] font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Create / Manage My Cafe
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
