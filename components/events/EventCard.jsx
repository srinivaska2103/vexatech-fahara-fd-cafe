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
      "bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full text-[#2C1810] relative group",
      theme.border
    )}>
      {/* Dynamic Colored Header Banner */}
      <div className={cn("p-5 pb-4 bg-gradient-to-br border-b border-stone-100 flex items-center justify-between relative overflow-hidden", theme.bg)}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs backdrop-blur-xs", theme.badge)}>
          <Icon className={cn("w-4 h-4", theme.iconColor)} />
          <span className="truncate max-w-[170px]">{eventType}</span>
        </div>

        {event.status && (
          <span className={cn(
            "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-2xs flex items-center gap-1.5",
            event.status === 'PUBLISHED' || event.status === 'ACTIVE' || event.is_active !== false
              ? "bg-emerald-500 text-white border-emerald-600"
              : "bg-amber-500 text-white border-amber-600"
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {event.status === 'PUBLISHED' || event.status === 'ACTIVE' || event.is_active !== false ? 'Active' : 'Draft'}
          </span>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        
        {/* Package Title & Price */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#2C1810] line-clamp-1 leading-snug group-hover:text-[#6F4E37] transition-colors">
            {packageName}
          </h3>

          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-3xl font-black text-[#6F4E37] tracking-tight">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-stone-500">/ package</span>
          </div>
        </div>

        {/* Capacity & Duration Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {maxGuests && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-extrabold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Up to {maxGuests} Guests</span>
            </div>
          )}

          {durationText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-900 text-xs font-extrabold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-cyan-700" />
              <span>{durationText}</span>
            </div>
          )}
        </div>

        {/* Package Description */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
          {event.description || 'Custom tailored event celebration package for your guests.'}
        </p>

        {/* Custom Inclusions Showcase */}
        {inclusionsList.length > 0 && (
          <div className="pt-3 border-t border-stone-100 space-y-2.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Package Inclusions ({inclusionsList.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {displayedInclusions.map((inc, index) => {
                const incName = typeof inc === 'string' ? inc : inc.name || inc.inclusion_name || inc.category;
                const qtyText = (inc.quantity && inc.unit) ? `${inc.quantity} ${inc.unit}` : null;

                return (
                  <div key={inc.id || index} className="flex items-center justify-between p-2 rounded-xl bg-stone-50/80 border border-stone-100 text-xs font-bold text-stone-800">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{incName}</span>
                    </div>

                    {qtyText && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[#6F4E37] shrink-0">
                        {qtyText}
                      </span>
                    )}
                  </div>
                );
              })}

              {remainingInclusionsCount > 0 && (
                <p className="text-[11px] font-extrabold text-[#6F4E37] pl-1">
                  + {remainingInclusionsCount} more inclusions...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Card Action Controls */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2.5">
          <Link href={`/owner/events/${event.id}/edit`} className="flex-1">
            <Button 
              type="button"
              variant="outline"
              className="w-full py-2.5 px-4 rounded-xl border-stone-200 hover:border-[#6F4E37] text-xs font-extrabold text-stone-800 hover:text-[#6F4E37] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>
          </Link>

          <Link href={`/owner/events/${event.id}`} className="flex-1">
            <Button 
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] via-[#593E2B] to-[#452718] hover:from-[#593E2B] hover:to-[#2C1810] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-[#6F4E37]/20 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Manage</span>
            </Button>
          </Link>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event)}
              className="w-9 h-9 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 flex items-center justify-center transition-all shrink-0 cursor-pointer"
              title="Delete Package"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

