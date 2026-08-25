import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

const inclusionOptions = [
  { id: 'food', label: 'Food included' },
  { id: 'cake', label: 'Cake provided' },
  { id: 'decoration', label: 'Decorations' },
  { id: 'music', label: 'Music / DJ' },
];

export const InclusionsSection = () => {
  const { register, watch, setValue } = useFormContext();
  const isOtherChecked = watch('other');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {inclusionOptions.map((item) => {
          const isChecked = watch(item.id);
          return (
            <label 
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-surface/50 select-none",
                isChecked ? "border-primary bg-primary/5 shadow-2xs" : "border-border/70"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors",
                isChecked ? "bg-primary text-white" : "border-2 border-border"
              )}>
                {isChecked && <Check className="w-3.5 h-3.5" />}
              </div>
              <input type="checkbox" className="hidden" {...register(item.id)} />
              <span className={cn(
                "text-sm font-medium transition-colors",
                isChecked ? "text-primary font-semibold" : "text-text/70"
              )}>
                {item.label}
              </span>
            </label>
          );
        })}

        {/* Other option with custom user text input */}
        <div 
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all select-none",
            isOtherChecked ? "border-primary bg-primary/5 shadow-2xs" : "border-border/70 hover:bg-surface/50 cursor-pointer"
          )}
          onClick={() => {
            if (!isOtherChecked) {
              setValue('other', true, { shouldValidate: true, shouldDirty: true });
            }
          }}
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setValue('other', !isOtherChecked, { shouldValidate: true, shouldDirty: true });
            }}
            className={cn(
              "w-5 h-5 rounded-md flex items-center justify-center shrink-0 cursor-pointer transition-colors",
              isOtherChecked ? "bg-primary text-white" : "border-2 border-border"
            )}
          >
            {isOtherChecked && <Check className="w-3.5 h-3.5" />}
          </div>
          
          <input type="checkbox" className="hidden" {...register('other')} />

          {isOtherChecked ? (
            <input
              type="text"
              autoFocus
              placeholder="Enter custom inclusion / service..."
              className="flex-1 bg-transparent text-sm font-medium text-primary placeholder:text-text/40 focus:outline-hidden"
              {...register('other_text')}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm font-medium text-text/70 flex-1">
              Other
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
