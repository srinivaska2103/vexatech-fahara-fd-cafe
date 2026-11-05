'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex justify-center mb-4"
    >
      <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#FEE2E2] shadow-xs">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#FEE2E2] p-1 shrink-0 flex items-center justify-center">
          <img 
            src="/grab-it-logo.png" 
            alt="Grab2GO Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-base font-black text-[#252525] tracking-wider leading-none">Grab2GO</span>
          <span className="text-[10px] font-bold text-[#E50914] leading-none mt-1">Cafe & Event Booking</span>
        </div>
      </div>
    </motion.div>
  );
};
