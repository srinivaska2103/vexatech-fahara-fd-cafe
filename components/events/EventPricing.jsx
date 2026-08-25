import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export const EventPricing = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="price">Base Package Price</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-text/40" />
          </div>
          <Input 
            id="price" 
            type="number" 
            className="pl-9 font-medium" 
            placeholder="e.g. 500"
            {...register('price')} 
            error={errors.price?.message} 
          />
        </div>
        <p className="text-xs text-text/50 mt-1.5">This is the default price for the event package.</p>
      </div>
    </div>
  );
};

