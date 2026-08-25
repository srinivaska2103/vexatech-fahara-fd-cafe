import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessProfileSchema } from '@/schemas/settings.schema';
import { Button } from '@/components/ui/Button';
import { Building2, Mail, Phone, Globe, MapPin, UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';

export const BusinessProfileForm = ({ initialData, onSubmit, isPending }) => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: initialData || {
      business_name: '',
      email: '',
      phone: '',
      website: '',
      gst_number: '',
      pan_number: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postal_code: '',
      latitude: 0,
      longitude: 0
    },
    values: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      
      {/* Brand Identity */}
      <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-border/50">
         <div className="shrink-0 space-y-3">
            <h4 className="text-sm font-semibold text-text">Brand Logo</h4>
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-surface/30 cursor-pointer hover:bg-surface/50 transition-colors">
               <UploadCloud className="w-6 h-6 text-primary mb-2" />
               <span className="text-xs text-text/50 font-medium">Upload Image</span>
            </div>
         </div>
         <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Business Name <span className="text-danger">*</span></label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                <input 
                  type="text" 
                  {...register('business_name')} 
                  className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.business_name ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
                />
              </div>
              {errors.business_name && <p className="text-xs text-danger mt-1">{errors.business_name.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-text mb-2">Tax ID (GST) </label>
                 <input 
                   type="text" 
                   {...register('gst_number')} 
                   placeholder="e.g. 22AAAAA0000A1Z5"
                   className="w-full px-4 py-3 rounded-xl border border-border/60 bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 uppercase" 
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-text mb-2">PAN Number</label>
                 <input 
                   type="text" 
                   {...register('pan_number')} 
                   className="w-full px-4 py-3 rounded-xl border border-border/60 bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 uppercase" 
                 />
               </div>
            </div>
         </div>
      </div>

      {/* Contact Information */}
      <div className="pb-8 border-b border-border/50 space-y-6">
         <h3 className="text-lg font-bold text-text">Contact Details</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Support Email <span className="text-danger">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                <input 
                  type="email" 
                  {...register('email')} 
                  className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.email ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Phone Number <span className="text-danger">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                <input 
                  type="text" 
                  {...register('phone')} 
                  className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.phone ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
                />
              </div>
              {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-2">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                <input 
                  type="url" 
                  {...register('website')} 
                  placeholder="https://"
                  className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.website ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
                />
              </div>
              {errors.website && <p className="text-xs text-danger mt-1">{errors.website.message}</p>}
            </div>
         </div>
      </div>

      {/* Address & Location */}
      <div className="space-y-6">
         <h3 className="text-lg font-bold text-text">Headquarters Address</h3>
         
         <div>
           <label className="block text-sm font-medium text-text mb-2">Street Address <span className="text-danger">*</span></label>
           <div className="relative">
             <MapPin className="absolute left-4 top-4 w-4 h-4 text-text/40" />
             <textarea 
               {...register('address')} 
               rows={3}
               className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none", errors.address ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
             />
           </div>
           {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-text mb-2">City <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register('city')} 
                className={cn("w-full px-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.city ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
              />
              {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-text mb-2">State <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register('state')} 
                className={cn("w-full px-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.state ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
              />
              {errors.state && <p className="text-xs text-danger mt-1">{errors.state.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-text mb-2">Postal Code <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register('postal_code')} 
                className={cn("w-full px-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.postal_code ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
              />
              {errors.postal_code && <p className="text-xs text-danger mt-1">{errors.postal_code.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-text mb-2">Country <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register('country')} 
                className={cn("w-full px-4 py-3 rounded-xl border bg-surface/30 text-sm transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10", errors.country ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60")} 
              />
              {errors.country && <p className="text-xs text-danger mt-1">{errors.country.message}</p>}
            </div>
         </div>
      </div>

      <div className="pt-6 border-t border-border/50 flex justify-end">
         <Button type="submit" disabled={!isDirty} isLoading={isPending} className="px-8 shadow-md">
           Save Changes
         </Button>
      </div>
    </form>
  );
};
