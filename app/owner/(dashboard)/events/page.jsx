'use client';
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Cake, 
  HeartHandshake, 
  Briefcase, 
  PartyPopper, 
  Music, 
  Sparkles, 
  Store,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { EmptyEventState } from '@/components/events/EmptyEventState';
import { LoadingSkeleton } from '@/components/events/LoadingSkeleton';
import { DeleteEventDialog } from '@/components/events/DeleteEventDialog';
import { useEvents, useDeleteEvent } from '@/hooks/event';
import { motion, AnimatePresence } from 'framer-motion';

// Event Type Metadata Map for Headers & Descriptions
const EVENT_TYPE_META = {
  'Birthday': { icon: Cake, subtitle: 'Custom packages for birthday celebrations.' },
  'Birthday Party': { icon: Cake, subtitle: 'Custom packages for birthday celebrations.' },
  'Anniversary': { icon: HeartHandshake, subtitle: 'Packages for couples and romantic celebrations.' },
  'Anniversary & Couples': { icon: HeartHandshake, subtitle: 'Packages for couples and special romantic occasions.' },
  'Date Night': { icon: HeartHandshake, subtitle: 'Packages for couples and romantic dinner dates.' },
  'Corporate Meeting': { icon: Briefcase, subtitle: 'Packages for meetings, workshops, and business events.' },
  'Corporate': { icon: Briefcase, subtitle: 'Packages for meetings and corporate gatherings.' },
  'Wedding Reception': { icon: PartyPopper, subtitle: 'Comprehensive packages for wedding receptions and functions.' },
  'Wedding': { icon: PartyPopper, subtitle: 'Comprehensive packages for wedding receptions and functions.' },
  'Engagement': { icon: HeartHandshake, subtitle: 'Rings and intimate engagement gatherings.' },
  'Photoshoot': { icon: Sparkles, subtitle: 'Studio space and lighting setups.' },
  'Baby Shower': { icon: Cake, subtitle: 'Family and baby welcoming setups.' },
  'Party': { icon: PartyPopper, subtitle: 'General group celebrations.' },
  'Private Dining Party': { icon: PartyPopper, subtitle: 'Exclusive packages for private dining celebrations.' },
  'Workshop & Masterclass': { icon: Sparkles, subtitle: 'Packages for interactive workshops, pottery, and classes.' },
  'Workshop': { icon: Sparkles, subtitle: 'Packages for interactive workshops and masterclasses.' },
  'Live Music & Concert': { icon: Music, subtitle: 'Custom packages for live music nights and gigs.' },
  'Other Special Event': { icon: Store, subtitle: 'Flexible packages for custom special events.' },
  'Other': { icon: Store, subtitle: 'Flexible packages for custom special events.' },
};

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [eventToDelete, setEventToDelete] = useState(null);
  
  const { data: eventsData, isLoading, isError, refetch } = useEvents({ search });
  const deleteMutation = useDeleteEvent();

  const events = Array.isArray(eventsData) ? eventsData : (eventsData?.data || eventsData?.events || []);

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.id, {
        onSuccess: () => setEventToDelete(null)
      });
    }
  };

  // Filter events by Search term & Category filter
  const filteredEvents = events.filter(e => {
    const packageName = (e.package_name || '').toLowerCase();
    const eventType = (e.event_type || e.category || 'Special Event').toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch = !search || packageName.includes(searchLower) || eventType.includes(searchLower);
    
    let matchesCategory = true;
    if (selectedCategory !== 'ALL') {
      matchesCategory = eventType === selectedCategory.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  });

  // Group filtered events by Event Type (Category)
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const type = event.event_type || event.category || 'Other Special Event';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(event);
    return groups;
  }, {});

  const eventTypesPresent = Object.keys(groupedEvents);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-[#2C1810]">
      
      {/* SaaS Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DED5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
            Event Packages
          </h1>
          <p className="text-xs sm:text-sm text-[#2C1810]/70 mt-1">
            Create and manage custom packages for the events your cafe offers.
          </p>
        </div>

        {/* Top-Right Header Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={() => refetch()}
            className="w-10 h-10 rounded-xl border border-[#E8DED5] bg-white hover:bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center transition-all shrink-0"
            title="Refresh Packages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link href="/owner/events/create">
            <Button className="py-2.5 px-5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-bold shadow-2xs flex items-center gap-2">
              <Plus className="w-4 h-4 text-white" />
              <span>+ Create Package</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-[#6F4E37] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C1810] hover:bg-[#E8DED5]'
            }`}
          >
            All Event Types ({events.length})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2C1810]/40">
            <Search className="h-4 w-4" />
          </div>
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#E8DED5] bg-[#FFF8F0]/40 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-[#2C1810]/40" 
            placeholder="Search package name..." 
          />
        </div>

      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSkeleton type="card" />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-rose-200 text-center space-y-3">
          <p className="text-sm font-extrabold text-rose-700">Unable to load event packages.</p>
          <Button onClick={() => refetch()} variant="outline" className="text-xs font-bold border-rose-200 text-rose-700">
            Try Again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <EmptyEventState search={search} />
      ) : eventTypesPresent.length === 0 ? (
        <div className="p-12 text-center text-[#2C1810]/50 text-xs font-medium bg-white rounded-2xl border border-[#E8DED5]">
          No custom packages found matching "{search}".
        </div>
      ) : (
        <div className="space-y-10">
          {eventTypesPresent.map((type) => {
            const meta = EVENT_TYPE_META[type] || { icon: Layers, subtitle: `Custom packages for ${type}.` };
            const CategoryIcon = meta.icon;
            const typePackages = groupedEvents[type];

            return (
              <section key={type} className="space-y-4">
                
                {/* Event Type Section Header */}
                <div className="bg-[#FFF8F0] p-4 sm:p-5 rounded-2xl border border-[#E8DED5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DED5] text-[#6F4E37] flex items-center justify-center shrink-0 shadow-2xs">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#2C1810] flex items-center gap-2">
                        <span>{type}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
                          {typePackages.length}
                        </span>
                      </h2>
                      <p className="text-xs text-[#2C1810]/70 mt-0.5">{meta.subtitle}</p>
                    </div>
                  </div>

                  <Link href={`/owner/events/create?event_type=${encodeURIComponent(type)}`}>
                    <Button 
                      variant="outline"
                      className="py-1.5 px-3.5 rounded-xl border-[#6F4E37]/30 hover:border-[#6F4E37] bg-white text-[#6F4E37] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add {type} Package</span>
                    </Button>
                  </Link>
                </div>

                {/* Event Type Package Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typePackages.map((pkg) => (
                    <EventCard 
                      key={pkg.id} 
                      event={pkg} 
                      onDelete={setEventToDelete} 
                    />
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteEventDialog 
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDeleteConfirm}
        eventName={eventToDelete?.package_name}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
