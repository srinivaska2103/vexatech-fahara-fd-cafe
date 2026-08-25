'use client';
import React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsLayout({ children }) {
  return (
    <div className="p-3 sm:p-5 max-w-5xl mx-auto space-y-4 text-[#2C1810]">
      {/* Settings Header */}
      <div className="border-b border-border/40 pb-4">
        <PageHeader 
          title="Account & Business Settings" 
          description="Manage your cafe business details, owner profile, location, and account options."
        />
      </div>

      {/* Main Settings Content Area - Full Width without left sidebar */}
      <main className="w-full pb-16 md:pb-0">
        <AnimatePresence mode="wait">
           <motion.div
             key={typeof window !== 'undefined' ? window.location.pathname : 'settings'}
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -8 }}
             transition={{ duration: 0.2 }}
           >
             {children}
           </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
