import React from 'react';
import { 
  Users, 
  Clock, 
  Edit2, 
  Trash2, 
  Check, 
  PartyPopper, 
  Briefcase, 
  Cake, 
  Music, 
  HeartHandshake, 
  Sparkles, 
  Eye,
  CheckCircle2,
  Package,
  Layers,
  Sparkle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/utils/cn';

const CATEGORY_THEMES = {
  Birthday: {
    bg: 'from-amber-500/10 via-orange-500/5 to-transparent',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    iconColor: 'text-amber-700',
    accent: 'bg-amber-600',
    border: 'border-amber-200/80 hover:border-amber-500/50'
  },
  Anniversary: {
    bg: 'from-rose-500/10 via-pink-500/5 to-transparent',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
    iconColor: 'text-rose-700',
    accent: 'bg-rose-600',
    border: 'border-rose-200/80 hover:border-rose-500/50'
  },
  'Corporate Meeting': {
    bg: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    iconColor: 'text-indigo-700',
    accent: 'bg-indigo-600',
    border: 'border-indigo-200/80 hover:border-indigo-500/50'
  },
  Party: {
    bg: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    iconColor: 'text-purple-700',
    accent: 'bg-purple-600',
    border: 'border-purple-200/80 hover:border-purple-500/50'
  },
  Default: {
    bg: 'from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent',
    badge: 'bg-[#FAF0E6] text-[#6F4E37] border-[#DDB892]',
    iconColor: 'text-[#6F4E37]',
    accent: 'bg-[#6F4E37]',
    border: 'border-[#DDB892]/80 hover:border-[#6F4E37]/50'
  }
};

export const EventCard = ({ event, onDelete }) => {
  const eventType = event.event_type || event.category || 'Birthday';
  const packageName = event.package_name || 'Custom Package';
  const price = Number(event.price || event.base_price || 0);
  const maxGuests = event.maximum_persons || event.max_guests || event.minimum_persons;
  
  let durationText = null;
  if (event.duration_value) {
    durationText = `${event.duration_value} ${event.duration_unit || 'Hours'}`;
  } else if (event.duration_hours) {
    durationText = `${event.duration_hours} Hours`;
  } else if (event.duration) {
    durationText = String(event.duration);
  }

  let inclusionsList = [];
  if (Array.isArray(event.inclusions)) {
    inclusionsList = event.inclusions;
  } else if (typeof event.inclusions === 'string') {
    try {
      inclusionsList = JSON.parse(event.inclusions);
    } catch (e) {
      inclusionsList = [];
    }
  }

  const displayedInclusions = inclusionsList.slice(0, 4);
  const remainingInclusionsCount = Math.max(0, inclusionsList.length - 4);

  const getEventIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('birth')) return Cake;
    if (t.includes('wed') || t.includes('anniver') || t.includes('date') || t.includes('couple')) return HeartHandshake;
    if (t.includes('work') || t.includes('corpor') || t.includes('meet')) return Briefcase;
    if (t.includes('music')) return Music;
    return PartyPopper;
  };

  const Icon = getEventIcon(eventType);
  const theme = CATEGORY_THEMES[eventType] || CATEGORY_THEMES.Default;

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between text-[#2C1810] relative group hover:-translate-y-1 hover:shadow-xl shadow-xs overflow-hidden",
      theme.border
    )}>
      {/* Top Accent Gradient Bar */}
      <div className={cn("px-4 py-3 bg-gradient-to-r border-b border-stone-100 flex items-center justify-between relative", theme.bg)}>
        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-2xs backdrop-blur-xs", theme.badge)}>
          <Icon className={cn("w-3.5 h-3.5 stroke-[2.5]", theme.iconColor)} />
          <span className="truncate max-w-[140px]">{eventType}</span>
        </div>

        {event.status && (
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border shadow-2xs flex items-center gap-1",
            event.status === 'PUBLISHED' || event.status === 'ACTIVE' || event.is_active !== false
              ? "bg-emerald-500 text-white border-emerald-600"
              : "bg-amber-500 text-white border-amber-600"
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {event.status === 'PUBLISHED' || event.status === 'ACTIVE' || event.is_active !== false ? 'Active' : 'Draft'}
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3.5">
        
        {/* Header: Title, Description, and Price Strip */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-black text-[#2C1810] line-clamp-1 leading-snug group-hover:text-[#6F4E37] transition-colors">
              {packageName}
            </h3>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-[#6F4E37] tracking-tight">
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-stone-400 block -mt-0.5">/package</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed font-medium">
            {event.description || 'Custom tailored event celebration package for your guests.'}
          </p>

          {/* Quick Specs Badges: Guests & Hours */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {maxGuests && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-[11px] font-bold">
                <Users className="w-3 h-3 text-amber-700 stroke-[2.2]" />
                <span>Up to {maxGuests} Guests</span>
              </span>
            )}

            {durationText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50/80 border border-sky-200/60 text-sky-900 text-[11px] font-bold">
                <Clock className="w-3 h-3 text-sky-700 stroke-[2.2]" />
                <span>{durationText}</span>
              </span>
            )}
          </div>
        </div>

        {/* Inclusions Compact Strip */}
        {inclusionsList.length > 0 && (
          <div className="pt-2.5 border-t border-stone-100/80 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-stone-400">
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3 text-[#6F4E37]" />
                <span>Inclusions ({inclusionsList.length})</span>
              </span>
            </div>

            <div className="space-y-1">
              {displayedInclusions.slice(0, 2).map((inc, index) => {
                const incName = typeof inc === 'string' ? inc : inc.name || inc.inclusion_name || inc.category;
                const qtyText = (inc.quantity && inc.unit) ? `${inc.quantity} ${inc.unit}` : null;

                return (
                  <div key={inc.id || index} className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-100 text-[11px] font-medium text-stone-700">
                    <div className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{incName}</span>
                    </div>

                    {qtyText && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[#6F4E37] shrink-0 ml-1">
                        {qtyText}
                      </span>
                    )}
                  </div>
                );
              })}

              {inclusionsList.length > 2 && (
                <span className="text-[10px] font-bold text-[#6F4E37] pl-1 block">
                  +{inclusionsList.length - 2} more item{inclusionsList.length - 2 > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interactive Action Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <Link href={`/owner/events/${event.id}/edit`} className="flex-1">
            <button 
              type="button"
              className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:border-[#6F4E37] hover:bg-[#FFF8F0] text-xs font-bold text-stone-700 hover:text-[#6F4E37] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </Link>

          <Link href={`/owner/events/${event.id}`} className="flex-1">
            <button 
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#593E2B] hover:brightness-105 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3 h-3 text-amber-200" />
              <span>Manage</span>
            </button>
          </Link>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event)}
              className="w-8 h-8 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
              title="Delete Package"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

