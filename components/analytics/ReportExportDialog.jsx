import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { CustomSelect } from '../ui/CustomSelect';

export const ReportExportDialog = ({ isOpen, onClose, onConfirm, isExporting }) => {
  const [type, setType] = useState('FULL');
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('THIS_MONTH');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ type, format, date_range: dateRange });
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

            <h3 className="text-xl font-semibold text-text mb-2">Export Analytics Report</h3>
            <p className="text-text/70 mb-6 text-sm">
              Generate comprehensive reports for your business intelligence.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Report Type</label>
                  <CustomSelect
                    value={type}
                    onChange={(val) => setType(val)}
                    options={[
                      { value: 'FULL', label: 'Full Business Overview' },
                      { value: 'REVENUE', label: 'Revenue & Financials' },
                      { value: 'BOOKINGS', label: 'Bookings & Occupancy' },
                      { value: 'CUSTOMERS', label: 'Customer Demographics' }
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Format</label>
                  <CustomSelect
                    value={format}
                    onChange={(val) => setFormat(val)}
                    options={[
                      { value: 'PDF', label: 'PDF Document (Visual)' },
                      { value: 'CSV', label: 'CSV (Raw Data)' },
                      { value: 'EXCEL', label: 'Excel (.xlsx)' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Date Range</label>
                  <CustomSelect
                    value={dateRange}
                    onChange={(val) => setDateRange(val)}
                    options={[
                      { value: 'THIS_MONTH', label: 'This Month' },
                      { value: 'LAST_MONTH', label: 'Last Month' },
                      { value: 'THIS_YEAR', label: 'This Year' },
                      { value: 'ALL', label: 'All Time' }
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isExporting}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isExporting}>
                  Generate Report
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
