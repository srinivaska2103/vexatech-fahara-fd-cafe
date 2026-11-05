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
  Sparkles,
  Armchair,
  Megaphone,
  Crown,
  Utensils,
  Receipt,
  Tag,
  ShoppingBag,
  UtensilsCrossed,
  BadgePercent,
  Bike,
  SlidersHorizontal,
  ExternalLink
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
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'subscription',
    category: 'main',
    label: 'Subscription',
    href: '/owner/subscription',
    icon: Crown,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'cafes',
    category: 'main',
    label: 'Cafe Management',
    href: '/owner/cafes',
    icon: Store,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'tables',
    category: 'main',
    label: 'Table Seating',
    href: '/owner/tables',
    icon: Armchair,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'bookings',
    category: 'main',
    label: 'Bookings',
    href: '/owner/bookings',
    icon: CalendarCheck,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'calendar',
    category: 'main',
    label: 'Availability',
    href: '/owner/bookings/calendar',
    icon: CalendarDays,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'events',
    category: 'main',
    label: 'Events',
    href: '/owner/events',
    icon: CalendarDays,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'orders',
    category: 'orders',
    label: 'Food Orders',
    href: '/owner/orders',
    icon: ShoppingBag,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'menu',
    category: 'orders',
    label: 'Menu Management',
    href: '/owner/menu',
    icon: UtensilsCrossed,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'offers',
    category: 'orders',
    label: 'Discounts & Offers',
    href: '/owner/offers',
    icon: BadgePercent,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'delivery-staff',
    category: 'orders',
    label: 'Delivery Staff',
    href: '/owner/delivery-staff',
    icon: Bike,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'fulfilment',
    category: 'orders',
    label: 'Fulfilment Settings',
    href: '/owner/fulfilment',
    icon: SlidersHorizontal,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'driver-portal',
    category: 'orders',
    label: 'Driver App Portal',
    href: '/delivery',
    icon: ExternalLink,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'campaigns',
    category: 'marketing',
    label: 'Campaigns',
    href: '/owner/campaigns',
    icon: Megaphone,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'customers',
    category: 'marketing',
    label: 'Customers',
    href: '/owner/customers',
    icon: Users,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'reviews',
    category: 'marketing',
    label: 'Reviews',
    href: '/owner/reviews',
    icon: Star,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'analytics',
    category: 'marketing',
    label: 'Analytics',
    href: '/owner/analytics',
    icon: BarChart3,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'payments',
    category: 'finance',
    label: 'Payments',
    href: '/owner/payments',
    exact: true,
    icon: CreditCard,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'settlements',
    category: 'finance',
    label: 'Settlements',
    href: '/owner/payments/settlements',
    icon: ArrowRightLeft,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'refunds',
    category: 'finance',
    label: 'Refunds',
    href: '/owner/payments/refunds',
    icon: RefreshCw,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'account',
    category: 'finance',
    label: 'Payment Account',
    href: '/owner/payments/account',
    icon: ShieldCheck,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'notifications',
    category: 'system',
    label: 'Notifications',
    href: '/owner/notifications',
    icon: Bell,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'settings',
    category: 'system',
    label: 'Settings',
    href: '/owner/settings',
    icon: Settings,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
  },
  {
    id: 'support',
    category: 'system',
    label: 'Help & Support',
    href: '/owner/support',
    icon: HelpCircle,
    activeBg: 'bg-gradient-to-r from-[#E50914] to-[#E50914] text-white shadow-md shadow-[#E50914]/25 border-[#E50914]',
    inactiveBg: 'bg-white hover:bg-[#FFF5F5] text-[#252525] border-[#FEE2E2] hover:border-[#E50914]/30 shadow-2xs',
    iconColor: 'text-[#E50914]',
    activeIconColor: 'text-amber-200'
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

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const isRestaurantOwner = 
    role === 'RESTAURANT_OWNER' || 
    user?.role === 'RESTAURANT_OWNER' || 
    user?.user_type === 'RESTAURANT_OWNER' ||
    user?.roles?.name === 'RESTAURANT_OWNER' ||
    String(role || '').toUpperCase().includes('RESTAURANT') ||
    String(user?.role || '').toUpperCase().includes('RESTAURANT') ||
    String(user?.user_type || '').toUpperCase().includes('RESTAURANT');

  const isWalkingCafe = 
    role === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    String(role || '').toUpperCase().includes('WALKING') ||
    String(user?.role || '').toUpperCase().includes('WALKING');

  const filteredTabs = menuTabs.filter((tab) => {
    if (isWalkingCafe) {
      if (tab.id === 'events' || tab.id === 'tables' || tab.id === 'bookings' || tab.category === 'finance' || tab.id === 'support' || tab.id === 'analytics') {
        return false;
      }
    }
    if (isRestaurantOwner) {
      if (tab.id === 'events') {
        return false;
      }
    }
    if (activeCategory === 'all') return true;
    return tab.category === activeCategory;
  }).map((tab) => {
    if (isRestaurantOwner && tab.id === 'cafes') {
      return { ...tab, label: 'Restaurant Management' };
    }
    return tab;
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
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] w-full bg-[#FFF5F5] flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl rounded-t-3xl border-t-2 border-[#EF5350]/60 ${
          isMobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle Top Bar */}
        <div className="w-12 h-1.5 rounded-full bg-[#E50914]/30 mx-auto my-2.5 shrink-0" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E50914]/15 bg-[#FFF5F5] shrink-0">
          <Link href="/owner/dashboard" onClick={closeMobileSidebar} className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E50914]/10 to-surface shadow-xs border border-[#E50914]/20 p-0.5">
              <img src="/grab-it-logo.png" alt="Grab2GO Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#252525] tracking-tight leading-none">Grab2GO</span>
              <span className="text-[9px] font-bold text-[#E50914] uppercase tracking-widest leading-none mt-0.5">Owner Portal Navigation</span>
            </div>
          </Link>
          <button 
            onClick={closeMobileSidebar}
            className="p-1.5 text-[#252525]/60 hover:text-[#E50914] hover:bg-[#E50914]/10 rounded-2xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-3 pt-3 pb-2 border-b border-[#E50914]/10 bg-white/70 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Tabs' },
              { id: 'main', label: 'Main' },
              { id: 'orders', label: 'Orders & Delivery' },
              { id: 'marketing', label: 'Marketing' },
              ...(!isWalkingCafe ? [{ id: 'finance', label: 'Finance' }] : []),
              { id: 'system', label: 'System' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Tabs 2-Column Row-Wise Grid */}
        <div className="flex-1 overflow-y-auto p-3.5 grid grid-cols-2 gap-2.5 content-start custom-scrollbar max-h-[60vh] bg-[#FFF5F5]/30">
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
                className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200 min-h-[96px] relative overflow-hidden group ${
                  isActive ? tab.activeBg : tab.inactiveBg
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-2xs' 
                      : 'bg-[#FFF5F5] border border-[#EF5350]/60 text-[#E50914] shadow-2xs'
                  }`}>
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-amber-300 shadow-xs animate-pulse shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FEE2E2] group-hover:bg-[#B71C1C] transition-colors shrink-0" />
                  )}
                </div>
                <span className={`text-xs font-black tracking-tight mt-2.5 line-clamp-2 leading-tight ${
                  isActive ? 'text-white' : 'text-[#252525]'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer Logout */}
        <div className="p-3 border-t border-[#E50914]/15 bg-white shrink-0 pb-6">
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
