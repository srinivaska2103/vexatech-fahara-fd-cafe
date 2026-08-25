import React from 'react';
import { BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyAnalyticsState = ({ title = "No Data Available", description = "There is no analytics data for the selected period." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-border/50 border-dashed w-full h-full min-h-[300px]"
    >
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
         <BarChart4 className="w-10 h-10 text-text/30" />
      </div>
      
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-text/60 max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
};
