import React from 'react';
import { BarChart3 } from 'lucide-react';

export const EarningsChart = ({ data }) => {
  // Mock chart visualization for the prompt requirements.
  // In a real app, this would use Recharts or Chart.js
  
  if (!data || !data.months) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border/50 rounded-2xl bg-surface/30">
         <BarChart3 className="w-8 h-8 text-text/20 mb-2" />
         <span className="text-sm text-text/50">Not enough data to display chart</span>
      </div>
    );
  }

  const maxVal = Math.max(...data.values, 1);

  return (
    <div className="h-64 flex items-end gap-2 pt-4">
      {data.months.map((month, i) => {
        const heightPercent = (data.values[i] / maxVal) * 100;
        return (
          <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
             <div className="w-full relative flex justify-center h-full items-end">
                <div 
                  className="w-full max-w-[40px] bg-primary/20 hover:bg-primary transition-all rounded-t-sm relative"
                  style={{ height: `${Math.max(heightPercent, 5)}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10">
                    ₹{data.values[i].toLocaleString()}
                  </div>
                </div>
             </div>
             <span className="text-xs font-medium text-text/50">{month}</span>
          </div>
        );
      })}
    </div>
  );
};
