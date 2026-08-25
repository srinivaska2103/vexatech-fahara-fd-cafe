import React from 'react';

export const LineChart = ({ data, labels, height = "h-64", colorClass = "bg-primary" }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);

  // We'll simulate a line chart by rendering dots and connecting lines using SVG
  return (
    <div className={`w-full ${height} relative flex items-end pt-4`}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-primary" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
          </linearGradient>
        </defs>
        
        {/* Draw Line */}
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary drop-shadow-md"
          points={data.map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((val - minVal) / (maxVal - minVal)) * 100;
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Draw Area (Optional Area Chart effect) */}
        <polygon
          fill="url(#gradient)"
          points={`0,100 ${data.map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((val - minVal) / (maxVal - minVal)) * 100;
            return `${x},${y}`;
          }).join(' ')} 100,100`}
        />
      </svg>
      
      {/* Interactive Dots & Labels */}
      <div className="absolute inset-0 flex justify-between items-end">
        {data.map((val, i) => {
          const heightPercent = ((val - minVal) / (maxVal - minVal)) * 100;
          return (
            <div key={i} className="relative flex flex-col items-center group h-full justify-end w-4">
              <div 
                className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-150 ${colorClass}`}
                style={{ bottom: `calc(${heightPercent}% - 6px)` }}
              ></div>
              <div className="opacity-0 group-hover:opacity-100 absolute bg-text text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity z-20 pointer-events-none shadow-xl"
                   style={{ bottom: `calc(${heightPercent}% + 10px)` }}>
                {val.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      {labels && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px] font-medium text-text/50">{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};
