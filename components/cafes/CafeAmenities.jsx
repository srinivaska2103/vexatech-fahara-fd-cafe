'use client';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Wifi, Car, Wind, MonitorPlay, Speaker, 
  Sun, Coffee, Baby, Accessibility, Dog,
  Plus, X, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

const AMENITIES_LIST = [
  { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'projector', label: 'Projector', icon: MonitorPlay },
  { id: 'sound', label: 'Sound System', icon: Speaker },
  { id: 'outdoor', label: 'Outdoor Seating', icon: Sun },
  { id: 'indoor', label: 'Indoor Seating', icon: Coffee },
  { id: 'kids', label: 'Kids Area', icon: Baby },
  { id: 'wheelchair', label: 'Wheelchair Access', icon: Accessibility },
  { id: 'pets', label: 'Pet Friendly', icon: Dog },
];

export const CafeAmenities = ({ className }) => {
  const { watch, setValue } = useFormContext();
  const selectedAmenities = watch('amenities') || [];
  const [customInput, setCustomInput] = useState('');

  const toggleAmenity = (id) => {
    if (selectedAmenities.includes(id)) {
      setValue('amenities', selectedAmenities.filter(a => a !== id), { shouldDirty: true });
    } else {
      setValue('amenities', [...selectedAmenities, id], { shouldDirty: true });
    }
  };

  const presetIds = AMENITIES_LIST.map(a => a.id);
  const customAmenities = selectedAmenities.filter(
    a => !presetIds.includes(a) && !AMENITIES_LIST.some(p => p.label.toLowerCase() === String(a).toLowerCase())
  );

  const handleAddCustomAmenity = (e) => {
    e?.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    // Check if matches an existing preset
    const matchingPreset = AMENITIES_LIST.find(
      p => p.label.toLowerCase() === trimmed.toLowerCase() || p.id.toLowerCase() === trimmed.toLowerCase()
    );

    if (matchingPreset) {
      if (!selectedAmenities.includes(matchingPreset.id)) {
        setValue('amenities', [...selectedAmenities, matchingPreset.id], { shouldDirty: true });
      }
    } else if (!selectedAmenities.some(a => String(a).toLowerCase() === trimmed.toLowerCase())) {
      setValue('amenities', [...selectedAmenities, trimmed], { shouldDirty: true });
    }

    setCustomInput('');
  };

  const handleRemoveCustomAmenity = (amenityToRemove) => {
    setValue('amenities', selectedAmenities.filter(a => a !== amenityToRemove), { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      {/* Standard Amenities Grid */}
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", className)}>
        {AMENITIES_LIST.map(({ id, label, icon: Icon }) => {
          const isSelected = selectedAmenities.includes(id);
          
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleAmenity(id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 group cursor-pointer",
                isSelected 
                  ? "bg-[#6F4E37]/10 border-[#6F4E37] text-[#6F4E37] shadow-2xs font-bold" 
                  : "bg-white border-border text-text/70 hover:bg-surface hover:border-[#6F4E37]/50"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-2 transition-transform", isSelected ? "scale-110 text-[#6F4E37]" : "group-hover:scale-110 text-text/60")} />
              <span className="text-xs font-semibold text-center leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Custom Amenity Section */}
      <div className="pt-4 border-t border-border/40 space-y-3">
        <label className="text-xs font-extrabold text-[#2C1810] flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Add Custom Venue Amenity</span>
        </label>
        
        <div className="flex items-center gap-2 max-w-lg">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomAmenity();
              }
            }}
            placeholder="e.g. Valet Parking, Live DJ, Rooftop Terrace..."
            className="flex-1 h-10 px-4 text-xs font-medium rounded-xl border border-border/70 bg-surface/30 focus:outline-none focus:bg-white focus:border-[#6F4E37] transition-all"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            disabled={!customInput.trim()}
            className="h-10 px-4 rounded-xl bg-[#6F4E37] text-white text-xs font-extrabold hover:bg-[#5a3e2b] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Display Custom Added Amenities Pills */}
        {customAmenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] font-bold text-text/50 uppercase tracking-wider mr-1">Custom Amenities:</span>
            {customAmenities.map((customAmenity) => (
              <span
                key={customAmenity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/30 text-xs font-extrabold animate-fade-in shadow-2xs"
              >
                <span>{customAmenity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomAmenity(customAmenity)}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#6F4E37]/20 text-[#6F4E37] transition-all cursor-pointer ml-0.5"
                  title="Remove amenity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
