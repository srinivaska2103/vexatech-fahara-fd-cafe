import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const DeleteNotificationDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
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
              <Trash2 className="w-6 h-6 text-danger" />
            </div>

            <h3 className="text-xl font-semibold text-text mb-2">Delete Notification</h3>
            <p className="text-text/70 mb-8 text-sm">
              Are you sure you want to delete this notification? It will be permanently removed from your inbox.
            </p>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={onConfirm} 
                isLoading={isDeleting}
                className="bg-danger hover:bg-danger/90 text-white border-transparent"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
