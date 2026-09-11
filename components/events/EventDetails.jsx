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

  const eventType = event.event_type || event.package_level || event.inclusions?.event_type || 'Special Event Package';

  const rawInclusions = React.useMemo(() => {
    let inc = event.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = null; }
    }

    if (Array.isArray(inc) && inc.length > 0) return inc;
    if (Array.isArray(event.package_inclusions) && event.package_inclusions.length > 0) return event.package_inclusions;

    // If inc is an object or empty, construct default 5 package feature cards with tier fallback
    const objInc = (inc && typeof inc === 'object' && !Array.isArray(inc)) ? inc : {};
    const pPrice = Number(event.price || event.base_price || 0);

    const foodItems = Array.isArray(objInc.food_items) ? objInc.food_items : [];
    const decorItems = Array.isArray(objInc.decoration_items) ? objInc.decoration_items : [];
    const cakeItems = Array.isArray(objInc.cake_items) ? objInc.cake_items : [];
    const musicItems = Array.isArray(objInc.music_items) ? objInc.music_items : [];
    const otherItems = Array.isArray(objInc.other_items) ? objInc.other_items : [];

    return [
      {
        category: 'Food & Dining',
        name: 'Food & Dining Spread',
        description: foodItems.length > 0 ? foodItems.map(f => f.name || f.title || f).join(', ') : 'Curated menu platters & beverage servings',
        pricing_type: 'PER_GUEST',
        is_included: Boolean(objInc.food || foodItems.length > 0),
        basic_price: objInc.food_basic_price ?? pPrice,
        standard_price: objInc.food_standard_price ?? Math.round(pPrice * 1.3),
        premium_price: objInc.food_premium_price ?? Math.round(pPrice * 1.6),
        basic_desc: foodItems.length > 0 ? foodItems[0]?.name : 'Standard menu options',
        standard_desc: foodItems.length > 1 ? foodItems.slice(0, 2).map(f => f.name).join(', ') : 'Expanded menu platters',
        premium_desc: foodItems.length > 0 ? foodItems.map(f => f.name).join(', ') : 'Full gourmet buffet spread'
      },
      {
        category: 'Decoration',
        name: 'Party Theme Decoration',
        description: decorItems.length > 0 ? decorItems.map(d => d.name || d.title || d).join(', ') : 'Balloons, floral arrangements & backdrop setup',
        pricing_type: 'FIXED',
        is_included: Boolean(objInc.decoration || decorItems.length > 0),
        basic_price: objInc.decor_basic_price ?? 0,
        standard_price: objInc.decor_standard_price ?? 0,
        premium_price: objInc.decor_premium_price ?? 0,
        basic_desc: 'Minimal balloon arch & banner',
        standard_desc: 'Theme floral arch, table props & backdrop',
        premium_desc: 'Grand customized theme setup with lighting & photo booth'
      },
      {
        category: 'Bakery',
        name: 'Special Event Cake',
        description: cakeItems.length > 0 ? cakeItems.map(c => c.name || c.title || c).join(', ') : 'Customized celebration cake setup',
        pricing_type: 'FIXED',
        is_included: Boolean(objInc.cake || cakeItems.length > 0),
        basic_price: objInc.cake_basic_price ?? 0,
        standard_price: objInc.cake_standard_price ?? 0,
        premium_price: objInc.cake_premium_price ?? 0,
        basic_desc: '1 Kg Standard Cream Cake',
        standard_desc: '2 Kg Designer Fondant/Tier Cake',
        premium_desc: '3+ Kg Custom Multi-tier Designer Cake'
      },
      {
        category: 'Entertainment',
        name: 'Sound System & Music / DJ',
        description: musicItems.length > 0 ? musicItems.map(m => m.name || m.title || m).join(', ') : 'Acoustic speakers or DJ music setup',
        pricing_type: 'FIXED',
        is_included: Boolean(objInc.music || musicItems.length > 0),
        basic_price: objInc.music_basic_price ?? 0,
        standard_price: objInc.music_standard_price ?? 0,
        premium_price: objInc.music_premium_price ?? 0,
        basic_desc: 'Background Bluetooth Speaker',
        standard_desc: 'PA Sound System & Playlist Control',
        premium_desc: 'Live DJ Console & Lighting System'
      },
      {
        category: 'Service Staff',
        name: 'Additional Host Services',
        description: objInc.other_text || (otherItems.length > 0 ? otherItems.map(o => o.name || o.title || o).join(', ') : 'Extra service staff & party props'),
        pricing_type: 'FIXED',
        is_included: Boolean(objInc.other || otherItems.length > 0 || objInc.other_text),
        basic_price: objInc.other_basic_price ?? 0,
        standard_price: objInc.other_standard_price ?? 0,
        premium_price: objInc.other_premium_price ?? 0,
        basic_desc: 'Standard venue assistance',
        standard_desc: 'Dedicated event server & host helper',
        premium_desc: 'Full hospitality team & party coordinator'
      }
    ];
  }, [event.inclusions, event.package_inclusions, event.price, event.base_price]);

  // Calculate package display price with fallback to inclusions prices if event.price is 0
  const packagePrice = React.useMemo(() => {
    let p = Number(event.price || event.base_price || 0);
    if (p > 0) return p;
    
    // Sum prices from inclusions if base price is 0
    let incSum = 0;
    rawInclusions.forEach(inc => {
      if (inc.is_included) {
        const bp = Number(inc.basic_price || inc.unit_price || 0);
        incSum += bp;
      }
    });
    return incSum;
  }, [event.price, event.base_price, rawInclusions]);

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
              <h2 className="text-2xl font-black">{event.package_name || event.title || 'Event Package'}</h2>
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
              {event.package_name || event.title}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Available at {event.cafe?.name || 'Cafe Venue'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3 Quick Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
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
      </div>

      {/* Interactive Tabs Header & Content Canvas */}
      <div className="bg-white rounded-3xl border border-border/60 shadow-2xs p-5 sm:p-6 space-y-6">
        
        {/* Tab Selector Switcher */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Description', icon: Info },
            { id: 'inclusions', label: `Inclusions & Amenities (${rawInclusions.length})`, icon: ListChecks },
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
              <h3 className="text-base font-extrabold text-[#2C1810] mb-2">Package Inclusions & Feature Tiers</h3>

              {rawInclusions.length > 0 ? (
                <div className="space-y-4">
                  {rawInclusions.map((inc, idx) => {
                    const pType = (inc.pricing_type || 'FIXED').toUpperCase();
                    const tiersArr = Array.isArray(inc.tiers) ? inc.tiers : [];
                    
                    const basicTier = tiersArr.find(t => (t.tier_name || '').toUpperCase() === 'BASIC');
                    const standardTier = tiersArr.find(t => (t.tier_name || '').toUpperCase() === 'STANDARD');
                    const premiumTier = tiersArr.find(t => (t.tier_name || '').toUpperCase() === 'PREMIUM');

                    const basicPrice = basicTier?.unit_price ?? basicTier?.price ?? inc.basic_price ?? inc.unit_price ?? 0;
                    const standardPrice = standardTier?.unit_price ?? standardTier?.price ?? inc.standard_price ?? inc.unit_price ?? 0;
                    const premiumPrice = premiumTier?.unit_price ?? premiumTier?.price ?? inc.premium_price ?? inc.unit_price ?? 0;

                    const basicDesc = basicTier?.description || inc.basic_desc || inc.description || 'Basic tier setup';
                    const standardDesc = standardTier?.description || inc.standard_desc || inc.description || 'Standard tier setup';
                    const premiumDesc = premiumTier?.description || inc.premium_desc || inc.description || 'Premium tier setup';

                    const isBasicInc = basicTier ? (basicTier.is_included !== false) : (inc.is_included !== false || basicPrice > 0);
                    const isStandardInc = standardTier ? (standardTier.is_included !== false) : (inc.is_included !== false || standardPrice > 0);
                    const isPremiumInc = premiumTier ? (premiumTier.is_included !== false) : (inc.is_included !== false || premiumPrice > 0);

                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-[#DDB892]/60 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#6F4E37]/10 text-[#6F4E37]">
                              {inc.category || 'Feature'}
                            </span>
                            <h4 className="font-black text-[#2C1810] text-sm sm:text-base">{inc.name || inc.title}</h4>
                          </div>
                          <span className="text-[10px] font-bold text-text/60 bg-surface px-2.5 py-1 rounded-full border border-border/50">
                            {pType === 'PER_GUEST' ? 'Rate / Guest' : 'Fixed Amount'}
                          </span>
                        </div>

                        {inc.description && (
                          <p className="text-xs text-text/60 font-medium">{inc.description}</p>
                        )}

                        {/* Tier Comparison Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {/* BASIC TIER */}
                          <div className={cn(
                            "p-3 rounded-xl border text-xs space-y-1",
                            isBasicInc ? "bg-stone-50 border-stone-200" : "bg-stone-50/50 border-stone-100 opacity-60"
                          )}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-stone-700 uppercase">BASIC TIER</span>
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.2 rounded",
                                isBasicInc ? "bg-stone-200 text-stone-700" : "bg-stone-100 text-stone-400"
                              )}>
                                {isBasicInc ? 'Included' : 'Not Included'}
                              </span>
                            </div>
                            <p className="text-sm font-black text-[#2C1810]">
                              {isBasicInc ? `₹${basicPrice} ${pType === 'PER_GUEST' ? '/ guest' : 'fixed'}` : 'N/A'}
                            </p>
                            <p className="text-[10px] text-text/60 truncate">{basicDesc}</p>
                          </div>

                          {/* STANDARD TIER */}
                          <div className={cn(
                            "p-3 rounded-xl border text-xs space-y-1",
                            isStandardInc ? "bg-amber-50/70 border-amber-300" : "bg-amber-50/30 border-amber-100 opacity-60"
                          )}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-900 uppercase">STANDARD TIER</span>
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.2 rounded",
                                isStandardInc ? "bg-amber-200/80 text-amber-800" : "bg-stone-100 text-stone-400"
                              )}>
                                {isStandardInc ? 'Included' : 'Not Included'}
                              </span>
                            </div>
                            <p className="text-sm font-black text-[#2C1810]">
                              {isStandardInc ? `₹${standardPrice} ${pType === 'PER_GUEST' ? '/ guest' : 'fixed'}` : 'N/A'}
                            </p>
                            <p className="text-[10px] text-text/60 truncate">{standardDesc}</p>
                          </div>

                          {/* PREMIUM TIER */}
                          <div className={cn(
                            "p-3 rounded-xl border text-xs space-y-1",
                            isPremiumInc ? "bg-[#FFF8F0] border-[#DDB892]/70" : "bg-stone-50/30 border-stone-100 opacity-60"
                          )}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#6F4E37] uppercase">PREMIUM TIER</span>
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.2 rounded",
                                isPremiumInc ? "bg-[#6F4E37] text-white" : "bg-stone-100 text-stone-400"
                              )}>
                                {isPremiumInc ? 'Included' : 'Not Included'}
                              </span>
                            </div>
                            <p className="text-sm font-black text-[#2C1810]">
                              {isPremiumInc ? `₹${premiumPrice} ${pType === 'PER_GUEST' ? '/ guest' : 'fixed'}` : 'N/A'}
                            </p>
                            <p className="text-[10px] text-text/60 truncate">{premiumDesc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center bg-surface/30 rounded-2xl border border-border/40 text-xs text-text/50">
                  No explicit package inclusions configured yet.
                </div>
              )}
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
