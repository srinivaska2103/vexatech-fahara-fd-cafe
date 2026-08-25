'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AuthHeader = ({ title, subtitle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center space-y-1"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C1810]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#2C1810]/70 font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
