'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { 
  Plus, 
  Search, 
  Grid, 
  List as ListIcon, 
  Store, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { CafeCard } from '@/components/cafes/CafeCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { useCafes, useDeleteCafe } from '@/hooks/cafe';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CafesPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const user = useAuthStore((state) => state.user);
  const confirm = useConfirm();
  
  const { data: cafesData, isLoading } = useCafes(
    { search, owner_id: user?.id },
    { enabled: !!user?.id }
  );
  
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);
  const deleteMutation = useDeleteCafe();

  const handleDelete = async (cafe) => {
    const isConfirmed = await confirm({
      title: `Delete ${cafe.name}?`,
      message: `Are you sure you want to delete ${cafe.name}? This action cannot be undone.`,
      confirmText: 'Delete Cafe',
      cancelText: 'Keep Cafe',
      type: 'danger'
    });

    if (isConfirmed) {
      deleteMutation.mutate(cafe.id);
    }
  };


  // Filter by status tab
  const filteredCafes = cafes.filter(cafe => {
    const matchesSearch = !search || 
      cafe.name.toLowerCase().includes(search.toLowerCase()) || 
      (cafe.city && cafe.city.toLowerCase().includes(search.toLowerCase())) ||
      (cafe.address && cafe.address.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || cafe.status?.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate live venue statistics
  const totalVenues = cafes.length;
  const activeVenues = cafes.filter(c => c.status === 'ACTIVE' || c.status === 'APPROVED' || !c.status).length;
  const pendingVenues = cafes.filter(c => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length;
  
  const avgHourlyRate = cafes.length > 0 
    ? Math.round(cafes.reduce((acc, c) => acc + (Number(c.price_per_hour) || 0), 0) / cafes.length)
    : 0;

  const statusTabs = [
    { id: 'ALL', label: 'All Venues', count: totalVenues },
    { id: 'ACTIVE', label: 'Active', count: activeVenues },
    { id: 'PENDING', label: 'Pending', count: pendingVenues },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-extrabold text-xl shadow-xs shrink-0">
            <Store className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">My Cafe Venues</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                PORTFOLIO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Manage your cafes, update dining capacities, edit pricing, and track venue performance.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="z-10">
          {cafes.length >= 3 ? (
            <div className="flex flex-col items-end gap-1">
              <Button disabled className="py-2.5 px-5 rounded-2xl bg-gray-200 text-gray-500 font-extrabold text-xs flex items-center gap-2 cursor-not-allowed border border-gray-300">
                <Plus className="w-4 h-4" />
                <span>Add New Cafe (3/3 Max Limit)</span>
              </Button>
              <span className="text-[11px] text-amber-700 font-medium">Maximum 3 cafes allowed per owner</span>
            </div>
          ) : (
            <Link href="/owner/cafes/create">
              <Button className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-xs hover:shadow-md flex items-center gap-2 transition-all">
                <Plus className="w-4 h-4" />
                <span>Add New Cafe ({cafes.length}/3)</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Interactive Venue Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-border/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Total Venues</p>
            <h3 className="text-lg font-black text-[#2C1810]">{totalVenues}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-border/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Active Listings</p>
            <h3 className="text-lg font-black text-[#2C1810]">{activeVenues}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-border/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Pending Review</p>
            <h3 className="text-lg font-black text-[#2C1810]">{pendingVenues}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-border/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Avg Hourly Rate</p>
            <h3 className="text-lg font-black text-[#2C1810]">₹{avgHourlyRate}/hr</h3>
          </div>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-border/60 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        
        {/* Left: Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStatus === tab.id
                  ? 'bg-[#6F4E37] text-white shadow-2xs'
                  : 'bg-surface/60 text-text/65 hover:bg-surface hover:text-[#2C1810]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                selectedStatus === tab.id ? 'bg-white/20 text-white' : 'bg-white text-text/60'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Search Box & View Mode Toggles */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]" />
            <input 
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-border/60 bg-surface/30 focus:outline-none focus:bg-white focus:border-[#6F4E37] transition-all font-medium" 
              placeholder="Search cafes by name or city..." 
            />
          </div>

          <div className="flex bg-surface p-1 rounded-xl border border-border/40 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-2xs text-[#6F4E37] font-bold' : 'text-text/50 hover:text-[#2C1810]'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cafe Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} type="card" className="h-[360px] rounded-3xl" />)}
        </div>
      ) : filteredCafes.length === 0 ? (
        <EmptyState 
          icon={Store} 
          title={search ? "No cafes match your filter" : "No Cafes Listed"} 
          message={search ? "Try adjusting your search query or status filter." : "You haven't registered any cafes yet. Add your first venue to start accepting guest table reservations!"}
          action={!search && (
            <Link href="/owner/cafes/create">
              <Button className="rounded-2xl font-extrabold bg-[#6F4E37] hover:bg-[#5D3F2B] text-white px-6 py-2.5 shadow-xs">
                <Plus className="w-4 h-4 mr-1.5" /> Create First Cafe
              </Button>
            </Link>
          )}
        />
      ) : (
        <motion.div 
          layout
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AnimatePresence>
            {filteredCafes.map((cafe) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                key={cafe.id}
              >
                <CafeCard cafe={cafe} onDelete={handleDelete} viewMode={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
