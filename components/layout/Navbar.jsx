'use client';
import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from './Breadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 flex flex-col w-full bg-white/95 backdrop-blur-md border-b border-border/60 shadow-2xs transition-all">
      {/* Top Primary Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#6F4E37] via-[#A67B5B] to-[#DDB892]" />

      <div className="flex items-center justify-between h-16 px-3.5 sm:px-6 lg:px-8 gap-3">
        
        <div className="flex items-center gap-3">
          {/* Mobile & Tablet Logo Brand */}
          <Link href="/owner/dashboard" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-2xl overflow-hidden bg-[#FAF0E6] shadow-2xs border border-[#DDB892]/70 p-0.5">
              <img 
                src="/logo.jpeg" 
                alt="Fahara Logo" 
                className="w-full h-full object-contain rounded-xl" 
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-extrabold text-[#2C1810] tracking-tight leading-none">Fahara</span>
              <span className="text-[9px] font-bold text-[#6F4E37] uppercase tracking-wider leading-none mt-0.5">Venue Partner</span>
            </div>
          </Link>

          {/* Breadcrumb Desktop */}
          <div className="hidden lg:flex items-center gap-4 w-full max-w-lg">
            <Breadcrumb />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <NotificationDropdown />
          
          <div className="w-px h-5 bg-border/60 mx-1 hidden sm:block"></div>
          
          <ProfileDropdown />
        </div>

      </div>
    </header>
  );
};
