'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export const BackButton = ({ 
  href, 
  onClick, 
  label = "Back", 
  children,
  className 
}) => {
  const content = (
    <motion.div
      whileHover={{ x: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        "group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#DDB892]/60 hover:border-[#DDB892] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer text-[#2C1810] hover:text-[#6F4E37] select-none",
        className
      )}
    >
      <div className="w-6 h-6 rounded-xl bg-[#6F4E37]/10 group-hover:bg-[#6F4E37] group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
        <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </div>
      <span className="text-xs font-extrabold tracking-tight truncate">
        {children || label}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block border-none bg-transparent p-0 text-left">
      {content}
    </button>
  );
};
