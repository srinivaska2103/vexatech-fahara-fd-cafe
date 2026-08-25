'use client';
import React, { useEffect, useState } from 'react';
import { 
  Coffee, 
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
  LogOut, 
  X,
  Sparkles
} from 'lucide-react';
import { useLayoutStore } from '@/store/layout.store';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const menuTabs = [
  {
    id: 'dashboard',
    category: 'main',
    label: 'Dashboard',
    href: '/owner/dashboard',
    icon: LayoutDashboard,
    activeBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white shadow-md shadow-amber-600/30 border-amber-400/40',
    inactiveBg: 'bg-amber-500/10 text-amber-900 border-amber-500/20 hover:bg-amber-500/20',
    iconColor: 'text-amber-600',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'cafes',
    category: 'main',
    label: 'Cafe Management',
    href: '/owner/cafes',
    icon: Store,
    activeBg: 'bg-gradient-to-br from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white shadow-md shadow-[#6F4E37]/30 border-[#DDB892]/40',
    inactiveBg: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#6F4E37]/20 hover:bg-[#6F4E37]/20',
    iconColor: 'text-[#6F4E37]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'bookings',
    category: 'main',
    label: 'Bookings',
    href: '/owner/bookings',
    icon: CalendarCheck,
    activeBg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-600/30 border-emerald-400/40',
    inactiveBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-500/20 hover:bg-emerald-500/20',
    iconColor: 'text-emerald-600',
    activeIconColor: 'text-emerald-200'
  },
  {
    id: 'events',
    category: 'main',
    label: 'Events',
    href: '/owner/events',
    icon: CalendarDays,
    activeBg: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white shadow-md shadow-purple-600/30 border-purple-400/40',
    inactiveBg: 'bg-purple-500/10 text-purple-900 border-purple-500/20 hover:bg-purple-500/20',
    iconColor: 'text-purple-600',
    activeIconColor: 'text-purple-200'
  },
  {
    id: 'customers',
    category: 'main',
    label: 'Customers',
    href: '/owner/customers',
    icon: Users,
    activeBg: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-md shadow-blue-600/30 border-blue-400/40',
    inactiveBg: 'bg-blue-500/10 text-blue-900 border-blue-500/20 hover:bg-blue-500/20',
    iconColor: 'text-blue-600',
    activeIconColor: 'text-blue-200'
  },
  {
    id: 'reviews',
    category: 'main',
    label: 'Reviews',
    href: '/owner/reviews',
    icon: Star,
    activeBg: 'bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 text-white shadow-md shadow-yellow-500/30 border-yellow-300/40',
    inactiveBg: 'bg-yellow-500/10 text-yellow-900 border-yellow-500/20 hover:bg-yellow-500/20',
    iconColor: 'text-amber-500',
    activeIconColor: 'text-yellow-200'
  },
  {
    id: 'payments',
    category: 'finance',
    label: 'Payments',
    href: '/owner/payments',
    exact: true,
    icon: CreditCard,
    activeBg: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white shadow-md shadow-indigo-600/30 border-indigo-400/40',
    inactiveBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-500/20 hover:bg-indigo-500/20',
    iconColor: 'text-indigo-600',
    activeIconColor: 'text-indigo-200'
  },
  {
    id: 'settlements',
    category: 'finance',
    label: 'Settlements',
    href: '/owner/payments/settlements',
    icon: ArrowRightLeft,
    activeBg: 'bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white shadow-md shadow-teal-600/30 border-teal-400/40',
    inactiveBg: 'bg-teal-500/10 text-teal-900 border-teal-500/20 hover:bg-teal-500/20',
    iconColor: 'text-teal-600',
    activeIconColor: 'text-teal-200'
  },
  {
    id: 'refunds',
    category: 'finance',
    label: 'Refunds',
    href: '/owner/payments/refunds',
    icon: RefreshCw,
    activeBg: 'bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 text-white shadow-md shadow-rose-600/30 border-rose-400/40',
    inactiveBg: 'bg-rose-500/10 text-rose-900 border-rose-500/20 hover:bg-rose-500/20',
    iconColor: 'text-rose-600',
    activeIconColor: 'text-rose-200'
  },
  {
    id: 'account',
    category: 'finance',
    label: 'Payment Account',
    href: '/owner/payments/account',
    icon: ShieldCheck,
    activeBg: 'bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 text-white shadow-md shadow-cyan-600/30 border-cyan-400/40',
    inactiveBg: 'bg-cyan-500/10 text-cyan-900 border-cyan-500/20 hover:bg-cyan-500/20',
    iconColor: 'text-cyan-600',
    activeIconColor: 'text-cyan-200'
  },
  {
    id: 'analytics',
    category: 'system',
    label: 'Analytics',
    href: '/owner/analytics',
    icon: BarChart3,
    activeBg: 'bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 text-white shadow-md shadow-violet-600/30 border-violet-400/40',
    inactiveBg: 'bg-violet-500/10 text-violet-900 border-violet-500/20 hover:bg-violet-500/20',
    iconColor: 'text-violet-600',
    activeIconColor: 'text-violet-200'
  },
  {
    id: 'notifications',
    category: 'system',
    label: 'Notifications',
    href: '/owner/notifications',
    icon: Bell,
    activeBg: 'bg-gradient-to-br from-orange-600 via-orange-700 to-amber-700 text-white shadow-md shadow-orange-600/30 border-orange-400/40',
    inactiveBg: 'bg-orange-500/10 text-orange-900 border-orange-500/20 hover:bg-orange-500/20',
    iconColor: 'text-orange-600',
    activeIconColor: 'text-orange-200'
  },
  {
    id: 'settings',
    category: 'system',
    label: 'Settings',
    href: '/owner/settings',
    icon: Settings,
    activeBg: 'bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900 text-white shadow-md shadow-slate-700/30 border-slate-400/40',
    inactiveBg: 'bg-slate-500/10 text-slate-900 border-slate-500/20 hover:bg-slate-500/20',
    iconColor: 'text-slate-600',
    activeIconColor: 'text-slate-200'
  },
  {
    id: 'support',
    category: 'system',
    label: 'Help & Support',
    href: '/owner/support',
    icon: HelpCircle,
    activeBg: 'bg-gradient-to-br from-sky-600 via-sky-700 to-blue-700 text-white shadow-md shadow-sky-600/30 border-sky-400/40',
    inactiveBg: 'bg-sky-500/10 text-sky-900 border-sky-500/20 hover:bg-sky-500/20',
    iconColor: 'text-sky-600',
    activeIconColor: 'text-sky-200'
  }
];

export const MobileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobileSidebarOpen = useLayoutStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useLayoutStore((state) => state.closeMobileSidebar);
  const logout = useAuthStore((state) => state.logout);

  const [activeCategory, setActiveCategory] = useState('all');

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeMobileSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeMobileSidebar]);

  const handleLogout = () => {
    closeMobileSidebar();
    logout();
    router.push('/owner/login');
  };

  const filteredTabs = menuTabs.filter((tab) => {
    if (activeCategory === 'all') return true;
    return tab.category === activeCategory;
  });

  return (
    <>
      {/* Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Bottom Sheet Drawer coming up from down */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] w-full bg-[#FFF8F0] flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl rounded-t-3xl border-t-2 border-[#DDB892]/60 ${
          isMobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle Top Bar */}
        <div className="w-12 h-1.5 rounded-full bg-[#6F4E37]/30 mx-auto my-2.5 shrink-0" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#6F4E37]/15 bg-[#FFF8F0] shrink-0">
          <Link href="/owner/dashboard" onClick={closeMobileSidebar} className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6F4E37]/10 to-surface shadow-xs border border-[#6F4E37]/20 p-0.5">
              <img src="/logo.jpeg" alt="Fahara Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#2C1810] tracking-tight leading-none">Fahara</span>
              <span className="text-[9px] font-bold text-[#6F4E37] uppercase tracking-widest leading-none mt-0.5">Owner Portal Navigation</span>
            </div>
          </Link>
          <button 
            onClick={closeMobileSidebar}
            className="p-1.5 text-[#2C1810]/60 hover:text-[#6F4E37] hover:bg-[#6F4E37]/10 rounded-2xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-3 pt-3 pb-2 border-b border-[#6F4E37]/10 bg-white/70 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Tabs' },
              { id: 'main', label: 'Main' },
              { id: 'finance', label: 'Finance' },
              { id: 'system', label: 'System' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#6F4E37] text-white shadow-sm'
                    : 'bg-[#6F4E37]/10 text-[#6F4E37] hover:bg-[#6F4E37]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Tabs 2-Column Row-Wise Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start custom-scrollbar max-h-[50vh]">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact 
              ? pathname === tab.href 
              : pathname === tab.href || (pathname.startsWith(`${tab.href}/`) && tab.href !== '/owner/payments');

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={closeMobileSidebar}
                data-tour={`nav-${tab.id}`}
                className={`flex flex-col justify-between p-3 rounded-2xl border transition-all duration-200 min-h-[76px] relative overflow-hidden ${
                  isActive ? tab.activeBg : tab.inactiveBg
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20' : 'bg-white/80 shadow-2xs'}`}>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? tab.activeIconColor : tab.iconColor}`} />
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-xs animate-pulse shrink-0" />
                  )}
                </div>
                <span className="truncate text-xs font-extrabold leading-tight tracking-tight mt-2">{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer Logout */}
        <div className="p-3 border-t border-[#6F4E37]/15 bg-white shrink-0 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-rose-200/60 text-rose-800">
                <LogOut className="w-4 h-4 shrink-0" />
              </div>
              <span>Logout</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">Owner Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
