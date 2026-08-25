'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X, 
  Trash2, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger', // 'danger' | 'warning' | 'info' | 'success'
    resolve: null,
  });

  const confirm = useCallback(({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
  } = {}) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        resolve,
      });
    });
  }, []);

  const handleClose = (result) => {
    if (modalState.resolve) {
      modalState.resolve(result);
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const getIcon = () => {
    switch (modalState.type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#6F4E37]" />;
    }
  };

  const getHeaderBg = () => {
    switch (modalState.type) {
      case 'danger':
        return 'bg-rose-50 border-rose-100 text-rose-900';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-900';
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-900';
      default:
        return 'bg-[#FFF8F0] border-[#E6CCB2] text-[#2C1810]';
    }
  };

  const getConfirmBtnStyle = () => {
    switch (modalState.type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20';
      default:
        return 'bg-[#6F4E37] hover:bg-[#5D3F2B] text-white shadow-[#6F4E37]/20';
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleClose(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-[#E6CCB2]/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-10"
            >
              {/* Header with Icon */}
              <div className={`p-6 pb-5 flex items-start justify-between border-b ${getHeaderBg()}`}>
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-white shadow-xs border border-black/5 shrink-0">
                    {getIcon()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810] tracking-tight leading-snug">
                      {modalState.title}
                    </h3>
                    <p className="text-[11px] font-bold text-black/50 uppercase tracking-wider mt-0.5">
                      Confirmation Required
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="text-black/40 hover:text-black/80 p-1.5 rounded-xl hover:bg-black/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-6 text-xs sm:text-sm font-medium text-[#2C1810]/80 leading-relaxed">
                {modalState.message}
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 bg-surface/40 border-t border-[#E6CCB2]/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DDB892]/60 hover:bg-[#FFF8F0] text-[#2C1810] text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  {modalState.cancelText}
                </button>

                <button
                  type="button"
                  onClick={() => handleClose(true)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer ${getConfirmBtnStyle()}`}
                >
                  {modalState.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};
