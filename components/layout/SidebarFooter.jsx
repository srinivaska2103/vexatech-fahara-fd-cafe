'use client';
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/store/layout.store';

export const SidebarFooter = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);

  const handleLogout = () => {
    logout();
    router.push('/owner/login');
  };

  return (
    <div className="shrink-0 border-t border-border/60 pt-2.5">
      <button
        onClick={handleLogout}
        className="flex items-center w-full gap-2.5 px-3 py-2 rounded-2xl text-xs font-extrabold text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        title="Sign Out of Portal"
      >
        <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
        {!isSidebarCollapsed && <span className="truncate">Sign Out</span>}
      </button>
    </div>
  );
};
