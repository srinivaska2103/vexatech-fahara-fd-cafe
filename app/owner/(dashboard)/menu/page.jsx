'use client';

import { PageContainer } from '@/components/layout/PageContainer';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menu.service';
import { 
  UtensilsCrossed, 
  FolderPlus, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon,
  Upload,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModernDropdown from '@/components/ui/ModernDropdown';

export default function MenuManagementPage() {
  const queryClient = useQueryClient();

  // Active view tab: 'items' or 'categories'
  const [activeTab, setActiveTab] = useState('items');

  // Filters & Search for food items
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedFoodTypeFilter, setSelectedFoodTypeFilter] = useState('ALL');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState('ALL');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type: 'category'|'item', id, name }

  // 1. Fetch Menu Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['menu-stats'],
    queryFn: () => menuService.getMenuStats(),
  });
  const stats = statsData?.data || { totalCategories: 0, totalItems: 0, availableItems: 0, unavailableItems: 0 };

  // 2. Fetch Categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['menu-categories', { includeInactive: true }],
    queryFn: () => menuService.getCategories({ includeInactive: true }),
  });
  const categories = categoriesData?.data || [];

  // 3. Fetch Menu Items
  const { data: itemsData, isLoading: isItemsLoading } = useQuery({
    queryKey: ['menu-items', { 
      categoryId: selectedCategoryFilter !== 'ALL' ? selectedCategoryFilter : undefined,
      foodType: selectedFoodTypeFilter !== 'ALL' ? selectedFoodTypeFilter : undefined,
      isAvailable: selectedAvailabilityFilter !== 'ALL' ? selectedAvailabilityFilter : undefined,
      search: searchQuery || undefined
    }],
    queryFn: () => menuService.getMenuItems({
      categoryId: selectedCategoryFilter !== 'ALL' ? selectedCategoryFilter : undefined,
      foodType: selectedFoodTypeFilter !== 'ALL' ? selectedFoodTypeFilter : undefined,
      isAvailable: selectedAvailabilityFilter !== 'ALL' ? selectedAvailabilityFilter : undefined,
      search: searchQuery || undefined
    }),
  });
  const items = itemsData?.data || [];

  // Mutations
  const toggleItemAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }) => menuService.updateMenuItemAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
      toast.success('Food availability updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update availability')
  });

  const toggleCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => menuService.updateCategoryStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
      toast.success('Category status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update category status')
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => menuService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
      setDeleteConfirmation(null);
      toast.success('Category deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete category')
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => menuService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
      setDeleteConfirmation(null);
      toast.success('Food item deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete item')
  });

  return (
    <PageContainer className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#FFF5F5] border border-[#FEE2E2] rounded-2xl text-[#E50914]">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">Menu Management</h1>
              <p className="text-xs sm:text-sm text-[#757575] mt-0.5">Manage food categories, pricing, item availability, and customer menus.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#252525] hover:text-[#E50914] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#E50914]" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => { setEditingItem(null); setIsItemModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#E50914]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* A. Menu Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Total Categories</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-2">
            {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" /> : stats.totalCategories}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Active menu sections</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Total Food Items</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-2">
            {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" /> : stats.totalItems}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Catalog inventory</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Available Items</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" /> : stats.availableItems}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Ready for customer ordering</span>
        </div>

        <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#757575]">Sold Out Items</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" /> : stats.unavailableItems}
          </div>
          <span className="text-[10px] text-[#757575] mt-1 block">Marked unavailable</span>
        </div>
      </div>

      {/* Tabs Switcher: Food Items vs Categories */}
      <div className="flex items-center gap-2 border-b border-[#FEE2E2] pb-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'items'
              ? 'bg-[#E50914] text-white shadow-xs'
              : 'text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5]'
          }`}
        >
          Food Items ({items.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#E50914] text-white shadow-xs'
              : 'text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5]'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* VIEW 1: FOOD ITEMS LISTING */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food by name or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl text-xs text-[#252525] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914]"
              />
            </div>

            {/* Modern Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <ModernDropdown
                value={selectedCategoryFilter}
                onChange={setSelectedCategoryFilter}
                options={[
                  { value: 'ALL', label: 'All Categories' },
                  ...categories.map((c) => ({ value: c.id, label: c.name }))
                ]}
              />

              {/* Food Type Filter */}
              <ModernDropdown
                value={selectedFoodTypeFilter}
                onChange={setSelectedFoodTypeFilter}
                options={[
                  { value: 'ALL', label: 'All Food Types' },
                  { value: 'VEG', label: 'Pure Veg', badge: <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> },
                  { value: 'NON_VEG', label: 'Non-Veg', badge: <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> },
                  { value: 'EGG', label: 'Contains Egg', badge: <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> }
                ]}
              />

              {/* Availability Filter */}
              <ModernDropdown
                value={selectedAvailabilityFilter}
                onChange={setSelectedAvailabilityFilter}
                options={[
                  { value: 'ALL', label: 'All Status' },
                  { value: 'true', label: 'Available', badge: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> },
                  { value: 'false', label: 'Sold Out', badge: <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> }
                ]}
              />
            </div>
          </div>

          {/* Items Grid */}
          {isItemsLoading ? (
            <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-[#E50914] mx-auto mb-3" />
              <p className="text-xs font-bold text-[#757575]">Loading menu inventory...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-2xl">
              <div className="w-14 h-14 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto mb-3 text-[#E50914]">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#252525]">No food items found</h3>
              <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
                {searchQuery || selectedCategoryFilter !== 'ALL' || selectedFoodTypeFilter !== 'ALL'
                  ? 'No items matched your search filters. Try resetting the filters.'
                  : 'Get started by creating your first category and adding food items.'}
              </p>
              <button
                onClick={() => { setEditingItem(null); setIsItemModalOpen(true); }}
                className="mt-4 px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#B71C1C]"
              >
                + Add Food Item Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item) => {
                const isVeg = item.food_type === 'VEG';
                const isNonVeg = item.food_type === 'NON_VEG';
                const isEgg = item.food_type === 'EGG';

                return (
                  <div
                    key={item.id}
                    className={`group relative bg-white border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#E50914]/10 hover:-translate-y-1.5 ${
                      item.is_available
                        ? 'border-[#FEE2E2] hover:border-[#E50914]/50'
                        : 'border-stone-200 bg-stone-50/70 opacity-80'
                    }`}
                  >
                    <div>
                      {/* Item Image with smooth Zoom & Badges */}
                      <div className="relative h-48 w-full bg-[#FFF5F5] overflow-hidden cursor-pointer" onClick={() => { setEditingItem(item); setIsItemModalOpen(true); }}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#757575]/40 transition-colors group-hover:text-[#E50914]">
                            <ImageIcon className="w-10 h-10 mb-1" />
                            <span className="text-[10px] font-bold">No Image Provided</span>
                          </div>
                        )}

                        {/* Top Gradient Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Quick Edit Overlay Button appearing on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#252525] font-black text-xs shadow-lg backdrop-blur-xs flex items-center gap-1.5 scale-95 group-hover:scale-100 transition-transform">
                            <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                            Quick Edit
                          </span>
                        </div>

                        {/* Food Type Indicator (FSSAI green/red/yellow badge) */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-md border border-black/5 flex items-center gap-1.5 z-10">
                          <span className={`w-3.5 h-3.5 border-1.5 flex items-center justify-center rounded-xs ${
                            isVeg ? 'border-emerald-600' : isNonVeg ? 'border-red-600' : 'border-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isVeg ? 'bg-emerald-600' : isNonVeg ? 'bg-red-600' : 'bg-amber-600'
                            }`} />
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#252525]">
                            {isVeg ? 'Pure Veg' : isNonVeg ? 'Non-Veg' : 'Egg'}
                          </span>
                        </div>

                        {/* Featured Pill */}
                        {item.is_featured && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#E50914] to-[#B71C1C] text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-10 ring-2 ring-white/60">
                            <Sparkles className="w-2.5 h-2.5 fill-current" />
                            Featured
                          </div>
                        )}

                        {/* Availability Overlay if Sold Out */}
                        {!item.is_available && (
                          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-20">
                            <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl border border-white/20">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] bg-[#FFF5F5] px-2 py-0.5 rounded-md inline-block mb-1">
                              {item.menu_categories?.name || 'Category'}
                            </span>
                            <h4 className="text-sm font-black text-[#252525] truncate group-hover:text-[#E50914] transition-colors leading-snug">
                              {item.name}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-[#252525] block group-hover:text-[#E50914] transition-colors">
                              ₹{Number(item.price).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#757575] line-clamp-2 leading-relaxed min-h-[32px]">
                          {item.description || 'Deliciously prepared with high-quality ingredients.'}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-[#757575] pt-1 border-t border-[#FEE2E2]/60">
                          <span className="flex items-center gap-1 font-bold">
                            <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                            {item.preparation_time || 15} mins prep
                          </span>
                          <span className="text-[10px] font-bold text-stone-400">
                            Order #{item.display_order || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Card Action Bar */}
                    <div className="p-3 bg-[#FFF5F5]/70 border-t border-[#FEE2E2] flex items-center justify-between gap-2">
                      {/* Availability Toggle */}
                      <button
                        onClick={() => toggleItemAvailabilityMutation.mutate({ id: item.id, isAvailable: !item.is_available })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                          item.is_available
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                        }`}
                      >
                        {item.is_available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Mark Sold Out</span>
                          </>
                        )}
                      </button>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditingItem(item); setIsItemModalOpen(true); }}
                          className="p-2 text-[#757575] hover:text-white hover:bg-[#E50914] bg-white rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 border border-[#FEE2E2]"
                          title="Edit Food Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({ type: 'item', id: item.id, name: item.name })}
                          className="p-2 text-[#757575] hover:text-white hover:bg-rose-600 bg-white rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 border border-[#FEE2E2]"
                          title="Delete Food Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#FEE2E2] p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-extrabold text-[#252525]">Menu Categories</h3>
              <p className="text-xs text-[#757575]">Organize your menu into structured courses and sections.</p>
            </div>
            <button
              onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
              className="px-3.5 py-2 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              + New Category
            </button>
          </div>

          {isCategoriesLoading ? (
            <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-[#E50914] mx-auto mb-3" />
              <p className="text-xs font-bold text-[#757575]">Loading menu categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-16 text-center bg-white border border-[#FEE2E2] rounded-2xl">
              <FolderPlus className="w-10 h-10 text-[#E50914] mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-[#252525]">No categories created yet</h3>
              <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
                Create categories such as Appetizers, Main Course, Desserts, or Beverages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] overflow-hidden shrink-0 flex items-center justify-center">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 text-[#E50914]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-[#252525] truncate">{cat.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                      </div>
                      <p className="text-xs text-[#757575] line-clamp-2 mt-0.5">
                        {cat.description || 'No description provided.'}
                      </p>
                      <span className="text-[10px] font-bold text-[#757575] mt-2 block">
                        {cat._count?.menu_items || 0} items attached • Display order: {cat.display_order}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FEE2E2] flex items-center justify-between">
                    <button
                      onClick={() => toggleCategoryStatusMutation.mutate({ id: cat.id, isActive: !cat.is_active })}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        cat.is_active ? 'text-emerald-600 hover:text-emerald-700' : 'text-[#757575] hover:text-[#252525]'
                      }`}
                    >
                      {cat.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{cat.is_active ? 'Active' : 'Inactive'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                        className="p-1.5 text-[#757575] hover:text-[#E50914] hover:bg-[#FFF5F5] rounded-lg cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({ type: 'category', id: cat.id, name: cat.name })}
                        className="p-1.5 text-[#757575] hover:text-rose-600 hover:bg-[#FFF5F5] rounded-lg cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODAL: ADD/EDIT CATEGORY ==================== */}
      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={() => {
            setIsCategoryModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
            queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
          }}
        />
      )}

      {/* ==================== MODAL: ADD/EDIT FOOD ITEM ==================== */}
      {isItemModalOpen && (
        <FoodItemModal
          isOpen={isItemModalOpen}
          item={editingItem}
          categories={categories}
          onClose={() => setIsItemModalOpen(false)}
          onSuccess={() => {
            setIsItemModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
            queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
          }}
        />
      )}

      {/* ==================== MODAL: DELETE CONFIRMATION ==================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-[#252525]">Delete {deleteConfirmation.type === 'category' ? 'Category' : 'Food Item'}?</h3>
              <p className="text-xs text-[#757575] mt-1">
                Are you sure you want to delete <strong className="text-[#252525]">"{deleteConfirmation.name}"</strong>? This action cannot be undone.
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
                onClick={() => {
                  if (deleteConfirmation.type === 'category') {
                    deleteCategoryMutation.mutate(deleteConfirmation.id);
                  } else {
                    deleteItemMutation.mutate(deleteConfirmation.id);
                  }
                }}
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

// ==================== CATEGORY FORM MODAL ====================
function CategoryModal({ isOpen, category, onClose, onSuccess }) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [imageUrl, setImageUrl] = useState(category?.image_url || '');
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WebP images are supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const url = await menuService.uploadImage(file, (p) => setUploadProgress(p));
      setImageUrl(url);
      toast.success('Category image uploaded');
    } catch (err) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl || null,
        displayOrder: parseInt(displayOrder) || 0,
        isActive: Boolean(isActive)
      };

      if (category?.id) {
        await menuService.updateCategory(category.id, payload);
        toast.success('Category updated successfully');
      } else {
        await menuService.createCategory(payload);
        toast.success('Category created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#FEE2E2] shadow-2xl space-y-4">
        <h3 className="text-base font-extrabold text-[#252525]">
          {category ? 'Edit Menu Category' : 'Create Menu Category'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artisanal Coffees, Burgers, Starters"
              className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this menu category..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914] outline-none resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
              Category Image
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border border-[#FEE2E2] bg-[#FFF5F5] overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Category" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#757575]/40" />
                )}
              </div>
              <label className="flex-1 border border-dashed border-[#FEE2E2] hover:border-[#E50914] rounded-xl p-3 text-center cursor-pointer bg-[#FFF5F5]/40 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <span className="text-xs font-bold text-[#E50914]">
                  {isUploading ? `Uploading ${uploadProgress}%...` : 'Choose Category Image'}
                </span>
                <span className="text-[10px] text-[#757575] block mt-0.5">JPG, PNG, WebP up to 5MB</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Status
              </label>
              <ModernDropdown
                className="w-full"
                value={isActive ? 'true' : 'false'}
                onChange={(val) => setIsActive(val === 'true')}
                options={[
                  { 
                    value: 'true', 
                    label: 'Active (Visible)', 
                    badge: <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" /> 
                  },
                  { 
                    value: 'false', 
                    label: 'Inactive (Hidden)', 
                    badge: <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block shrink-0" /> 
                  }
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== FOOD ITEM FORM MODAL ====================
function FoodItemModal({ isOpen, item, categories, onClose, onSuccess }) {
  const [name, setName] = useState(item?.name || '');
  const [categoryId, setCategoryId] = useState(item?.category_id || (categories[0]?.id || ''));
  const [description, setDescription] = useState(item?.description || '');
  const [imageUrl, setImageUrl] = useState(item?.image_url || '');
  const [price, setPrice] = useState(item?.price || '');
  const [foodType, setFoodType] = useState(item?.food_type || 'VEG');
  const [preparationTime, setPreparationTime] = useState(item?.preparation_time || 15);
  const [displayOrder, setDisplayOrder] = useState(item?.display_order || 0);
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WebP images are supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const url = await menuService.uploadImage(file, (p) => setUploadProgress(p));
      setImageUrl(url);
      toast.success('Food image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Food item name is required');
      return;
    }
    if (!categoryId) {
      toast.error('Please assign a menu category');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      toast.error('Please specify a valid price');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        categoryId,
        description: description.trim() || null,
        imageUrl: imageUrl || null,
        price: Number(price),
        foodType,
        isAvailable: Boolean(isAvailable),
        preparationTime: parseInt(preparationTime) || 15,
        displayOrder: parseInt(displayOrder) || 0,
        isFeatured: Boolean(isFeatured)
      };

      if (item?.id) {
        await menuService.updateMenuItem(item.id, payload);
        toast.success('Food item updated successfully');
      } else {
        await menuService.createMenuItem(payload);
        toast.success('Food item created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save food item');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#FEE2E2] shadow-2xl space-y-4 my-8">
        <h3 className="text-base font-extrabold text-[#252525]">
          {item ? 'Edit Food Item' : 'Add New Food Item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Signature Truffle Pasta"
                className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Category *
              </label>
              <ModernDropdown
                className="w-full"
                value={categoryId}
                onChange={(val) => setCategoryId(val)}
                placeholder="Select category"
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                  badge: <span className={`w-2 h-2 rounded-full ${c.is_active ? 'bg-emerald-500' : 'bg-stone-300'} inline-block shrink-0`} />
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249.00"
                className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Food Classification *
              </label>
              <ModernDropdown
                className="w-full"
                value={foodType}
                onChange={(val) => setFoodType(val)}
                options={[
                  { 
                    value: 'VEG', 
                    label: 'Pure Veg', 
                    badge: <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shrink-0 ring-2 ring-emerald-100" /> 
                  },
                  { 
                    value: 'NON_VEG', 
                    label: 'Non-Veg', 
                    badge: <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shrink-0 ring-2 ring-red-100" /> 
                  },
                  { 
                    value: 'EGG', 
                    label: 'Contains Egg', 
                    badge: <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0 ring-2 ring-amber-100" /> 
                  }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh handmade pasta, shaved winter black truffles, aged parmesan..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] outline-none focus:border-[#E50914] resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
              Food Image
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-[#FEE2E2] bg-[#FFF5F5] overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Food Item" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-[#757575]/40" />
                )}
              </div>
              <label className="flex-1 border border-dashed border-[#FEE2E2] hover:border-[#E50914] rounded-xl p-3 text-center cursor-pointer bg-[#FFF5F5]/40 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <span className="text-xs font-bold text-[#E50914]">
                  {isUploading ? `Uploading image ${uploadProgress}%...` : 'Upload Food Photo'}
                </span>
                <span className="text-[10px] text-[#757575] block mt-0.5">JPG, PNG, WebP up to 5MB</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-[#252525] uppercase tracking-wider block mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-medium text-[#252525] outline-none"
              />
            </div>
          </div>

          {/* Availability and Featured toggles */}
          <div className="flex items-center justify-between p-3 bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#E50914] rounded"
              />
              <span className="text-xs font-bold text-[#252525]">Currently Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#E50914] rounded"
              />
              <span className="text-xs font-bold text-[#252525]">Chef's Special / Featured</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              Save Food Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

