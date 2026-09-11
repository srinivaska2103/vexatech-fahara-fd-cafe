import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Sparkles, IndianRupee } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

export const EventPricing = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="price">Base Package Price (₹) *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
            <IndianRupee className="w-4 h-4 text-[#6F4E37]" />
          </div>
          <Input 
            id="price" 
            type="number" 
            min="0" 
            step="1" 
            className="pl-9 font-extrabold text-sm text-[#2C1810]" 
            {...register('price')} 
            error={errors.price?.message} 
            placeholder="e.g. 2999" 
          />
        </div>
        <p className="text-[10px] text-text/50 mt-1">Base rate for this package tier. Additional item inclusions will be added based on selection.</p>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF5EA] border border-[#DDB892]/60 shadow-2xs space-y-1.5 text-[#2C1810]">
        <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#6F4E37] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#6F4E37]" />
          <span>Fahara Modern Pricing Model</span>
        </div>
        <p className="text-[11px] text-text/70 leading-relaxed">
          Standard features marked as "Included Feature" are covered under this base price. Any "Optional Add-on" features will be added transparently at checkout.
        </p>
      </div>
    </div>
  );
};


