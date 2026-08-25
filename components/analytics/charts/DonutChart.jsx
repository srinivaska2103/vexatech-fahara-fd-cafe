import React from 'react';

export const DonutChart = ({ data, labels, colors }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, val) => sum + val, 0);
  let cumulativePercent = 0;

  // Simple pure CSS conic-gradient donut chart
  const gradientStops = data.map((val, i) => {
    const percent = (val / total) * 100;
    const stop = `${colors[i % colors.length]} ${cumulativePercent}% ${cumulativePercent + percent}%`;
    cumulativePercent += percent;
    return stop;
  }).join(', ');

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className="w-48 h-48 rounded-full relative flex items-center justify-center mb-6 shadow-sm"
        style={{ background: `conic-gradient(${gradientStops})` }}
      >
        <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
           <span className="text-xs text-text/50 font-medium uppercase tracking-wider">Total</span>
           <span className="text-xl font-bold text-text">{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full px-4">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span 
              className="w-3 h-3 rounded-full shadow-sm" 
              style={{ backgroundColor: colors[i % colors.length] }} 
            />
            <span className="text-text/70">{label}</span>
            <span className="font-semibold text-text ml-1">{((data[i] / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
