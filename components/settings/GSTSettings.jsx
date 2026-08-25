import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';

export const GSTSettings = ({ initialData, onSubmit, isPending }) => {
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: initialData || {
      gst_registered: true,
      gstin: '22AAAAA0000A1Z5',
      tax_rate: 18,
      prices_include_tax: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="flex items-center gap-4 p-4 bg-surface/30 rounded-2xl border border-border/50">
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" {...register('gst_registered')} className="sr-only peer" />
           <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
         </label>
         <div>
           <p className="text-sm font-semibold text-text">Business is GST Registered</p>
           <p className="text-xs text-text/60 mt-0.5">Enable if you need to charge and collect GST.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label className="block text-sm font-medium text-text mb-2">GSTIN Number</label>
           <input 
             type="text" 
             {...register('gstin')} 
             className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase" 
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-text mb-2">Default Tax Rate (%)</label>
           <input 
             type="number" 
             {...register('tax_rate', { valueAsNumber: true })} 
             className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
           />
         </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-surface/30 rounded-2xl border border-border/50">
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" {...register('prices_include_tax')} className="sr-only peer" />
           <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
         </label>
         <div>
           <p className="text-sm font-semibold text-text">Prices are tax inclusive</p>
           <p className="text-xs text-text/60 mt-0.5">Toggle this if your catalog prices already include GST.</p>
         </div>
      </div>

      <div className="flex justify-end pt-4">
         <Button type="submit" disabled={!isDirty} isLoading={isPending}>
           Save Tax Settings
         </Button>
      </div>

    </form>
  );
};
