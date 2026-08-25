'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, MapPin, Users, KeySquare, 
  CalendarCheck, CreditCard, Bell, Shield, 
  Palette, Receipt 
} from 'lucide-react';
import { cn } from '@/utils/cn';

const SETTINGS_GROUPS = [
  {
    title: 'Business Information',
    items: [
      { name: 'Profile Details', href: '/owner/settings/profile', icon: Building2 },
    ]
  }
];

export const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-8 lg:pr-6 border-r-0 lg:border-r border-border/50 h-full">
      {SETTINGS_GROUPS.map((group, i) => (
        <div key={i}>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-text/40 mb-3 px-3">
            {group.title}
          </h4>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.disabled ? '#' : item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    item.disabled ? "opacity-50 cursor-not-allowed" : "",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-text/70 hover:bg-surface hover:text-text"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-text/40 group-hover:text-primary")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
};
