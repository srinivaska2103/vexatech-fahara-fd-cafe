'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Crown, Sparkles, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';

/**
 * Calculates remaining days until subscription expiry using actual currentPeriodEnd timestamp
 */
export function getSubscriptionExpiryState(subscription, status, isActive) {
  if (!subscription) {
    if (status === 'EXPIRED') {
      return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
    }
    if (status === 'INACTIVE' || status === 'CANCELLED') {
      return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription inactive', shortText: 'Inactive', badgeType: 'expired' };
    }
    return { state: 'NO_SUB', text: 'No active plan', shortText: 'Subscribe', badgeType: 'neutral' };
  }

  // If backend explicitly marked status as EXPIRED
  const subStatus = String(subscription.status || status || '').toUpperCase();
  if (subStatus === 'EXPIRED') {
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const periodEndRaw = subscription.currentPeriodEnd || subscription.current_period_end;
  if (!periodEndRaw) {
    if (isActive) {
      return { state: 'ACTIVE_NO_EXPIRY', text: 'Subscription active', shortText: 'Active', badgeType: 'active' };
    }
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const expiryDate = new Date(periodEndRaw);
  const now = new Date();

  // If invalid date string
  if (isNaN(expiryDate.getTime())) {
    if (isActive) {
      return { state: 'ACTIVE_NO_EXPIRY', text: 'Subscription active', shortText: 'Active', badgeType: 'active' };
    }
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const diffMs = expiryDate.getTime() - now.getTime();

  // Expired check
  if (diffMs <= 0) {
    return { 
      state: 'EXPIRED', 
      daysLeft: 0, 
      text: 'Subscription expired', 
      shortText: 'Expired', 
      badgeType: 'expired' 
    };
  }

  // Calculate days remaining (ceiling so partial days count towards today or full day)
  const diffHours = diffMs / (1000 * 60 * 60);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // If expires within the same day / less than 24 hours
  if (diffHours <= 24) {
    return {
      state: 'EXPIRES_TODAY',
      daysLeft: 0,
      text: 'Subscription expires today',
      shortText: 'Expires today',
      badgeType: 'urgent'
    };
  }

  // 1 to 7 days left (Warning color)
  if (daysLeft <= 7) {
    return {
      state: 'WARNING',
      daysLeft,
      text: `Subscription · ${daysLeft} day${daysLeft > 1 ? 's' : ''} left`,
      shortText: `${daysLeft}d left`,
      badgeType: 'warning'
    };
  }

  // More than 7 days left (Normal active coffee brand color)
  return {
    state: 'NORMAL',
    daysLeft,
    text: `Subscription · ${daysLeft} days left`,
    shortText: `${daysLeft} days left`,
    badgeType: 'normal'
  };
}

export const SubscriptionBadge = ({ className }) => {
  const { subscription, status, isActive, isLoading, hasFetched, fetchSubscription } = useSubscriptionStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.id && (!hasFetched || typeof fetchSubscription === 'function')) {
      fetchSubscription();
    }
  }, [user?.id, hasFetched, fetchSubscription]);

  // Loading or uninitialized state: subtle modern red placeholder
  if (isLoading && !hasFetched && !subscription) {
    return (
      <div className={cn("hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 text-xs animate-pulse", className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        <span className="text-[11px] font-bold">Subscription...</span>
      </div>
    );
  }

  const expiryState = getSubscriptionExpiryState(subscription, status, isActive);

  return (
    <Link
      href="/owner/subscription"
      title={`${expiryState.text} — Click to manage subscription`}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer group select-none shrink-0 shadow-sm hover:shadow-md",
        "bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white border-red-400/30 hover:brightness-105 hover:-translate-y-0.5",
        className
      )}
    >
      {/* Icon with soft glow background */}
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
        <Crown className="w-3 h-3 text-amber-200 fill-amber-300 stroke-[2.2]" />
      </div>

      {/* Main label text */}
      <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white flex items-center gap-1.5 drop-shadow-xs">
        <span className="hidden sm:inline font-semibold text-white/90">Subscription</span>
        <span className="hidden sm:inline text-white/60">·</span>
        <span className="font-extrabold text-white">
          {expiryState.daysLeft > 0 ? `${expiryState.daysLeft} days left` : expiryState.shortText}
        </span>
      </span>

      {/* Live animated pulsing indicator dot */}
      <span className="relative flex h-2 w-2 ml-0.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
      </span>
    </Link>
  );
};
