'use client';
import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export const PasswordInput = forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={`pr-10 h-11 rounded-2xl border-[#FEE2E2] bg-white focus:bg-white text-xs font-medium text-[#252525] ${className || ''}`}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute right-3.5 top-[22px] -translate-y-1/2 z-10 text-[#E50914] hover:text-[#252525] p-1 rounded-xl hover:bg-[#E50914]/10 transition-all focus:outline-none cursor-pointer flex items-center justify-center"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex="-1"
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';
