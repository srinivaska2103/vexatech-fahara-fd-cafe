'use client';
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const UserAvatar = ({ name, className }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'FC';
  
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold shadow-xs border-2 border-white shrink-0 ${className || ''}`}>
      {initials}
    </div>
  );
};

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const user = useAuthStore((state) => state.user) || { name: 'Srinivas K A', email: 'owner@faharacafe.com', role: 'CAFE_OWNER' };
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/owner/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 pl-3 pr-1.5 rounded-full bg-surface border border-border hover:border-primary/40 hover:bg-white transition-all focus:outline-none shadow-2xs group"
      >
        <div className="hidden md:flex flex-col items-end leading-none">
          <span className="text-xs font-bold text-text max-w-[120px] truncate group-hover:text-primary transition-colors">
            {user.name}
          </span>
          <span className="text-[10px] font-semibold text-primary/80 mt-0.5 uppercase tracking-wider">
            {user.role === 'CAFE_OWNER' ? 'Cafe Owner' : user.role || 'Owner'}
          </span>
        </div>
        <UserAvatar name={user.name} />
        <ChevronDown className="w-3.5 h-3.5 text-text/40 transition-transform group-hover:text-text" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/70 overflow-hidden z-50 animate-fade-in origin-top-right">
          <div className="px-5 py-4 border-b border-border/40 bg-surface/40">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} className="w-10 h-10 text-sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text truncate">{user.name}</p>
                <p className="text-[11px] text-text/50 truncate mt-0.5">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span>Verified Partner</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2 space-y-0.5">
            <Link 
              href="/owner/settings/profile" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-text/80 hover:bg-surface hover:text-primary transition-colors"
            >
              <User className="w-4 h-4 text-text/40" />
              <span>My Business Profile</span>
            </Link>

            <Link 
              href="/owner/settings" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-text/80 hover:bg-surface hover:text-primary transition-colors"
            >
              <Settings className="w-4 h-4 text-text/40" />
              <span>Account Settings</span>
            </Link>
          </div>
          
          <div className="p-2 border-t border-border/40 bg-surface/30">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
