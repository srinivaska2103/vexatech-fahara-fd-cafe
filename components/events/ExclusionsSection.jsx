import React from 'react';
import { XCircle } from 'lucide-react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ExclusionsSection = () => {
  const { control, register } = useFormContext();
  
  // Fake field array for UI purposes since backend doesn't support exclusions array in schema
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exclusions_ui_only'
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-text/60">List items that are strictly not included in this package.</p>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input 
              {...register(`exclusions_ui_only.${index}.name`)} 
              placeholder="e.g. Alcohol not included" 
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="px-3 border-danger/20 text-danger hover:bg-danger/5"
              onClick={() => remove(index)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button 
        type="button" 
        variant="secondary" 
        size="sm" 
        onClick={() => append({ name: '' })}
      >
        + Add Exclusion
      </Button>
    </div>
  );
};
