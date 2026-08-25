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
  CheckCircle2, 
  XCircle, 
  PartyPopper, 
  Utensils, 
  Cake, 
  Music, 
  Sparkles, 
  Info, 
  ListChecks, 
  Image as ImageIcon,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const EventDetails = ({ event }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const eventType = event.event_type || event.inclusions?.event_type || 'Special Event Package';
  const isFoodIncluded = event.food || event.inclusions?.food;
  const isCakeIncluded = event.cake || event.inclusions?.cake;
  const isDecorIncluded = event.decoration || event.inclusions?.decoration;
  const isMusicIncluded = event.music || event.inclusions?.music;
  const isOtherIncluded = event.other || event.inclusions?.other;

  const inclusions = [
    { label: 'Food & Dining Spread', isIncluded: isFoodIncluded, icon: Utensils, desc: 'Curated menu platters & beverage servings' },
    { label: 'Special Event Cake', isIncluded: isCakeIncluded, icon: Cake, desc: 'Customized celebration cake setup' },
    { label: 'Party Theme Decoration', isIncluded: isDecorIncluded, icon: Sparkles, desc: 'Balloons, floral arrangements & backdrop setup' },
    { label: 'Sound System & Music / DJ', isIncluded: isMusicIncluded, icon: Music, desc: 'Acoustic speakers or DJ music setup' },
    { label: 'Additional Host Services', isIncluded: isOtherIncluded, icon: PartyPopper, desc: 'Extra service staff & party props' },
  ];

  const galleryImages = Array.isArray(event.gallery) ? event.gallery : [];

  return (
    <div className="space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Cover Banner */}
      <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-2xs relative">
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
              <h2 className="text-2xl font-black">{event.package_name}</h2>
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

      {/* 4 Quick Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Category</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810] truncate">{eventType}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Seating Capacity</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810]">
            {event.minimum_persons || 1} - {event.maximum_persons || 'Flexible'} Guests
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Duration</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-[#2C1810]">
            {event.duration_hours ? `${event.duration_hours} Hours` : 'Flexible Duration'}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Base Price</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-black text-[#6F4E37]">₹{event.price}</p>
        </div>
      </div>

      {/* Interactive Tabs Header & Content Canvas */}
      <div className="bg-white rounded-3xl border border-border/60 shadow-2xs p-5 sm:p-6 space-y-6">
        
        {/* Tab Selector Switcher */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Description', icon: Info },
            { id: 'inclusions', label: 'Inclusions & Amenities', icon: ListChecks },
            { id: 'gallery', label: `Photo Gallery (${galleryImages.length})`, icon: ImageIcon },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0",
                  isActive 
                    ? "bg-[#6F4E37] text-white shadow-2xs" 
                    : "bg-surface/50 text-[#2C1810] hover:bg-surface"
                )}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Canvas Content */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810] mb-2">About this Event Experience</h3>
                <p className="text-xs sm:text-sm text-text/70 leading-relaxed whitespace-pre-wrap">
                  {event.description || 'No detailed package description provided.'}
                </p>
              </div>

              {/* Host Cafe Detail Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C1810]">Hosted at {event.cafe?.name || 'Cafe Venue'}</h4>
                  <p className="text-xs text-text/60 mt-0.5">
                    This event package is configured and hosted exclusively at this venue.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INCLUSIONS */}
          {activeTab === 'inclusions' && (
            <motion.div 
              key="inclusions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Package Inclusions & Features</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {inclusions.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex items-start justify-between gap-3",
                        item.isIncluded 
                          ? "bg-emerald-500/5 border-emerald-500/30" 
                          : "bg-surface/30 border-border/40 opacity-70"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                          item.isIncluded ? "bg-emerald-500/10 text-emerald-700" : "bg-surface text-text/40"
                        )}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#2C1810]">{item.label}</p>
                          <p className="text-[10px] text-text/50 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 flex items-center gap-1",
                        item.isIncluded 
                          ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30" 
                          : "bg-surface text-text/50 border border-border/40"
                      )}>
                        {item.isIncluded ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Included</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-text/40" />
                            <span>Not Included</span>
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Package Photo Showcase</h3>

              {galleryImages.length === 0 ? (
                <div className="p-8 text-center bg-surface/30 rounded-2xl border border-border/40 text-xs text-text/50">
                  No additional gallery photos uploaded for this package yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="h-36 rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-2xs group relative">
                      <img 
                        src={typeof img === 'string' ? img : img.url} 
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
