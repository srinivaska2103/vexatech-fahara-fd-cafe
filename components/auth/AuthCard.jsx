'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="w-full max-w-md p-7 sm:p-9 space-y-6 bg-white rounded-[28px] shadow-[0_12px_40px_rgba(229,57,53,0.08)] border border-[#FEE2E2] text-[#252525] relative z-10"
    >
      {children}
    </motion.div>
  );
};
