'use client';
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Store, 
  CalendarCheck, 
  CalendarDays, 
  Users, 
  Star, 
  CreditCard, 
  ArrowRightLeft, 
  BarChart3, 
  Bell, 
  RefreshCw, 
  ShieldCheck,
  Settings,
  HelpCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup } from './SidebarGroup';
import { SidebarFooter } from './SidebarFooter';
import { useLayoutStore } from '@/store/layout.store';
import { cn } from '@/utils/cn';
import Link from 'next/link';

const mainMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/owner/dashboard', color: 'text-amber-600', bg: 'bg-amber-100/70' },
  { icon: Store, label: 'Cafe Management', href: '/owner/cafes', color: 'text-indigo-600', bg: 'bg-indigo-100/70' },
  { icon: CalendarCheck, label: 'Bookings', href: '/owner/bookings', color: 'text-emerald-600', bg: 'bg-emerald-100/70' },
  { icon: CalendarDays, label: 'Events', href: '/owner/events', color: 'text-cyan-600', bg: 'bg-cyan-100/70' },
  { icon: Users, label: 'Customers', href: '/owner/customers', color: 'text-sky-600', bg: 'bg-sky-100/70' },
  { icon: Star, label: 'Reviews', href: '/owner/reviews', color: 'text-amber-500', bg: 'bg-amber-100/70' },
];

const financeMenuItems = [
  { icon: CreditCard, label: 'Payments', href: '/owner/payments', exact: true, color: 'text-emerald-600', bg: 'bg-emerald-100/70' },
  { icon: ArrowRightLeft, label: 'Settlements', href: '/owner/payments/settlements', color: 'text-violet-600', bg: 'bg-violet-100/70' },
  { icon: RefreshCw, label: 'Refunds', href: '/owner/payments/refunds', color: 'text-orange-600', bg: 'bg-orange-100/70' },
  { icon: ShieldCheck, label: 'Payment Account', href: '/owner/payments/account', color: 'text-blue-600', bg: 'bg-blue-100/70' },
];

const systemMenuItems = [
  { icon: BarChart3, label: 'Analytics', href: '/owner/analytics', color: 'text-purple-600', bg: 'bg-purple-100/70' },
  { icon: Bell, label: 'Notifications', href: '/owner/notifications', color: 'text-rose-600', bg: 'bg-rose-100/70' },
  { icon: Settings, label: 'Settings', href: '/owner/settings', color: 'text-slate-600', bg: 'bg-slate-200/80' },
  { icon: HelpCircle, label: 'Help & Support', href: '/owner/support', color: 'text-teal-600', bg: 'bg-teal-100/70' },
];

export const Sidebar = () => {
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen border-r border-border/60 bg-white transition-all duration-300 relative z-20 shadow-2xs shrink-0 select-none",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b border-border/60 shrink-0">
        <Link href="/owner/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-2xl overflow-hidden bg-[#FAF0E6] shadow-2xs border border-[#DDB892]/70 p-0.5">
            <img 
              src="/logo.jpeg" 
              alt="Fahara Logo" 
              className="w-full h-full object-contain rounded-xl" 
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col justify-center">
              <span className="text-base font-black text-[#2C1810] tracking-tight truncate leading-none">Fahara</span>
              <span className="text-[9px] font-extrabold text-[#6F4E37] uppercase tracking-widest leading-none mt-1">Venue Partner</span>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-16 -right-3 flex items-center justify-center w-6 h-6 bg-white border border-border/70 rounded-full text-text/60 hover:text-primary hover:border-primary transition-all shadow-md z-30 hover:scale-110 cursor-pointer"
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Strictly Non-Scrollable Navigation Area filling full height */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col justify-between space-y-4">
        
        <div className="space-y-4">
          <SidebarGroup label="Main Menu">
            {mainMenuItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </SidebarGroup>

          <SidebarGroup label="Finance">
            {financeMenuItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </SidebarGroup>

          <SidebarGroup label="System">
            {systemMenuItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </SidebarGroup>
        </div>

        {/* Bottom Modern Live Venue Health Card (when expanded) */}
        {!isSidebarCollapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 shadow-2xs space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                <span className="text-[11px] font-extrabold text-[#2C1810]">Venue Operations</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[9px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live
              </span>
            </div>

            <p className="text-[10px] text-text/60 font-medium leading-relaxed">
              Automated payouts & real-time dining reservations are active.
            </p>

            <Link 
              href="/owner/analytics" 
              className="block w-full py-1.5 text-center rounded-xl bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 text-[10px] font-extrabold transition-all shadow-2xs"
            >
              View Analytics Overview →
            </Link>
          </div>
        )}

        {/* Bottom Menu Items & Logout */}
        <SidebarFooter />
      </div>
    </aside>
  );
};
