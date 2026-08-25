'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { OwnerOnboardingTour } from '@/components/onboarding/OwnerOnboardingTour';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Loader2, Coffee, Sparkles, Store, ShieldCheck, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && hasHydrated) {
      if (!isAuthenticated) {
        router.push('/owner/login');
      } else if (role !== 'CAFE_OWNER') {
        router.push('/owner/login'); 
      }
    }
  }, [isAuthenticated, role, router, isMounted, hasHydrated]);

  // Modern Animated SaaS Splash Screen with Animated Floating Objects
  if (!isMounted || !hasHydrated) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EA] to-[#FFEFE0] text-[#2C1810] p-4 overflow-hidden">
        
        {/* Background Ambient Glowing Blobs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#6F4E37]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#DDB892]/20 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />

        {/* Floating Animated Icon Objects */}
        <motion.div 
          animate={{ y: [-8, 8, -8], rotate: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-12 sm:top-24 sm:left-32 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDB892]/60 shadow-xs text-[#6F4E37]"
        >
          <Coffee className="w-6 h-6" />
        </motion.div>

        <motion.div 
          animate={{ y: [10, -10, 10], rotate: [12, -12, 12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-20 right-10 sm:top-28 sm:right-36 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDB892]/60 shadow-xs text-[#A67B5B]"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        <motion.div 
          animate={{ y: [-12, 6, -12], rotate: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-20 left-10 sm:bottom-28 sm:left-36 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDB892]/60 shadow-xs text-[#6F4E37]"
        >
          <Store className="w-6 h-6" />
        </motion.div>

        <motion.div 
          animate={{ y: [8, -8, 8], rotate: [10, -10, 10] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-16 right-12 sm:bottom-24 sm:right-32 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDB892]/60 shadow-xs text-emerald-700"
        >
          <ShieldCheck className="w-6 h-6" />
        </motion.div>

        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-8 sm:left-20 text-[#A67B5B]/50"
        >
          <Star className="w-5 h-5 fill-current" />
        </motion.div>

        {/* Center Animated Loader & Logo Container */}
        <div className="relative flex flex-col items-center z-10 space-y-6">
          <div className="relative flex items-center justify-center">
            
            {/* Outer Spinning Ring */}
            <div className="w-28 h-28 rounded-full border-4 border-[#DDB892]/30 border-t-[#6F4E37] animate-spin" />
            
            {/* Inner Counter-Spinning Dashed Ring */}
            <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-[#A67B5B]/60 animate-spin-slow" style={{ animationDirection: 'reverse' }} />

            {/* Pulsing Centered Logo */}
            <motion.div 
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-[#DDB892] p-1 flex items-center justify-center"
            >
              <img 
                src="/logo.jpeg" 
                alt="Fahara Logo" 
                className="w-full h-full object-contain rounded-xl" 
              />
            </motion.div>
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black text-[#2C1810] tracking-tight">Fahara Venue Partner</h2>
            <p className="text-xs text-[#6F4E37] font-extrabold flex items-center justify-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6F4E37]" /> Preparing owner workspace...
            </p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-text">
      <Sidebar />
      <MobileSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      {role === 'CAFE_OWNER' && <OwnerOnboardingTour />}
    </div>
  );
}
