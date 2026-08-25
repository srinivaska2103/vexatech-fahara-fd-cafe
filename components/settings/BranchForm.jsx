import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema } from '@/schemas/settings.schema';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

export const BranchForm = ({ isOpen, onClose, onSubmit, initialData = null, isPending }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      name: '',
      phone: '',
      email: '',
      address: '',
      status: 'ACTIVE'
    }
  });

  // Reset form when opened with new data
  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', phone: '', email: '', address: '', status: 'ACTIVE' });
    }
  }, [isOpen, initialData, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-border/50 flex justify-between items-center shrink-0">
               <h3 className="text-xl font-bold text-text">{initialData ? 'Edit Branch' : 'Add New Branch'}</h3>
               <button onClick={onClose} className="p-2 text-text/40 hover:bg-surface rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                 
                 <div>
                   <label className="block text-sm font-medium text-text mb-2">Branch Name <span className="text-danger">*</span></label>
                   <div className="relative">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                     <input type="text" {...register('name')} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.name ? "border-danger" : "border-border")} />
                   </div>
                   {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                 </div>

                 <div className="grid grid-cols-2 gap-5">
                   <div>
                     <label className="block text-sm font-medium text-text mb-2">Phone <span className="text-danger">*</span></label>
                     <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                       <input type="text" {...register('phone')} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.phone ? "border-danger" : "border-border")} />
                     </div>
                     {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-text mb-2">Email <span className="text-danger">*</span></label>
                     <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                       <input type="email" {...register('email')} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.email ? "border-danger" : "border-border")} />
                     </div>
                     {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-text mb-2">Physical Address <span className="text-danger">*</span></label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-4 w-4 h-4 text-text/40" />
                     <textarea rows={3} {...register('address')} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none", errors.address ? "border-danger" : "border-border")} />
                   </div>
                   {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-text mb-2">Status</label>
                   <select {...register('status')} className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                     <option value="ACTIVE">Active</option>
                     <option value="INACTIVE">Inactive</option>
                   </select>
                 </div>

              </form>
            </div>

            <div className="p-6 border-t border-border/50 flex justify-end gap-3 shrink-0 bg-surface/10">
               <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
               <Button type="submit" form="branch-form" isLoading={isPending}>
                 {initialData ? 'Save Changes' : 'Add Branch'}
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
