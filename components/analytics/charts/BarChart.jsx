import React from 'react';

export const BarChart = ({ data, labels, height = "h-64", colorClass = "bg-primary/80" }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data, 1);

  return (
    <div className={`w-full ${height} flex items-end gap-2 pt-8 pb-6 relative`}>
      {data.map((val, i) => {
        const heightPercent = (val / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
             <div 
               className={`w-full max-w-[48px] rounded-t-md transition-all relative ${colorClass} hover:opacity-100 opacity-80`}
               style={{ height: `${Math.max(heightPercent, 2)}%` }}
             >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-lg">
                  {val.toLocaleString()}
                </div>
             </div>
             
             {/* X-Axis Labels */}
             {labels && labels[i] && (
               <span className="absolute -bottom-6 text-[10px] font-medium text-text/50 whitespace-nowrap truncate max-w-full text-center">
                 {labels[i]}
               </span>
             )}
          </div>
        );
      })}
    </div>
  );
};
