'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex justify-center mb-3"
    >
      <div className="flex flex-col items-center justify-center space-y-2.5 text-center">
        {/* Official Fahara Logo Badge matching reference design */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-white shadow-md border border-[#DDB892]/70 p-3 cursor-pointer"
        >
          <img 
            src="/logo.jpeg" 
            alt="Fahara Logo" 
            className="w-full h-full object-contain rounded-2xl" 
          />
        </motion.div>

        <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-widest bg-[#6F4E37]/10 px-3.5 py-1 rounded-full border border-[#DDB892]/40 inline-block">
          VENUE PARTNER PORTAL
        </span>
      </div>
    </motion.div>
  );
};



