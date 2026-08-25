'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Wifi, Car, Wind, MonitorPlay, Speaker, 
  Sun, Coffee, Baby, Accessibility, Dog 
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

  const toggleAmenity = (id) => {
    if (selectedAmenities.includes(id)) {
      setValue('amenities', selectedAmenities.filter(a => a !== id), { shouldDirty: true });
    } else {
      setValue('amenities', [...selectedAmenities, id], { shouldDirty: true });
    }
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", className)}>
      {AMENITIES_LIST.map(({ id, label, icon: Icon }) => {
        const isSelected = selectedAmenities.includes(id);
        
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleAmenity(id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 group",
              isSelected 
                ? "bg-primary/5 border-primary text-primary shadow-sm" 
                : "bg-white border-border text-text/70 hover:bg-surface hover:border-primary/50"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-2 transition-transform", isSelected ? "scale-110" : "group-hover:scale-110")} />
            <span className="text-xs font-medium text-center leading-tight">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
