'use client';
import React from 'react';
import { 
  Armchair, 
  Store, 
  Megaphone, 
  Star, 
  BarChart3, 
  CalendarPlus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export const QuickActionsGrid = ({ isWalkingCafe = false }) => {
  const actions = [
    {
      title: 'Manage Tables',
      description: 'Configure indoor/outdoor seating layouts',
      icon: Armchair,
      href: '/owner/tables',
      color: 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70',
      badge: 'Seating'
    },
    {
      title: 'Create Event Package',
      description: 'Offer dining parties & special celebration bundles',
      icon: CalendarPlus,
      href: '/owner/events',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70',
      badge: 'Packages'
    },
    {
      title: 'Edit Cafe',
      description: 'Update cafe profile, photos, and timings',
      icon: Store,
      href: '/owner/cafes',
      color: 'bg-orange-50 text-orange-900 border-orange-200/80 hover:bg-orange-100/70',
      badge: 'Venue'
    },
    {
      title: 'Create Campaign',
      description: 'Launch promotional discounts & marketing deals',
      icon: Megaphone,
      href: '/owner/campaigns',
      color: 'bg-purple-50 text-purple-900 border-purple-200/80 hover:bg-purple-100/70',
      badge: 'Marketing'
    },
    {
      title: 'Customer Reviews',
      description: 'Check diner ratings & reply to customer feedback',
      icon: Star,
      href: '/owner/reviews',
      color: 'bg-rose-50 text-rose-900 border-rose-200/80 hover:bg-rose-100/70',
      badge: 'Feedback'
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into revenue trends and traffic insights',
      icon: BarChart3,
      href: '/owner/analytics',
      color: 'bg-blue-50 text-blue-900 border-blue-200/80 hover:bg-blue-100/70',
      badge: 'Insights'
    }
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border/70 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#2C1810]">Quick Operations</h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Shortcuts</span>
            </span>
          </div>
          <p className="text-xs text-text/50">Fast access to everyday venue management tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-sm ${act.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white/90 shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                  {act.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#2C1810] leading-tight">
                  {act.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
