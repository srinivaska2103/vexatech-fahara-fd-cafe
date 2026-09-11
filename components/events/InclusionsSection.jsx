'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Check, 
  Plus, 
  Trash2, 
  UtensilsCrossed, 
  Cake, 
  Sparkles, 
  Music, 
  Tag,
  IndianRupee,
  Users,
  Box,
  Layers,
  Star,
  Edit2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const InclusionsSection = () => {
  const { watch, setValue } = useFormContext();

  const packageLevel = watch('package_level') || 'STANDARD';
  const packageInclusions = watch('package_inclusions') || watch('inclusions_list') || [];

  const [incName, setIncName] = useState('');
  const [incCategory, setIncCategory] = useState('Food & Catering');
  const [pricingType, setPricingType] = useState('PER_GUEST');
  const [inclusionType, setInclusionType] = useState('INCLUDED');

  // Tier-wise price & description states
  const [basicPrice, setBasicPrice] = useState('100');
  const [basicDesc, setBasicDesc] = useState('Basic menu & welcome drinks');
  
  const [standardPrice, setStandardPrice] = useState('250');
  const [standardDesc, setStandardDesc] = useState('Standard buffet & celebration cake');
  
  const [premiumPrice, setPremiumPrice] = useState('400');
  const [premiumDesc, setPremiumDesc] = useState('Full premium buffet & custom cake setup');

  const handleAddInclusion = (e) => {
    e.preventDefault();
    if (!incName || !incName.trim()) {
      import('react-hot-toast').then(m => m.default.error('Please enter an Inclusion Name (e.g. Food & Catering)'));
      return;
    }

    const tiers = [
      {
        tier_name: 'BASIC',
        description: basicDesc.trim() || 'Basic tier setup',
        pricing_type: pricingType,
        unit_price: basicPrice && !isNaN(Number(basicPrice)) ? Number(basicPrice) : 0,
      },
      {
        tier_name: 'STANDARD',
        description: standardDesc.trim() || 'Standard tier setup',
        pricing_type: pricingType,
        unit_price: standardPrice && !isNaN(Number(standardPrice)) ? Number(standardPrice) : 0,
      },
      {
        tier_name: 'PREMIUM',
        description: premiumDesc.trim() || 'Premium tier setup',
        pricing_type: pricingType,
        unit_price: premiumPrice && !isNaN(Number(premiumPrice)) ? Number(premiumPrice) : 0,
      },
    ];

    // Pick active unit price matching current package level
    const currentTier = tiers.find(t => t.tier_name === packageLevel) || tiers[1];

    const newInc = {
      id: `inc_${Date.now()}`,
      name: incName.trim(),
      category: incCategory || incName.trim(),
      description: currentTier.description,
      pricing_type: pricingType,
      unit_price: currentTier.unit_price,
      basic_price: Number(basicPrice) || 0,
      basic_desc: basicDesc,
      standard_price: Number(standardPrice) || 0,
      standard_desc: standardDesc,
      premium_price: Number(premiumPrice) || 0,
      premium_desc: premiumDesc,
      tiers: tiers,
      quantity: 1,
      inclusion_type: inclusionType,
      is_optional: inclusionType === 'OPTIONAL_ADDON',
      is_active: true,
      display_order: packageInclusions.length,
    };

    const updated = [...packageInclusions, newInc];
    setValue('package_inclusions', updated, { shouldDirty: true, shouldValidate: true });
    setValue('inclusions_list', updated, { shouldDirty: true, shouldValidate: true });

    import('react-hot-toast').then(m => m.default.success(`Added "${incName.trim()}" with Basic, Standard & Premium tiers!`));

    // Reset input fields
    setIncName('');
    setBasicPrice('100');
    setBasicDesc('Basic menu & welcome drinks');
    setStandardPrice('250');
    setStandardDesc('Standard buffet & celebration cake');
    setPremiumPrice('400');
    setPremiumDesc('Full premium buffet & custom cake setup');
  };

  const handleRemoveInclusion = (index) => {
    const updated = packageInclusions.filter((_, idx) => idx !== index);
    setValue('package_inclusions', updated, { shouldDirty: true });
    setValue('inclusions_list', updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 text-[#2C1810]">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 shadow-2xs space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-black">
          <Layers className="w-3.5 h-3.5" />
          <span>TIER-WISE INCLUSIONS BUILDER</span>
        </div>
        <h3 className="text-xl font-extrabold text-[#2C1810]">
          Package Inclusions & Tier Pricing Configuration
        </h3>
        <p className="text-xs text-text/70">
          Configure independent Basic, Standard, and Premium prices for each feature. Customers pick ONE package level and tier.
        </p>
      </div>

      {/* Add New Tiered Inclusion Form */}
      <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F4E37] block">
              Add Package Feature & Configure Tier Prices
            </span>
            <p className="text-[11px] text-text/60 font-medium">Click a preset or specify custom tier-wise pricing below.</p>
          </div>
          <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#DDB892]/50 shrink-0">
            {packageInclusions.length} Feature{packageInclusions.length !== 1 ? 's' : ''} Configured
          </span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text/50 block">Quick Presets:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Food & Catering', category: 'Food & Catering', pType: 'PER_GUEST', bP: '100', bD: 'Basic Veg Starters', sP: '250', sD: 'Standard Buffet + Drink', pP: '400', pD: 'Premium Live Buffet + Desserts' },
              { name: 'Celebration Cake', category: 'Celebration Cake', pType: 'FIXED', bP: '300', bD: '1kg Classic Cake', sP: '600', sD: '2kg Custom Cake', pP: '1000', pD: '3kg Premium Custom Theme Cake' },
              { name: 'Event Decoration', category: 'Decoration', pType: 'FIXED', bP: '500', bD: 'Basic Balloons', sP: '1000', sD: 'Balloon Arch + Welcome Board', pP: '2000', pD: 'Full Theme Decor & Stage Lights' },
              { name: 'Photography', category: 'Photography', pType: 'FIXED', bP: '1000', bD: '1 Hour Digital Photos', sP: '2500', sD: '3 Hours HD Photography', pP: '5000', pD: 'Full Event Coverage + Video Album' },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setIncName(preset.name);
                  setIncCategory(preset.category);
                  setPricingType(preset.pType);
                  setBasicPrice(preset.bP);
                  setBasicDesc(preset.bD);
                  setStandardPrice(preset.sP);
                  setStandardDesc(preset.sD);
                  setPremiumPrice(preset.pP);
                  setPremiumDesc(preset.pD);
                }}
                className="px-3 py-1.5 rounded-xl bg-surface/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/50 text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1">Inclusion Name *</label>
            <input
              type="text"
              value={incName}
              onChange={(e) => setIncName(e.target.value)}
              placeholder="e.g. Food & Catering, Celebration Cake"
              className="w-full h-10 px-3.5 rounded-xl border border-border/60 bg-surface/30 focus:bg-white text-xs font-bold text-[#2C1810] focus:ring-2 focus:ring-[#6F4E37]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1">Pricing Model *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'PER_GUEST', label: 'Per Guest', sub: '₹ × guest count' },
                { id: 'FIXED', label: 'Fixed Amount', sub: 'Flat total rate' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPricingType(p.id)}
                  className={cn(
                    "h-10 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center",
                    pricingType === p.id 
                      ? "bg-[#6F4E37] text-white border-[#6F4E37] font-black shadow-2xs" 
                      : "bg-surface/30 text-[#2C1810] border-border/60 hover:bg-white font-bold"
                  )}
                >
                  <p className="text-xs leading-none">{p.label}</p>
                  <p className={cn("text-[9px] mt-0.5", pricingType === p.id ? "text-white/80" : "text-text/50")}>{p.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tier-Wise Comparison Input Grid */}
        <div className="space-y-2 pt-2">
          <label className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">
            Tier-Wise Rates ({pricingType === 'PER_GUEST' ? 'Rate / Guest' : 'Fixed Amount'}) *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* BASIC TIER */}
            <div className="p-4 rounded-2xl border border-stone-300 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-700 uppercase tracking-wider">BASIC TIER</span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">Essential</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-text/60 block mb-1">Basic Price (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-text/40">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={basicPrice}
                    onChange={(e) => setBasicPrice(e.target.value)}
                    placeholder="100"
                    className="w-full h-9 pl-7 pr-3 rounded-xl border border-stone-300 bg-white text-xs font-black text-[#2C1810] outline-none focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-text/60 block mb-1">Basic Description</label>
                <input
                  type="text"
                  value={basicDesc}
                  onChange={(e) => setBasicDesc(e.target.value)}
                  placeholder="e.g. Basic starters & drink"
                  className="w-full h-9 px-3 rounded-xl border border-stone-300 bg-white text-xs font-medium text-[#2C1810] outline-none"
                />
              </div>
            </div>

            {/* STANDARD TIER */}
            <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider">STANDARD TIER</span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full">Popular</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-900/70 block mb-1">Standard Price (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-text/40">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={standardPrice}
                    onChange={(e) => setStandardPrice(e.target.value)}
                    placeholder="250"
                    className="w-full h-9 pl-7 pr-3 rounded-xl border border-amber-300 bg-white text-xs font-black text-[#2C1810] outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-900/70 block mb-1">Standard Description</label>
                <input
                  type="text"
                  value={standardDesc}
                  onChange={(e) => setStandardDesc(e.target.value)}
                  placeholder="e.g. Full buffet & cake"
                  className="w-full h-9 px-3 rounded-xl border border-amber-300 bg-white text-xs font-medium text-[#2C1810] outline-none"
                />
              </div>
            </div>

            {/* PREMIUM TIER */}
            <div className="p-4 rounded-2xl border border-[#DDB892] bg-[#FFF8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#6F4E37] uppercase tracking-wider">PREMIUM TIER</span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-[#6F4E37] text-white rounded-full">VIP Full</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6F4E37]/80 block mb-1">Premium Price (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-text/40">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(e.target.value)}
                    placeholder="400"
                    className="w-full h-9 pl-7 pr-3 rounded-xl border border-[#DDB892] bg-white text-xs font-black text-[#2C1810] outline-none focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6F4E37]/80 block mb-1">Premium Description</label>
                <input
                  type="text"
                  value={premiumDesc}
                  onChange={(e) => setPremiumDesc(e.target.value)}
                  placeholder="e.g. Live counters & custom desserts"
                  className="w-full h-9 px-3 rounded-xl border border-[#DDB892] bg-white text-xs font-medium text-[#2C1810] outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={handleAddInclusion}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:from-[#5C402E] hover:to-[#8E6747] text-white text-xs font-extrabold shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Save Tiered Feature Inclusion</span>
        </button>
      </div>

      {/* Configured Features Grid */}
      {packageInclusions.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F4E37] block">
            Configured Package Inclusions ({packageInclusions.length})
          </span>

          <div className="space-y-3">
            {packageInclusions.map((inc, index) => {
              const pType = (inc.pricing_type || 'FIXED').toUpperCase();

              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white border border-[#DDB892]/60 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#6F4E37]/10 text-[#6F4E37]">
                        {inc.category || 'Feature'}
                      </span>
                      <h4 className="font-extrabold text-[#2C1810] text-sm">{inc.name}</h4>
                      <span className="text-[10px] text-text/50 font-bold">({pType === 'PER_GUEST' ? 'Per Guest' : 'Fixed Amount'})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveInclusion(index)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                      title="Remove Inclusion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tier Comparison Summary Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-0.5">
                      <p className="text-[10px] font-black text-stone-700">BASIC</p>
                      <p className="font-extrabold text-[#2C1810]">
                        ₹{inc.basic_price ?? inc.unit_price ?? 0} {pType === 'PER_GUEST' ? '/ guest' : 'fixed'}
                      </p>
                      <p className="text-[9px] text-text/60 truncate">{inc.basic_desc || inc.description || 'Basic tier'}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-0.5">
                      <p className="text-[10px] font-black text-amber-800">STANDARD</p>
                      <p className="font-extrabold text-[#2C1810]">
                        ₹{inc.standard_price ?? inc.unit_price ?? 0} {pType === 'PER_GUEST' ? '/ guest' : 'fixed'}
                      </p>
                      <p className="text-[9px] text-text/60 truncate">{inc.standard_desc || inc.description || 'Standard tier'}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 text-xs space-y-0.5">
                      <p className="text-[10px] font-black text-[#6F4E37]">PREMIUM</p>
                      <p className="font-extrabold text-[#2C1810]">
                        ₹{inc.premium_price ?? inc.unit_price ?? 0} {pType === 'PER_GUEST' ? '/ guest' : 'fixed'}
                      </p>
                      <p className="text-[9px] text-text/60 truncate">{inc.premium_desc || inc.description || 'Premium tier'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

