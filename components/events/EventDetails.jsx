'use client';
import React, { useState } from 'react';
import { EventStatusBadge } from './EventStatusBadge';
import { 
  Store, 
  Users, 
  Clock, 
  IndianRupee, 
  Tag, 
  Edit2, 
  Check, 
  PartyPopper, 
  Cake, 
  Music, 
  Sparkles, 
  Info, 
  ListChecks, 
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const EventDetails = ({ event }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const eventType = event.event_type || event.category || 'Special Event Package';

  // Parse inclusions
  let inclusionsList = [];
  if (Array.isArray(event.inclusions)) {
    inclusionsList = event.inclusions;
  } else if (typeof event.inclusions === 'string') {
    try { inclusionsList = JSON.parse(event.inclusions); } catch (e) { inclusionsList = []; }
  }

  const galleryImages = Array.isArray(event.gallery) ? event.gallery : [];
  const price = Number(event.price || event.base_price || 0);

  // Duration text
  let durationText = null;
  if (event.duration_value) {
    durationText = `${event.duration_value} ${event.duration_unit || 'Hours'}`;
  } else if (event.duration_hours) {
    durationText = `${event.duration_hours} Hours`;
  }

  return (
    <div className="space-y-6 text-[#2C1810]">
      
      {/* Hero Cover Banner */}
      <div className="bg-white rounded-3xl border border-[#E8DED5] overflow-hidden shadow-2xs relative">
        <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-gradient-to-r from-[#6F4E37] via-[#A67B5B] to-[#DDB892]">
          {event.cover_image ? (
            <img 
              src={event.cover_image} 
              alt={event.package_name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              <PartyPopper className="w-12 h-12 mb-2 opacity-80" />
              <h2 className="text-2xl font-black">{event.package_name || 'Event Package'}</h2>
              <p className="text-xs opacity-80 mt-1">Available at {event.cafe?.name || 'Cafe Venue'}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

          {/* Action Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button 
              onClick={() => router.push('/owner/events')}
              className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs text-[#2C1810] hover:bg-white flex items-center justify-center shadow-2xs transition-all"
              title="Back to Events"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <EventStatusBadge status={event.status || 'PUBLISHED'} />
              <Link href={`/owner/events/${event.id}/edit`}>
                <Button className="py-2 px-4 rounded-xl bg-white text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white font-extrabold text-xs shadow-2xs flex items-center gap-1.5 transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Package</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Title & Cafe Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold tracking-wider uppercase">
                {eventType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
              {event.package_name}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Available at {event.cafe?.name || 'Cafe Venue'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#2C1810]/50 uppercase tracking-wider">Price</span>
          <p className="text-lg sm:text-xl font-black text-[#6F4E37]">₹{price.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#2C1810]/50 uppercase tracking-wider">Category</span>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810] truncate">{eventType}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#2C1810]/50 uppercase tracking-wider">Max Guests</span>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810]">
            {event.maximum_persons || event.max_guests ? `Up to ${event.maximum_persons || event.max_guests} Guests` : 'Flexible'}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#2C1810]/50 uppercase tracking-wider">Duration</span>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810]">
            {durationText || 'Flexible'}
          </p>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8DED5] shadow-2xs p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E8DED5] pb-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Description', icon: Info },
            { id: 'inclusions', label: `What's Included (${inclusionsList.length})`, icon: ListChecks },
            { id: 'gallery', label: `Photo Gallery (${galleryImages.length})`, icon: ImageIcon },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0",
                  isActive 
                    ? "bg-[#6F4E37] text-white shadow-2xs" 
                    : "bg-[#FFF8F0] text-[#2C1810] hover:bg-[#E8DED5]"
                )}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Package Description</h3>
                <p className="text-xs sm:text-sm text-[#2C1810]/70 leading-relaxed whitespace-pre-wrap">
                  {event.description || 'No detailed package description provided.'}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'inclusions' && (
            <motion.div 
              key="inclusions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Custom Package Inclusions</h3>

              {inclusionsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inclusionsList.map((inc, idx) => {
                    const name = typeof inc === 'string' ? inc : inc.name || inc.inclusion_name;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-white border border-[#E8DED5] flex items-start gap-3 shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#2C1810] text-xs">{name}</h4>
                          {inc.description && <p className="text-[11px] text-[#2C1810]/60 mt-0.5">{inc.description}</p>}
                          {inc.quantity && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#E8DED5]">
                              Qty: {inc.quantity} {inc.unit || ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#FFF8F0]/40 rounded-xl border border-[#E8DED5] text-xs text-[#2C1810]/50">
                  No inclusions added to this package.
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Photo Showcase</h3>
              {galleryImages.length === 0 ? (
                <div className="p-8 text-center bg-[#FFF8F0]/40 rounded-xl border border-[#E8DED5] text-xs text-[#2C1810]/50">
                  No additional gallery photos uploaded.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="h-36 rounded-xl overflow-hidden border border-[#E8DED5] bg-[#FFF8F0] shadow-2xs">
                      <img 
                        src={typeof img === 'string' ? img : img.url} 
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
