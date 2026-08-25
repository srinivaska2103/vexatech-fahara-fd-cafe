import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const DeleteEventDialog = ({ isOpen, onClose, onConfirm, eventName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-text/20 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-border"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text/40 hover:text-text hover:bg-surface rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Delete Event Package</h3>
            <p className="text-text/60 mb-6">
              Are you sure you want to delete <span className="font-semibold text-text">{eventName}</span>? This action cannot be undone and any associated bookings may be affected.
            </p>

            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                className="w-full bg-danger hover:bg-danger/90 text-white" 
                onClick={onConfirm}
                isLoading={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Delete
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
