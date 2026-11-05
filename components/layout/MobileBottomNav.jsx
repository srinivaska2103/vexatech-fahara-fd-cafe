'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag,
  Bike,
  UtensilsCrossed,
  Download,
  LayoutDashboard, 
  CalendarCheck, 
  Store, 
  Menu, 
  Plus, 
  X, 
  Sparkles, 
  Building2, 
  CreditCard, 
  HelpCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useLayoutStore } from '@/store/layout.store';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const openMobileSidebar = useLayoutStore((state) => state.openMobileSidebar);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/owner/bookings', icon: CalendarCheck },
    { label: 'Cafes', href: '/owner/cafes', icon: Store },
  ];

  const quickActions = [
    {
      title: 'Install Grab2GO Mobile App',
      description: 'Add app directly to home screen for fast mobile access',
      action: () => {
        if (typeof window !== 'undefined') {
          // Trigger click on navbar install button or prompt
          const installBtn = document.querySelector('button[title="Install Grab2GO Partner App"]');
          if (installBtn) {
            installBtn.click();
          }
        }
      },
      icon: Download,
      color: 'bg-gradient-to-r from-red-600 to-[#B71C1C] text-white',
    },
    {
      title: 'Food Orders',
      description: 'Live orders, preparation and delivery statuses',
      href: '/owner/orders',
      icon: ShoppingBag,
      color: 'bg-[#E50914] text-white',
    },
    {
      title: 'Delivery Staff',
      description: 'Manage riders and delivery fleet assignments',
      href: '/owner/delivery-staff',
      icon: Bike,
      color: 'bg-emerald-600 text-white',
    },
    {
      title: 'Menu Management',
      description: 'Update dishes, prices, categories and availability',
      href: '/owner/menu',
      icon: UtensilsCrossed,
      color: 'bg-orange-600 text-white',
    },
    {
      title: 'Add New Venue',
      description: 'Create a venue profile to receive customer bookings',
      href: '/owner/cafes/create',
      icon: Building2,
      color: 'bg-indigo-600 text-white',
    },
    {
      title: 'Create Event Package',
      description: 'Setup special occasion event offerings',
      href: '/owner/events/create',
      icon: Sparkles,
      color: 'bg-[#B71C1C] text-white',
    },
    {
      title: 'View Active Bookings',
      description: 'Inspect and manage incoming reservations',
      href: '/owner/bookings',
      icon: CalendarCheck,
      color: 'bg-emerald-600 text-white',
    },
    {
      title: 'Setup Bank & Settlements',
      description: 'Verify bank details for automatic Razorpay payouts',
      href: '/owner/payments/account',
      icon: CreditCard,
      color: 'bg-blue-600 text-white',
    },
  ];

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const isWalkingCafe = 
    role === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    String(role || '').toUpperCase().includes('WALKING') ||
    String(user?.role || '').toUpperCase().includes('WALKING');

  const isRestaurant = 
    role === 'RESTAURANT_OWNER' || 
    user?.role === 'RESTAURANT_OWNER' || 
    String(role || '').toUpperCase().includes('RESTAURANT') ||
    String(user?.role || '').toUpperCase().includes('RESTAURANT');

  const filteredQuickActions = quickActions.filter((action) => {
    if (action.href === '/owner/events/create' && (isWalkingCafe || isRestaurant)) {
      return false;
    }
    if (isWalkingCafe) {
      if (action.href === '/owner/payments/account' || action.href === '/owner/bookings') {
        return false;
      }
    }
    return true;
  });

  const handleActionClick = (action) => {
    setIsQuickActionsOpen(false);
    if (action.action) {
      action.action();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <>
      {/* Quick Actions Backdrop & Bottom Sheet */}
      <AnimatePresence>
        {isQuickActionsOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsQuickActionsOpen(false)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-10 bg-[#FFF5F5] border-t-2 border-[#EF5350]/60 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#E50914]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E50914]/10 flex items-center justify-center text-[#E50914]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#252525]">Owner Quick Actions</h3>
                    <p className="text-[11px] text-[#252525]/60">Fast portal shortcuts and operations</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="p-1.5 rounded-full text-[#252525]/50 hover:bg-[#E50914]/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {filteredQuickActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(item)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EF5350]/40 hover:border-[#E50914]/40 shadow-xs hover:shadow-sm text-left transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#252525]">{item.title}</h4>
                          <p className="text-[10px] text-[#252525]/60 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#252525]/40 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#FFF5F5]/95 backdrop-blur-md border-t border-[#EF5350]/60 rounded-t-3xl sm:rounded-t-[32px] shadow-[0_-8px_30px_rgba(44,24,16,0.15)] px-3 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          
          {/* Dashboard Item */}
          <Link
            href="/owner/dashboard"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === '/owner/dashboard' ? 'text-[#E50914] font-extrabold' : 'text-[#252525]/60 hover:text-[#E50914]'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${pathname === '/owner/dashboard' ? 'text-[#E50914] scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </Link>

          {/* Bookings or Analytics Item */}
          {isWalkingCafe ? (
            <Link
              href="/owner/analytics"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                pathname.startsWith('/owner/analytics') ? 'text-amber-700 font-extrabold' : 'text-[#252525]/60 hover:text-amber-700'
              }`}
            >
              <TrendingUp className={`w-5 h-5 ${pathname.startsWith('/owner/analytics') ? 'text-amber-700 scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5">Analytics</span>
            </Link>
          ) : (
            <Link
              href="/owner/bookings"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                pathname.startsWith('/owner/bookings') ? 'text-emerald-700 font-extrabold' : 'text-[#252525]/60 hover:text-emerald-700'
              }`}
            >
              <CalendarCheck className={`w-5 h-5 ${pathname.startsWith('/owner/bookings') ? 'text-emerald-700 scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5">Bookings</span>
            </Link>
          )}

          {/* Center Floating Quick Actions (+) Button */}
          <div className="flex flex-col items-center justify-center flex-1 relative">
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="absolute -top-6 w-13 h-13 rounded-full bg-gradient-to-r from-[#E50914] via-[#E50914] to-[#B71C1C] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/40 ring-4 ring-[#FFF5F5] active:scale-95 transition-all"
              title="Quick Actions"
            >
              <Plus className={`w-7 h-7 transition-transform duration-300 ${isQuickActionsOpen ? 'rotate-45' : ''}`} />
            </button>
            <span className="text-[10px] font-extrabold text-[#E50914] tracking-tight mt-7">Actions</span>
          </div>

          {/* Cafes / Restaurants or Food Orders Item */}
          {isRestaurant ? (
            <Link
              href="/owner/orders"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                pathname.startsWith('/owner/orders') ? 'text-[#E50914] font-extrabold' : 'text-[#252525]/60 hover:text-[#E50914]'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 ${pathname.startsWith('/owner/orders') ? 'text-[#E50914] scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5">Orders</span>
            </Link>
          ) : (
            <Link
              href="/owner/cafes"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                pathname.startsWith('/owner/cafes') ? 'text-[#E50914] font-extrabold' : 'text-[#252525]/60 hover:text-[#E50914]'
              }`}
            >
              <Store className={`w-5 h-5 ${pathname.startsWith('/owner/cafes') ? 'text-[#E50914] scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5">Cafes</span>
            </Link>
          )}

          {/* Menu Drawer Toggle */}
          <button
            onClick={openMobileSidebar}
            className="flex flex-col items-center justify-center flex-1 py-1 text-[#252525]/60 hover:text-[#E50914] transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};
