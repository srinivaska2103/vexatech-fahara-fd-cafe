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
      <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#DDB892]/50 shadow-2xs">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF0E6] border border-[#DDB892]/60 p-0.5 shrink-0">
          <img 
            src="/logo.jpeg" 
            alt="Fahara Logo" 
            className="w-full h-full object-contain rounded-lg" 
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-base font-black text-[#2C1810] tracking-wider leading-none">FAHARA</span>
          <span className="text-[10px] font-bold text-[#6F4E37]/75 leading-none mt-1">Cafe & Event Booking</span>
        </div>
      </div>
    </motion.div>
  );
};



