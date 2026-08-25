import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export const KPICard = ({ title, value, prefix = '', suffix = '', trend, icon: Icon, color = 'primary' }) => {
  
  const getColorClasses = () => {
    switch(color) {
      case 'primary': return 'bg-primary/10 text-primary';
      case 'green': return 'bg-green-100 text-green-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'purple': return 'bg-purple-100 text-purple-700';
      default: return 'bg-surface text-text/60';
    }
  };

  const renderTrend = () => {
    if (trend === undefined || trend === null) return null;
    
    if (trend > 0) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
          <TrendingUp className="w-3 h-3" /> +{trend}%
        </div>
      );
    } else if (trend < 0) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-danger bg-danger/10 px-1.5 py-0.5 rounded">
          <TrendingDown className="w-3 h-3" /> {trend}%
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-text/50 bg-surface px-1.5 py-0.5 rounded">
          <Minus className="w-3 h-3" /> 0%
        </div>
      );
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-text/60">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColorClasses()}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="text-2xl font-bold text-text mb-1">
          {prefix}{value?.toLocaleString() || '0'}{suffix}
        </div>
        {renderTrend()}
      </div>
    </motion.div>
  );
};
