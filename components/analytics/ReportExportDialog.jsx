import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const ReportExportDialog = ({ isOpen, onClose, onConfirm, isExporting }) => {
  // We can use native HTML form since this is simple
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onConfirm(Object.fromEntries(formData));
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
                  <select name="type" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <option value="FULL">Full Business Overview</option>
                    <option value="REVENUE">Revenue & Financials</option>
                    <option value="BOOKINGS">Bookings & Occupancy</option>
                    <option value="CUSTOMERS">Customer Demographics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Format</label>
                  <select name="format" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <option value="PDF">PDF Document (Visual)</option>
                    <option value="CSV">CSV (Raw Data)</option>
                    <option value="EXCEL">Excel (.xlsx)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Date Range</label>
                  <select name="date_range" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <option value="THIS_MONTH">This Month</option>
                    <option value="LAST_MONTH">Last Month</option>
                    <option value="THIS_YEAR">This Year</option>
                    <option value="ALL">All Time</option>
                  </select>
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
