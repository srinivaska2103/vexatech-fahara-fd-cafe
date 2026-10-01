import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportReportSchema } from '@/schemas/payment.schema';
import { cn } from '@/utils/cn';
import { CustomSelect } from '../ui/CustomSelect';
import { DatePicker } from '../ui/DatePicker';

export const ExportReportDialog = ({ isOpen, onClose, onConfirm, isExporting }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(exportReportSchema),
    defaultValues: {
      format: 'CSV',
      date_range: 'THIS_MONTH'
    }
  });

  const formatValue = watch('format');
  const dateRange = watch('date_range');

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

            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-text mb-2">Export Financial Report</h3>
            <p className="text-text/70 mb-6 text-sm">
              Generate a detailed report of your earnings, transactions, and refunds.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Format</label>
                  <CustomSelect
                    value={formatValue}
                    onChange={(val) => setValue('format', val)}
                    options={[
                      { value: 'CSV', label: 'CSV (Spreadsheet)' },
                      { value: 'EXCEL', label: 'Excel (.xlsx)' },
                      { value: 'PDF', label: 'PDF Document' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Date Range</label>
                  <CustomSelect
                    value={dateRange}
                    onChange={(val) => setValue('date_range', val)}
                    options={[
                      { value: 'TODAY', label: 'Today' },
                      { value: 'THIS_WEEK', label: 'This Week' },
                      { value: 'THIS_MONTH', label: 'This Month' },
                      { value: 'CUSTOM', label: 'Custom Range' }
                    ]}
                  />
                </div>

                {dateRange === 'CUSTOM' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text/70 mb-1">Start Date</label>
                      <DatePicker 
                        value={watch('start_date')} 
                        onChange={(e) => setValue('start_date', e.value || e.target?.value || '')}
                        error={errors.start_date?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text/70 mb-1">End Date</label>
                      <DatePicker 
                        value={watch('end_date')} 
                        onChange={(e) => setValue('end_date', e.value || e.target?.value || '')}
                        min={watch('start_date')}
                        error={errors.end_date?.message}
                      />
                    </div>
                  </div>
                )}
                {errors.start_date && <p className="text-xs text-danger">{errors.start_date.message}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isExporting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isExporting}
                >
                  Export Now
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
