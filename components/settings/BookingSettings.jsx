import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSettingsSchema } from '@/schemas/settings.schema';
import { Button } from '@/components/ui/Button';
import { Clock, Users, CheckCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

export const BookingSettings = ({ initialData, onSubmit, isPending }) => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: initialData || {
      booking_window_days: 30,
      min_notice_hours: 24,
      max_guests_per_booking: 50,
      auto_confirm: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Window & Notice */}
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-2">Time Restrictions</h3>
               
               <div>
                 <label className="block text-sm font-medium text-text mb-2">Booking Window (Days in advance)</label>
                 <div className="relative">
                   <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                   <input 
                     type="number" 
                     {...register('booking_window_days', { valueAsNumber: true })} 
                     className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.booking_window_days ? "border-danger" : "border-border")} 
                   />
                 </div>
                 <p className="text-xs text-text/50 mt-1">How far in advance can customers book.</p>
                 {errors.booking_window_days && <p className="text-xs text-danger mt-1">{errors.booking_window_days.message}</p>}
               </div>

               <div>
                 <label className="block text-sm font-medium text-text mb-2">Minimum Notice (Hours)</label>
                 <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                   <input 
                     type="number" 
                     {...register('min_notice_hours', { valueAsNumber: true })} 
                     className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.min_notice_hours ? "border-danger" : "border-border")} 
                   />
                 </div>
                 <p className="text-xs text-text/50 mt-1">Minimum time required before a booking starts.</p>
                 {errors.min_notice_hours && <p className="text-xs text-danger mt-1">{errors.min_notice_hours.message}</p>}
               </div>
            </div>

            {/* Capacity & Approval */}
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-2">Capacity & Approval</h3>
               
               <div>
                 <label className="block text-sm font-medium text-text mb-2">Max Guests Per Booking</label>
                 <div className="relative">
                   <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                   <input 
                     type="number" 
                     {...register('max_guests_per_booking', { valueAsNumber: true })} 
                     className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.max_guests_per_booking ? "border-danger" : "border-border")} 
                   />
                 </div>
                 {errors.max_guests_per_booking && <p className="text-xs text-danger mt-1">{errors.max_guests_per_booking.message}</p>}
               </div>

               <div className="p-4 bg-surface/30 rounded-2xl border border-border/50 flex items-start justify-between">
                 <div className="flex gap-3">
                   <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                   <div>
                     <h4 className="text-sm font-semibold text-text">Auto-Confirm Bookings</h4>
                     <p className="text-xs text-text/60 mt-1">Skip manual approval for new bookings.</p>
                   </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer mt-1">
                   <input type="checkbox" {...register('auto_confirm')} className="sr-only peer" />
                   <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                 </label>
               </div>
            </div>
         </div>
      </div>

      <div className="pt-6 border-t border-border/50 flex justify-end">
         <Button type="submit" disabled={!isDirty} isLoading={isPending} className="px-8 shadow-md">
           Save Booking Rules
         </Button>
      </div>
    </form>
  );
};

// Simple icon for calendar missing in lucide import occasionally
const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
