'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerService } from '@/services/offer.service';
import { menuService } from '@/services/menu.service';
import ModernDropdown from '@/components/ui/ModernDropdown';
import ModernDateTimePicker from '@/components/ui/ModernDateTimePicker';
import { toast } from 'react-hot-toast';
import {
  BadgePercent,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
  Tag,
  ArrowRight,
  TrendingDown,
  Layers,
  Store,
  ChevronRight
} from 'lucide-react';

export default function OffersManagementPage() {
  const queryClient = useQueryClient();

  // Tab & Filters
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Queries
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['offer-stats'],
    queryFn: () => offerService.getOfferStats()
  });
  const stats = statsData || { totalOffers: 0, activeOffers: 0, scheduledOffers: 0, expiredOffers: 0, inactiveOffers: 0 };

  const { data: offersData, isLoading: isOffersLoading } = useQuery({
    queryKey: ['offers', activeStatusFilter, selectedTypeFilter, searchQuery],
    queryFn: () => offerService.getOffers({
      status: activeStatusFilter,
      offerType: selectedTypeFilter,
      search: searchQuery
    })
  });
  const offers = offersData || [];

  // Fetch categories & menu items for selection in modal
  const { data: categoriesData } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: () => menuService.getCategories({ includeInactive: true })
  });
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : (Array.isArray(categoriesData) ? categoriesData : []);

  const { data: itemsData } = useQuery({
    queryKey: ['menu-items-all'],
    queryFn: () => menuService.getMenuItems({ limit: 100 })
  });
  const menuItems = Array.isArray(itemsData?.data) ? itemsData.data : (Array.isArray(itemsData) ? itemsData : []);

  // Mutations
  const toggleOfferStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => offerService.updateOfferStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer-stats'] });
      toast.success('Offer status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update offer status')
  });

  const deleteOfferMutation = useMutation({
    mutationFn: (id) => offerService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer-stats'] });
      setDeleteConfirmation(null);
      toast.success('Offer deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete offer')
  });

  const handleDuplicateOffer = (offer) => {
    const duplicated = {
      ...offer,
      id: null,
      title: `${offer.title} (Copy)`,
      itemIds: offer.menu_offer_items?.map((oi) => oi.item_id) || [],
      categoryIds: offer.menu_offer_categories?.map((oc) => oc.category_id) || []
    };
    setEditingOffer(duplicated);
    setIsOfferModalOpen(true);
  };

  return (
    <PageContainer className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF5F5] border border-[#FEE2E2] rounded-2xl text-[#FF6B00]">
            <BadgePercent className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">Discounts & Offers</h1>
            <p className="text-xs sm:text-sm text-[#757575] mt-0.5">Create percentage, fixed, item-wise, category-wise and restaurant-wide discounts.</p>
          </div>
        </div>

        <button
          onClick={() => { setEditingOffer(null); setIsOfferModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#E50914]/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offer Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Total Offers</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-2">
            {isStatsLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#E50914]" /> : stats.totalOffers}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Promotional campaigns</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {isStatsLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#E50914]" /> : stats.activeOffers}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Live on customer app</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Scheduled</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">
            {isStatsLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#E50914]" /> : stats.scheduledOffers}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Upcoming future offers</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Expired</span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {isStatsLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#E50914]" /> : stats.expiredOffers}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Ended promotions</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Inactive</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-500 mt-2">
            {isStatsLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#E50914]" /> : stats.inactiveOffers}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Paused by owner</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Redemptions</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {offers.reduce((acc, o) => acc + (o.redemption_count || 0), 0)}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Total times redeemed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All (${stats.totalOffers})` },
            { id: 'ACTIVE', label: `Active (${stats.activeOffers})` },
            { id: 'SCHEDULED', label: `Scheduled (${stats.scheduledOffers})` },
            { id: 'EXPIRED', label: `Expired (${stats.expiredOffers})` },
            { id: 'INACTIVE', label: `Inactive (${stats.inactiveOffers})` }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeStatusFilter === pill.id
                  ? 'bg-[#E50914] text-white shadow-xs'
                  : 'bg-[#FFF5F5] text-[#252525] hover:bg-[#FEE2E2]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Offer Type Dropdown Filter */}
          <ModernDropdown
            value={selectedTypeFilter}
            onChange={setSelectedTypeFilter}
            options={[
              { value: 'ALL', label: 'All Offer Types' },
              { value: 'BUY_X_GET_Y', label: 'Buy X Get Y (BOGO)' },
              { value: 'PERCENTAGE', label: 'Percentage Off (%)' },
              { value: 'FLAT', label: 'Flat Discount (₹)' },
              { value: 'COMBO', label: 'Combo Deals' },
              { value: 'CATEGORY', label: 'Category Discounts' },
              { value: 'RESTAURANT', label: 'Restaurant Specials' }
            ]}
          />

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575]" />
            <input
              type="text"
              placeholder="Search offers by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl text-xs text-[#252525] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914]"
            />
          </div>
        </div>

      </div>

      {/* Offers Cards Grid */}
      {isOffersLoading ? (
        <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#E50914] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#757575]">Loading your special offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-3xl space-y-3">
          <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto text-[#FF6B00]">
            <BadgePercent className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-[#252525]">No offers found</h3>
          <p className="text-xs text-[#757575] max-w-sm mx-auto">
            {searchQuery || activeStatusFilter !== 'ALL' || selectedTypeFilter !== 'ALL'
              ? 'No promotional offers matched your selected filters.'
              : 'Create percentage or fixed amount discounts to attract more customers to your menu!'}
          </p>
          <button
            onClick={() => { setEditingOffer(null); setIsOfferModalOpen(true); }}
            className="mt-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
          >
            + Create First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer) => {
            const isPercentage = offer.discount_type === 'PERCENTAGE';
            const status = offer.computed_status;
            
            return (
              <div
                key={offer.id}
                className="group relative bg-white border border-[#FEE2E2] hover:border-[#E50914]/40 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:shadow-[#E50914]/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-3">
                  
                  {/* Top Status & Type Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : status === 'SCHEDULED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : status === 'EXPIRED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-stone-400'
                      }`} />
                      {status}
                    </span>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#757575] bg-[#FFF5F5] px-2.5 py-0.5 rounded-lg border border-[#FEE2E2]">
                      {offer.offer_type === 'ITEM' ? 'Item-wise' : offer.offer_type === 'CATEGORY' ? 'Category-wise' : 'Restaurant-wide'}
                    </span>
                  </div>

                  {/* Discount Value Badge */}
                  <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                    {offer.offer_category === 'BUY_X_GET_Y' || offer.offer_type === 'BUY_X_GET_Y' ? (
                      <span className="text-2xl font-black text-[#E50914] tracking-tight flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-red-100 text-[#E50914] text-xs font-black uppercase">BOGO</span>
                        <span>Buy {offer.buy_quantity || 1} Get {offer.reward_quantity || 1} Free</span>
                      </span>
                    ) : offer.offer_category === 'COMBO' ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#E50914] tracking-tight">
                          ₹{Number(offer.combo_price || 0).toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          Combo Special
                        </span>
                        {offer.discount_value > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Save ₹{Number(offer.discount_value).toFixed(2)}
                          </span>
                        )}
                      </div>
                    ) : offer.offer_category === 'FREE_ITEM' ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[#E50914] tracking-tight">
                          FREE ITEM (₹0)
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                          Reward
                        </span>
                      </div>
                    ) : offer.offer_category === 'FLAT' ? (
                      <span className="text-3xl font-black text-[#E50914] tracking-tight">
                        ₹{Number(offer.discount_value)} FLAT OFF
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-[#E50914] tracking-tight">
                        {isPercentage ? `${Number(offer.discount_value)}% OFF` : `₹${Number(offer.discount_value)} OFF`}
                      </span>
                    )}
                    {offer.max_discount_amount && isPercentage && (
                      <span className="text-[10px] font-bold text-[#757575]">
                        (Up to ₹{Number(offer.max_discount_amount)})
                      </span>
                    )}
                    {offer.min_order_value && Number(offer.min_order_value) > 0 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Min ₹{Number(offer.min_order_value)}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-black text-[#252525] group-hover:text-[#E50914] transition-colors leading-snug">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-[#757575] line-clamp-2 mt-1 leading-relaxed">
                      {offer.description || 'Special seasonal promotional discount.'}
                    </p>
                  </div>

                  {/* Target Scope Tags */}
                  <div className="pt-2 border-t border-[#FEE2E2]/60">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#757575] block mb-1.5">
                      Applicable To:
                    </span>
                    {offer.offer_type === 'RESTAURANT' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#252525]">
                        <Store className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>All Eligible Menu Items in Restaurant</span>
                      </div>
                    ) : offer.offer_type === 'CATEGORY' ? (
                      <div className="flex flex-wrap gap-1">
                        {offer.menu_offer_categories?.map((c) => (
                          <span key={c.category_id} className="text-[10px] font-bold bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] px-2 py-0.5 rounded-md">
                            {c.menu_categories?.name || 'Category'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {offer.menu_offer_items?.slice(0, 3).map((i) => (
                          <span key={i.item_id} className="text-[10px] font-bold bg-[#FFF5F5] text-[#252525] border border-[#FEE2E2] px-2 py-0.5 rounded-md truncate max-w-[150px]">
                            {i.menu_items?.name || 'Item'}
                          </span>
                        ))}
                        {(offer.menu_offer_items?.length || 0) > 3 && (
                          <span className="text-[10px] font-bold text-[#757575] self-center">
                            +{offer.menu_offer_items.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Validity Dates */}
                  <div className="pt-2 text-[11px] text-[#757575] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>
                        {new Date(offer.start_date).toLocaleDateString()} — {new Date(offer.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#FEE2E2] flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleOfferStatusMutation.mutate({ id: offer.id, isActive: !offer.is_active })}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      offer.is_active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {offer.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{offer.is_active ? 'Active' : 'Inactive'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateOffer(offer)}
                      className="p-1.5 text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5] rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Offer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingOffer(offer); setIsOfferModalOpen(true); }}
                      className="p-1.5 text-[#757575] hover:text-[#E50914] hover:bg-[#FFF5F5] rounded-lg transition-colors cursor-pointer"
                      title="Edit Offer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation({ id: offer.id, title: offer.title })}
                      className="p-1.5 text-[#757575] hover:text-rose-600 hover:bg-[#FFF5F5] rounded-lg transition-colors cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ==================== CREATE / EDIT OFFER MODAL ==================== */}
      {isOfferModalOpen && (
        <OfferModal
          isOpen={isOfferModalOpen}
          offer={editingOffer}
          categories={categories}
          menuItems={menuItems}
          onClose={() => setIsOfferModalOpen(false)}
          onSuccess={() => {
            setIsOfferModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['offer-stats'] });
          }}
        />
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-[#252525]">Delete Offer?</h3>
              <p className="text-xs text-[#757575] mt-1">
                Are you sure you want to delete <strong className="text-[#252525]">"{deleteConfirmation.title}"</strong>? Customers will no longer receive this discount.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOfferMutation.mutate(deleteConfirmation.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
}

// ==================== OFFER MODAL COMPONENT (MODERN & COMPACT) ====================
function OfferModal({ isOpen, offer, categories = [], menuItems = [], onClose, onSuccess }) {
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [title, setTitle] = useState(offer?.title || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [offerCategory, setOfferCategory] = useState(offer?.offer_category || (offer?.offer_type === 'BUY_X_GET_Y' ? 'BUY_X_GET_Y' : 'PERCENTAGE'));
  const [offerType, setOfferType] = useState(offer?.offer_type || 'ITEM');
  const [discountType, setDiscountType] = useState(offer?.discount_type || 'PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(offer?.discount_value || '');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(offer?.max_discount_amount || '');

  // BOGO / Advanced State
  const [buyItemId, setBuyItemId] = useState(offer?.buy_item_id || safeMenuItems[0]?.id || '');
  const [buyQuantity, setBuyQuantity] = useState(offer?.buy_quantity || 1);
  const [rewardItemId, setRewardItemId] = useState(offer?.reward_item_id || safeMenuItems[0]?.id || '');
  const [rewardQuantity, setRewardQuantity] = useState(offer?.reward_quantity || 1);
  const [rewardDiscountType, setRewardDiscountType] = useState(offer?.reward_discount_type || 'FREE');
  const [rewardDiscountValue, setRewardDiscountValue] = useState(offer?.reward_discount_value || 100);
  const [maxRewardQuantity, setMaxRewardQuantity] = useState(offer?.max_reward_quantity || '');
  const [minOrderValue, setMinOrderValue] = useState(offer?.min_order_value || '');
  const [maxRedemptions, setMaxRedemptions] = useState(offer?.max_redemptions || '');
  const [comboPrice, setComboPrice] = useState(offer?.combo_price || '');

  // Combo components [{ itemId, quantity }]
  const parseInitialCombo = () => {
    if (offer?.terms_and_conditions && typeof offer.terms_and_conditions === 'string' && offer.terms_and_conditions.startsWith('{')) {
      try {
        const parsed = JSON.parse(offer.terms_and_conditions);
        if (Array.isArray(parsed.components) && parsed.components.length > 0) return parsed.components;
      } catch (e) {}
    }
    if (safeMenuItems.length >= 2) {
      return [
        { itemId: safeMenuItems[0].id, quantity: 1 },
        { itemId: safeMenuItems[1].id, quantity: 1 }
      ];
    } else if (safeMenuItems.length === 1) {
      return [{ itemId: safeMenuItems[0].id, quantity: 2 }];
    }
    return [];
  };
  const [comboComponents, setComboComponents] = useState(parseInitialCombo);
  
  // Format start & end dates
  const defaultStart = offer?.start_date ? new Date(offer.start_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
  const defaultEnd = offer?.end_date ? new Date(offer.end_date).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [isActive, setIsActive] = useState(offer?.is_active ?? true);

  // Selections
  const initialSelectedItems = offer?.menu_offer_items?.map((oi) => oi.item_id) || offer?.itemIds || [];
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const initialSelectedCats = offer?.menu_offer_categories?.map((oc) => oc.category_id) || offer?.categoryIds || [];
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCats);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Calculation Preview dynamically based on actual selected category
  const buyItemObj = safeMenuItems.find((i) => i.id === buyItemId) || safeMenuItems[0];
  const rewardItemObj = safeMenuItems.find((i) => i.id === rewardItemId) || buyItemObj || safeMenuItems[0];
  const firstSelectedItem = safeMenuItems.find((i) => selectedItems.includes(i.id)) || safeMenuItems[0];
  const targetItemName = firstSelectedItem?.name || 'Selected Dish';
  const originalPrice = firstSelectedItem ? Number(firstSelectedItem.price) : 200;
  
  const numDiscount = Number(discountValue) || 0;
  let calculatedSavings = 0;
  let sampleFinalPrice = originalPrice;

  // Combo calculations
  const comboOriginalTotal = comboComponents.reduce((sum, comp) => {
    const it = safeMenuItems.find(i => i.id === comp.itemId);
    return sum + (it ? Number(it.price) * (Number(comp.quantity) || 1) : 0);
  }, 0);
  const numComboPrice = Number(comboPrice) || 0;

  if (offerCategory === 'BUY_X_GET_Y') {
    const buyP = Number(buyItemObj?.price || 190);
    const rewP = Number(rewardItemObj?.price || 190);
    calculatedSavings = rewardDiscountType === 'FREE' ? rewP * Number(rewardQuantity || 1) : (rewP * (Number(rewardDiscountValue || 100) / 100));
    sampleFinalPrice = buyP * Number(buyQuantity || 1);
  } else if (offerCategory === 'COMBO') {
    calculatedSavings = Math.max(0, comboOriginalTotal - numComboPrice);
    sampleFinalPrice = numComboPrice;
  } else if (offerCategory === 'FLAT' || discountType === 'FIXED_AMOUNT') {
    calculatedSavings = Math.min(numDiscount, originalPrice);
    sampleFinalPrice = Math.max(0, originalPrice - calculatedSavings);
  } else if (discountType === 'PERCENTAGE') {
    calculatedSavings = (originalPrice * numDiscount) / 100;
    if (maxDiscountAmount && Number(maxDiscountAmount) > 0) {
      calculatedSavings = Math.min(calculatedSavings, Number(maxDiscountAmount));
    }
    sampleFinalPrice = Math.max(0, originalPrice - calculatedSavings);
  } else {
    calculatedSavings = Math.min(numDiscount, originalPrice);
    sampleFinalPrice = Math.max(0, originalPrice - calculatedSavings);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Offer title is required');
      return;
    }

    if (offerCategory === 'COMBO') {
      if (!comboPrice || Number(comboPrice) <= 0) {
        toast.error('Please enter a valid combo selling price');
        return;
      }
      if (comboComponents.length === 0) {
        toast.error('Please select at least one item for the combo');
        return;
      }
      if (comboOriginalTotal <= Number(comboPrice)) {
        toast.error(`Combo price (₹${comboPrice}) must be less than combined original price (₹${comboOriginalTotal})`);
        return;
      }
    } else if (offerCategory === 'FLAT') {
      if (!discountValue || Number(discountValue) <= 0) {
        toast.error('Please enter a valid flat discount amount in ₹');
        return;
      }
      if (offerType === 'ITEM' && selectedItems.length === 0) {
        toast.error('Please select at least one menu item');
        return;
      }
      if (offerType === 'CATEGORY' && selectedCategories.length === 0) {
        toast.error('Please select at least one category');
        return;
      }
    } else if (offerCategory === 'CATEGORY') {
      if (selectedCategories.length === 0) {
        toast.error('Please select at least one category');
        return;
      }
      if (!discountValue || Number(discountValue) <= 0) {
        toast.error('Please enter a valid discount value');
        return;
      }
    } else if (offerCategory !== 'BUY_X_GET_Y') {
      if (!discountValue || Number(discountValue) <= 0) {
        toast.error('Valid discount value is required');
        return;
      }
      if (discountType === 'PERCENTAGE' && Number(discountValue) > 100) {
        toast.error('Percentage discount cannot exceed 100%');
        return;
      }
      if (offerType === 'ITEM' && selectedItems.length === 0) {
        toast.error('Please select at least one menu item');
        return;
      }
      if (offerType === 'CATEGORY' && selectedCategories.length === 0) {
        toast.error('Please select at least one category');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const targetItem = safeMenuItems.find((i) => i.id === buyItemId || i.id === rewardItemId || (comboComponents[0] && i.id === comboComponents[0].itemId)) || safeMenuItems[0];
      const detectedCafeId = targetItem?.cafe_id || offer?.cafe_id || null;

      const payload = {
        cafeId: detectedCafeId,
        title: title.trim(),
        description: description.trim() || null,
        offerType: offerCategory === 'BUY_X_GET_Y' ? 'ITEM' : offerCategory === 'COMBO' ? 'ITEM' : offerCategory === 'CATEGORY' ? 'CATEGORY' : offerType,
        offerCategory,
        discountType: (offerCategory === 'FLAT' || (offerCategory === 'CATEGORY' && discountType === 'FIXED_AMOUNT')) ? 'FIXED_AMOUNT' : (offerCategory === 'BUY_X_GET_Y' || offerCategory === 'COMBO') ? 'PERCENTAGE' : discountType,
        discountValue: offerCategory === 'BUY_X_GET_Y' ? Number(rewardDiscountValue || 100) : offerCategory === 'COMBO' ? Math.max(0, comboOriginalTotal - numComboPrice) : Number(discountValue),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isActive: Boolean(isActive),
        itemIds: offerCategory === 'BUY_X_GET_Y' ? [buyItemId, rewardItemId].filter(Boolean) : offerCategory === 'COMBO' ? comboComponents.map(c => c.itemId) : (offerType === 'ITEM' ? selectedItems : []),
        categoryIds: (offerCategory === 'CATEGORY' || offerType === 'CATEGORY') ? selectedCategories : [],

        // Combo Deals
        comboPrice: offerCategory === 'COMBO' ? numComboPrice : null,
        comboComponents: offerCategory === 'COMBO' ? comboComponents : null,

        // Advanced BOGO parameters
        buyItemId: offerCategory === 'BUY_X_GET_Y' ? buyItemId : null,
        buyQuantity: offerCategory === 'BUY_X_GET_Y' ? Number(buyQuantity || 1) : 1,
        rewardItemId: offerCategory === 'BUY_X_GET_Y' ? rewardItemId : null,
        rewardQuantity: offerCategory === 'BUY_X_GET_Y' ? Number(rewardQuantity || 1) : 1,
        rewardDiscountType,
        rewardDiscountValue: Number(rewardDiscountValue || 100),
        maxRewardQuantity: maxRewardQuantity ? Number(maxRewardQuantity) : null,
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : null
      };

      if (offer?.id) {
        await offerService.updateOffer(offer.id, payload);
        toast.success('Offer updated successfully');
      } else {
        await offerService.createOffer(payload);
        toast.success('Offer published successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-[#FEE2E2] shadow-2xl space-y-4 my-8 max-h-[90vh] flex flex-col">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
              <BadgePercent className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#252525] leading-tight">
                {offer?.id ? 'Edit Special Offer' : 'Create Special Offer'}
              </h3>
              <span className="text-xs text-[#757575] font-medium mt-0.5 block">Configure live BOGO, discounts & scope</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-[#757575] hover:text-[#252525] p-1.5 rounded-xl hover:bg-[#FFF5F5] transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto scrollbar-none pr-1 flex-1">
          
          {/* Row 1: Title & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Offer Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Buy 1 Chicken Biryani Get 1 Free"
                className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914] transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Status
              </label>
              <ModernDropdown
                className="w-full"
                value={isActive ? 'true' : 'false'}
                onChange={(val) => setIsActive(val === 'true')}
                options={[
                  { value: 'true', label: 'Active', badge: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> },
                  { value: 'false', label: 'Paused', badge: <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" /> }
                ]}
              />
            </div>
          </div>

          {/* Row 2: Offer Category Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Offer Category *
              </label>
              <ModernDropdown
                className="w-full"
                value={offerCategory}
                onChange={setOfferCategory}
                options={[
                  { value: 'BUY_X_GET_Y', label: 'Buy X Get Y (BOGO)' },
                  { value: 'PERCENTAGE', label: 'Percentage Off (%)' },
                  { value: 'FLAT', label: 'Flat Discount (₹)' },
                  { value: 'COMBO', label: 'Combo Deals' },
                  { value: 'CATEGORY', label: 'Category Discount' }
                ]}
              />
            </div>

            {offerCategory !== 'BUY_X_GET_Y' && (
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Offer Scope *
                </label>
                <ModernDropdown
                  className="w-full"
                  value={offerType}
                  onChange={setOfferType}
                  options={[
                    { value: 'ITEM', label: 'Item-wise Discount' },
                    { value: 'CATEGORY', label: 'Category-wise' },
                    { value: 'RESTAURANT', label: 'Restaurant-wide (All)' }
                  ]}
                />
              </div>
            )}
          </div>

          {/* ================= DEDICATED CONTROLS BY OFFER CATEGORY ================= */}
          {offerCategory === 'BUY_X_GET_Y' ? (
            <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-red-200 space-y-3">
              <span className="text-[11px] font-black uppercase text-[#E50914] tracking-wider block">
                BOGO Rules &amp; Reward Configuration
              </span>

              {/* Buy Item & Buy Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Buy Item *</label>
                  <ModernDropdown
                    className="w-full"
                    value={buyItemId}
                    onChange={(val) => {
                      setBuyItemId(val);
                      if (!rewardItemId) setRewardItemId(val);
                    }}
                    options={safeMenuItems.map((item) => ({
                      value: item.id,
                      label: `${item.name} (₹${Number(item.price).toFixed(2)})`
                    }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Buy Qty (X) *</label>
                  <input
                    type="number"
                    min="1"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-black text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Reward Item & Reward Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Reward Item *</label>
                  <ModernDropdown
                    className="w-full"
                    value={rewardItemId}
                    onChange={setRewardItemId}
                    options={safeMenuItems.map((item) => ({
                      value: item.id,
                      label: `${item.name} (₹${Number(item.price).toFixed(2)})`
                    }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Get Qty (Y) *</label>
                  <input
                    type="number"
                    min="1"
                    value={rewardQuantity}
                    onChange={(e) => setRewardQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-black text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Reward Discount Type & Max Reward Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Reward Discount</label>
                  <ModernDropdown
                    className="w-full"
                    value={rewardDiscountType}
                    onChange={setRewardDiscountType}
                    options={[
                      { value: 'FREE', label: '100% Free' },
                      { value: 'PERCENTAGE', label: 'Percentage Discount (%)' },
                      { value: 'FIXED_AMOUNT', label: 'Fixed Discount (₹)' }
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase block mb-1">Max Rewards / Order</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2 (Unlimited if empty)"
                    value={maxRewardQuantity}
                    onChange={(e) => setMaxRewardQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>
            </div>
          ) : offerCategory === 'COMBO' ? (
            /* ================= COMBO DEALS FORM ================= */
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-3">
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider block">
                Combo Items &amp; Package Pricing
              </span>

              {/* Multi-item component selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#252525] uppercase block">
                  Select Combo Items &amp; Required Quantities *
                </label>
                {comboComponents.map((comp, idx) => {
                  const it = safeMenuItems.find(i => i.id === comp.itemId);
                  return (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <div className="flex-1 min-w-0">
                        <ModernDropdown
                          className="w-full text-xs"
                          value={comp.itemId}
                          onChange={(val) => {
                            const updated = [...comboComponents];
                            updated[idx].itemId = val;
                            setComboComponents(updated);
                          }}
                          options={safeMenuItems.map((item) => ({
                            value: item.id,
                            label: `${item.name} (₹${Number(item.price).toFixed(2)})`
                          }))}
                        />
                      </div>
                      <div className="w-20 shrink-0">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={comp.quantity}
                          onChange={(e) => {
                            const updated = [...comboComponents];
                            updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                            setComboComponents(updated);
                          }}
                          className="w-full px-2 py-2 bg-[#FFF5F5]/30 border border-[#FEE2E2] rounded-lg text-xs font-black text-center text-[#252525]"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#757575] shrink-0 w-16 text-right">
                        ₹{it ? (Number(it.price) * (Number(comp.quantity) || 1)).toFixed(2) : '0.00'}
                      </span>
                      {comboComponents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setComboComponents(comboComponents.filter((_, i) => i !== idx))}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    if (safeMenuItems.length > 0) {
                      setComboComponents([...comboComponents, { itemId: safeMenuItems[0].id, quantity: 1 }]);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Food Item
                </button>
              </div>

              {/* Original Calculated Price vs Combo Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-100">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Combined Menu Price (Original)
                  </label>
                  <div className="px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-black text-[#252525]">
                    ₹{comboOriginalTotal.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Combo Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={comboPrice}
                    onChange={(e) => setComboPrice(e.target.value)}
                    placeholder="e.g. 499"
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Max Combos per order */}
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Max Combos per Order (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxRewardQuantity}
                  onChange={(e) => setMaxRewardQuantity(e.target.value)}
                  placeholder="e.g. 3 (Default unlimited)"
                  className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-[#252525] outline-none"
                />
              </div>
            </div>
          ) : offerCategory === 'FLAT' ? (
            /* ================= FLAT RUPEE DISCOUNT FORM ================= */
            <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-200 space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-800 tracking-wider block">
                Flat Rupee (₹) Discount Configuration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Discount Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl text-xs font-black text-blue-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Min Order Value (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="e.g. 299"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-[#252525] outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ================= STANDARD PERCENTAGE OR CATEGORY DISCOUNT CONTROLS ================= */
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Discount {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'PERCENTAGE' ? '20' : '40'}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-black text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Max Cap (₹) {discountType === 'PERCENTAGE' ? '' : '(N/A)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={discountType === 'FIXED_AMOUNT'}
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914] disabled:bg-stone-50 disabled:text-stone-300"
                />
              </div>
            </div>
          )}

          {/* Optional Min Order & Max Redemptions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                placeholder="e.g. 299 (Optional)"
                className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Max Redemptions
              </label>
              <input
                type="number"
                min="1"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="e.g. 100 (Optional)"
                className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* LIVE DISCOUNT PREVIEW BANNER DYNAMIC */}
          <div className="bg-[#FFF5F5] border border-[#FEE2E2] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-5 h-5 text-[#FF6B00] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block truncate leading-none">
                  {offerCategory === 'BUY_X_GET_Y' 
                    ? `Live BOGO Preview • Buy ${buyQuantity}x ${buyItemObj?.name || 'Item'} → Get ${rewardQuantity}x ${rewardItemObj?.name || 'Item'} Free` 
                    : offerCategory === 'COMBO'
                    ? `Live Combo Preview • ${comboComponents.length} items bundled (Original: ₹${comboOriginalTotal.toFixed(2)})`
                    : offerCategory === 'FLAT'
                    ? `Live Flat Discount Preview • ₹${discountValue || 0} OFF on ${offerType === 'RESTAURANT' ? 'Entire Order' : targetItemName}`
                    : `Live Preview • ${targetItemName} (Original: ₹${originalPrice.toFixed(2)})`}
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs line-through text-stone-400 font-bold">
                    ₹{(sampleFinalPrice + calculatedSavings).toFixed(2)}
                  </span>
                  <span className="text-base font-black text-[#E50914]">
                    ₹{sampleFinalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black shrink-0 text-right">
              Saves ₹{calculatedSavings.toFixed(2)}
            </div>
          </div>

          {/* Dynamic Selection: Items or Categories when not BOGO/COMBO */}
          {offerCategory !== 'BUY_X_GET_Y' && offerCategory !== 'COMBO' && offerCategory !== 'FREE_ITEM' && offerType === 'ITEM' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider">
                  Select Applicable Items ({selectedItems.length}) *
                </label>
                {selectedItems.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedItems([])}
                    className="text-[10px] font-bold text-[#E50914] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-32 overflow-y-auto border border-[#FEE2E2] rounded-xl p-1.5 space-y-1 scrollbar-none bg-[#FFF5F5]/40">
                {safeMenuItems.length === 0 ? (
                  <p className="text-[11px] text-[#757575] p-2 text-center">No menu items created yet.</p>
                ) : (
                  safeMenuItems.map((item) => {
                    const isChecked = selectedItems.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${
                          isChecked ? 'bg-white shadow-2xs border border-[#FEE2E2]' : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedItems([...selectedItems, item.id]);
                              else setSelectedItems(selectedItems.filter((id) => id !== item.id));
                            }}
                            className="accent-[#E50914] w-3.5 h-3.5 rounded"
                          />
                          <span className="text-[#252525] truncate">{item.name}</span>
                        </div>
                        <span className="text-[#757575] shrink-0 font-mono text-[11px]">₹{Number(item.price).toFixed(2)}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Dynamic Selection: Categories */}
          {(offerCategory === 'CATEGORY' || (offerCategory !== 'BUY_X_GET_Y' && offerCategory !== 'COMBO' && offerCategory !== 'FREE_ITEM' && offerType === 'CATEGORY')) && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider">
                  Select Applicable Categories ({selectedCategories.length}) *
                </label>
                {selectedCategories.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedCategories([])}
                    className="text-[10px] font-bold text-[#E50914] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-28 overflow-y-auto border border-[#FEE2E2] rounded-xl p-1.5 space-y-1 scrollbar-none bg-[#FFF5F5]/40">
                {safeCategories.length === 0 ? (
                  <p className="text-[11px] text-[#757575] p-2 text-center">No categories created yet.</p>
                ) : (
                  safeCategories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${
                          isChecked ? 'bg-white shadow-2xs border border-[#FEE2E2]' : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedCategories([...selectedCategories, cat.id]);
                              else setSelectedCategories(selectedCategories.filter((id) => id !== cat.id));
                            }}
                            className="accent-[#E50914] w-3.5 h-3.5 rounded"
                          />
                          <span className="text-[#252525] truncate">{cat.name}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Schedule Dates with Custom Modern Pop-up Calendar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                Start Date & Time *
              </label>
              <ModernDateTimePicker
                value={startDate}
                onChange={setStartDate}
                label="Start Date & Time"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                End Date & Time *
              </label>
              <ModernDateTimePicker
                value={endDate}
                onChange={setEndDate}
                label="End Date & Time"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-[#FEE2E2]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : offer?.id ? 'Update Offer' : 'Publish Offer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
