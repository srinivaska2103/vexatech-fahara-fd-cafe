import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blockCustomerSchema } from '@/schemas/customer.schema';
import { cn } from '@/utils/cn';

export const BlockCustomerDialog = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(blockCustomerSchema),
  });

  const onSubmit = (data) => {
    onConfirm(data);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text hover:bg-surface rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-danger" />
            </div>

            <h3 className="text-xl font-semibold text-text mb-2">Block Customer</h3>
            <p className="text-text/70 mb-6 text-sm">
              Blocking this customer will prevent them from making future bookings at your cafes. Please provide a reason for your records.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">Reason for blocking</label>
                <textarea
                  {...register('reason')}
                  rows={4}
                  className={cn(
                    "w-full rounded-xl border bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger transition-colors resize-none",
                    errors.reason ? "border-danger" : "border-border"
                  )}
                  placeholder="e.g., Repeated no-shows, violation of cafe policies..."
                />
                {errors.reason && <p className="mt-1.5 text-xs text-danger">{errors.reason.message}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  className="bg-danger hover:bg-danger/90 text-white border-transparent"
                >
                  Block Customer
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
