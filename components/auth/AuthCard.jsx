'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-3xl shadow-2xl border border-[#DDB892]/60 text-[#2C1810]"
    >
      {children}
    </motion.div>
  );
};
