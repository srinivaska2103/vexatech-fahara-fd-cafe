'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check if iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      // Listen for beforeinstallprompt event on Chrome/Edge/Android
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native browser install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions modal (especially helpful for iOS Safari or Chrome when prompt was dismissed)
      setShowInstructionsModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install Grab2GO Partner App"
        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-[#E50914] to-[#B71C1C] hover:from-red-500 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/40 border border-white/20 transition-all duration-200 active:scale-95 shrink-0"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <Download className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
        <span className="tracking-tight hidden xs:inline sm:inline">Install App</span>
      </button>

      {/* Manual Installation Instructions Modal using React Portal so it renders directly on document.body */}
      {showInstructionsModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setShowInstructionsModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Centered Modal Container */}
          <div className="relative z-10 bg-white rounded-3xl p-6 max-w-sm w-full mx-auto my-auto shadow-2xl border border-[#FEE2E2] text-left space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] flex items-center justify-center text-white shadow-md shadow-[#E50914]/30 shrink-0 p-1">
                  <img src="/grab-it-logo.png" alt="Grab2GO" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#252525] tracking-tight">Install Grab2GO</h3>
                  <p className="text-xs font-semibold text-[#E50914]">Official Partner Mobile App</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="p-1.5 rounded-xl text-[#252525]/40 hover:text-[#252525] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Info */}
            <div className="bg-[#FFF5F5] border border-[#FEE2E2] rounded-2xl p-4 space-y-2.5 text-xs text-[#252525]">
              {isIos ? (
                <>
                  <p className="font-bold text-[#E50914] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" /> Safari on iPhone/iPad:
                  </p>
                  <div className="space-y-1.5 pl-1 text-[11px] text-[#252525]/80">
                    <p>1. Tap the <strong>Share</strong> button (box with arrow) at the bottom.</p>
                    <p>2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</p>
                    <p>3. Tap <strong>Add</strong> in the top right corner.</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold text-[#E50914] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" /> Chrome / Edge / Android:
                  </p>
                  <div className="space-y-1.5 pl-1 text-[11px] text-[#252525]/80">
                    <p>1. Tap the <strong>three dots (&vellip;)</strong> menu in your browser top bar.</p>
                    <p>2. Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</p>
                    <p>3. Confirm install to access Grab2GO directly from your home screen.</p>
                  </div>
                </>
              )}
            </div>

            {/* Features Pill */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#252525]/70 pt-1">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant alerts</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 p-2 rounded-xl border border-blue-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Fast live access</span>
              </div>
            </div>

            {/* Got It Button */}
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B71C1C] text-white text-xs font-extrabold shadow-md shadow-[#E50914]/25 hover:shadow-lg transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

