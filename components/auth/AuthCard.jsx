'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="w-full max-w-md p-7 sm:p-9 space-y-6 bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl border border-white/80 text-[#2C1810]"
    >
      {children}
    </motion.div>
  );
};
