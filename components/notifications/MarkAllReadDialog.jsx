import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const MarkAllReadDialog = ({ isOpen, onClose, onConfirm, isMarking }) => {
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
              <CheckCheck className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-text mb-2">Mark All as Read</h3>
            <p className="text-text/70 mb-8 text-sm">
              Are you sure you want to mark all your notifications as read?
            </p>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isMarking}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={onConfirm} 
                isLoading={isMarking}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
