'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernDropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option', 
  icon = null,
  className = '',
  buttonClassName = '',
  menuClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isFullWidth = className.includes('w-full');

  return (
    <div ref={dropdownRef} className={`relative ${isFullWidth ? 'w-full block' : 'inline-block'} text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${isFullWidth ? 'w-full' : ''} flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none border shadow-2xs ${
          isOpen
            ? 'bg-white border-[#E50914] ring-2 ring-[#E50914]/20 text-[#252525]'
            : 'bg-white border-[#FEE2E2] hover:border-[#E50914]/40 text-[#252525] hover:bg-[#FFF5F5]/40'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="shrink-0 text-[#E50914]">{icon}</span>}
          {selectedOption?.badge && <span className="shrink-0">{selectedOption.badge}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-[#757575] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#E50914]' : ''
          }`} 
        />
      </button>

      {/* Modern Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute ${isFullWidth ? 'left-0 right-0 w-full' : 'right-0 min-w-[180px] w-max max-w-[260px]'} z-50 mt-1.5 bg-white rounded-2xl border border-[#FEE2E2] shadow-xl shadow-black/10 p-1.5 overflow-hidden ${menuClassName}`}
          >
            <div className="max-h-60 overflow-y-auto scrollbar-none space-y-0.5">
              {options.map((option) => {
                const isSelected = String(option.value) === String(value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#E50914] text-white shadow-xs'
                        : 'text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E50914]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.badge && <span className="shrink-0">{option.badge}</span>}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

