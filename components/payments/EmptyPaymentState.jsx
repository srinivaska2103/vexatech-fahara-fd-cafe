import React from 'react';
import { WalletCards, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyPaymentState = ({ title = "No Payments Found", description = "There are no transactions that match your current filters.", showClear = false, onClear }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-border/50 border-dashed w-full"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
           <WalletCards className="w-10 h-10 text-primary/40" />
        </div>
        {showClear && (
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface rounded-full flex items-center justify-center border-2 border-white shadow-sm">
             <SearchX className="w-4 h-4 text-text/50" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-text/60 max-w-sm mx-auto mb-6">
        {description}
      </p>

      {showClear && onClear && (
        <button 
          onClick={onClear}
          className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-xl transition-colors text-sm"
        >
          Clear Filters
        </button>
      )}
    </motion.div>
  );
};
