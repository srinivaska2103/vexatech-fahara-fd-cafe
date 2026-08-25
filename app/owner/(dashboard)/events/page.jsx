'use client';
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  Grid, 
  List as ListIcon, 
  SlidersHorizontal, 
  PartyPopper, 
  Sparkles, 
  IndianRupee, 
  CheckCircle2, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { EventTable } from '@/components/events/EventTable';
import { EmptyEventState } from '@/components/events/EmptyEventState';
import { LoadingSkeleton } from '@/components/events/LoadingSkeleton';
import { DeleteEventDialog } from '@/components/events/DeleteEventDialog';
import { useEvents, useDeleteEvent } from '@/hooks/event';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [eventToDelete, setEventToDelete] = useState(null);
  
  const { data: eventsData, isLoading, refetch } = useEvents({ search });
  const deleteMutation = useDeleteEvent();

  const events = Array.isArray(eventsData) ? eventsData : (eventsData?.data || eventsData?.events || []);

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.id, {
        onSuccess: () => setEventToDelete(null)
      });
    }
  };

  const filteredEvents = events.filter(e => {
    const packageName = (e.package_name || '').toLowerCase();
    const eventType = (e.event_type || e.category || '').toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch = !search || packageName.includes(searchLower) || eventType.includes(searchLower);
    
    let matchesCategory = true;
    if (categoryFilter !== 'ALL') {
      const catLower = categoryFilter.toLowerCase();
      matchesCategory = packageName.includes(catLower) || eventType.includes(catLower);
    }

    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic stats
  const totalCount = events.length;
  const publishedCount = events.filter(e => (e.status || 'PUBLISHED') === 'PUBLISHED').length;
  const avgPrice = events.length > 0 
    ? Math.round(events.reduce((sum, e) => sum + (Number(e.price) || 0), 0) / events.length) 
    : 0;

  const categories = [
    { id: 'ALL', label: 'All Packages' },
    { id: 'birthday', label: 'Birthday Parties' },
    { id: 'corporate', label: 'Corporate Events' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'music', label: 'Live Music' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EVENT SERVICES STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Event Packages & Parties
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Configure special party offerings, birthday setups, and workshop packages across all your cafe venues.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button 
            onClick={() => refetch()}
            className="w-10 h-10 rounded-2xl border border-[#DDB892]/60 bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
            title="Refresh Event Packages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link href="/owner/events/create">
            <Button className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all">
              <Plus className="w-4 h-4 text-white" />
              <span>Create Event Package</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Dynamic Event Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Event Packages */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Total Offerings</span>
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
              <PartyPopper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{totalCount}</p>
          <p className="text-[10px] text-text/50 font-medium">Configured packages</p>
        </div>

        {/* Active Published */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Active Published</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{publishedCount}</p>
          <p className="text-[10px] text-emerald-700/80 font-bold">Visible to diners</p>
        </div>

        {/* Average Package Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase tracking-wider">Avg Package Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#6F4E37]">₹{avgPrice}</p>
          <p className="text-[10px] text-text/50 font-medium">Average base rate</p>
        </div>

        {/* Event Types */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-wider">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">4</p>
          <p className="text-[10px] text-text/50 font-medium">Party & workshop types</p>
        </div>

      </div>

      {/* Toolbar & Category Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#6F4E37] text-white shadow-2xs'
                      : 'bg-surface/50 text-[#2C1810] hover:bg-surface'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
                placeholder="Search package name..." 
              />
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-surface/60 p-1 rounded-2xl border border-border/40 shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content View */}
      {isLoading ? (
        <LoadingSkeleton type={viewMode === 'list' ? 'list' : 'card'} />
      ) : (!filteredEvents || filteredEvents.length === 0) ? (
        <EmptyEventState search={search} />
      ) : (
        <motion.div layout>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={event.id}
                  >
                    <EventCard event={event} onDelete={setEventToDelete} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EventTable events={filteredEvents} onDelete={setEventToDelete} />
          )}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
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
