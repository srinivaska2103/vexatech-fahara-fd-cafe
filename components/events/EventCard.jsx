import React from 'react';
import { Users, Clock, Edit2, Trash2, Eye, IndianRupee, Image as ImageIcon, PartyPopper, Briefcase, Cake, Music, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';
import { EventStatusBadge } from './EventStatusBadge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export const EventCard = ({ event, onDelete }) => {
  const getEventPlaceholder = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('birth')) return { icon: Cake, colors: 'from-pink-500/20 via-pink-400/10 to-pink-500/5', text: 'text-pink-600' };
    if (t.includes('wed') || t.includes('anniver') || t.includes('couple')) return { icon: HeartHandshake, colors: 'from-rose-500/20 via-red-400/10 to-rose-500/5', text: 'text-rose-600' };
    if (t.includes('party') || t.includes('celebrat') || t.includes('fest')) return { icon: PartyPopper, colors: 'from-purple-500/20 via-fuchsia-400/10 to-purple-500/5', text: 'text-purple-600' };
    if (t.includes('work') || t.includes('corpor') || t.includes('meet') || t.includes('business')) return { icon: Briefcase, colors: 'from-blue-500/20 via-indigo-400/10 to-blue-500/5', text: 'text-blue-600' };
    if (t.includes('music') || t.includes('concert') || t.includes('dj')) return { icon: Music, colors: 'from-emerald-500/20 via-teal-400/10 to-emerald-500/5', text: 'text-emerald-600' };
    return { icon: PartyPopper, colors: 'from-[#6F4E37]/20 via-[#6F4E37]/10 to-[#6F4E37]/5', text: 'text-[#6F4E37]' };
  };

  const placeholder = getEventPlaceholder(event.package_name);
  const Icon = placeholder.icon;

  return (
    <div className="bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full text-[#2C1810]">
      
      {/* Event Header Image Canvas */}
      <div className="h-48 relative overflow-hidden bg-[#FFF8F0]">
        {event.cover_image ? (
          <img 
            src={event.cover_image} 
            alt={event.package_name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${placeholder.colors} flex flex-col items-center justify-center p-4 text-center`}>
            <div className={`p-4 rounded-2xl bg-white/70 backdrop-blur-xs mb-2.5 shadow-2xs ${placeholder.text}`}>
              <Icon className="w-7 h-7" />
            </div>
            <span className={`font-black text-xs uppercase tracking-wider ${placeholder.text}`}>
              {event.package_name || 'Event Package'}
            </span>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <EventStatusBadge status={event.status || 'PUBLISHED'} />
        </div>

        {/* Floating Action Controls */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
          <Link href={`/owner/events/${event.id}/edit`}>
            <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white flex items-center justify-center transition-all shadow-2xs">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button 
            onClick={() => onDelete && onDelete(event)}
            className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 bg-white space-y-3">
        <div>
          <h3 className="text-base font-extrabold text-[#2C1810] truncate group-hover:text-[#6F4E37] transition-colors">
            {event.package_name}
          </h3>
          <p className="text-xs font-medium text-text/60 truncate mt-0.5">
            At {event.cafe?.name || 'Cafe Venue'}
          </p>
        </div>
        
        <p className="text-xs text-text/60 line-clamp-2 leading-relaxed flex-1">
          {event.description || 'No detailed package description provided.'}
        </p>
        
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center text-xs font-bold text-[#2C1810]">
             <Users className="w-3.5 h-3.5 mr-1.5 text-[#6F4E37] shrink-0" />
             <span className="truncate">{event.minimum_persons || 1} - {event.maximum_persons || 'Max'} Guests</span>
          </div>
          <div className="flex items-center text-xs font-bold text-[#2C1810]">
             <Clock className="w-3.5 h-3.5 mr-1.5 text-[#6F4E37] shrink-0" />
             <span className="truncate">{event.duration_hours ? `${event.duration_hours} Hours` : 'Flexible'}</span>
          </div>
        </div>

        {/* Price & View Details Action */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold text-text/50 uppercase tracking-wider block">Package Rate</span>
            <span className="text-base font-black text-[#6F4E37]">₹{event.price}</span>
          </div>

          <Link href={`/owner/events/${event.id}`}>
            <Button className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-1.5">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
