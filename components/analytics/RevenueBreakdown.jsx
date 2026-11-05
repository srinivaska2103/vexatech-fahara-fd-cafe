import React from 'react';
import { DonutChart } from './charts/DonutChart';

export const RevenueBreakdown = ({ data }) => {
  if (!data) return null;

  const chartData = [data.bookings || 0, data.events || 0, data.food || 0, data.other || 0];
  const labels = ['Space Bookings', 'Event Tickets', 'F&B Orders', 'Other'];
  const colors = ['#E50914', '#B71C1C', '#EF5350', '#EFEAE2'];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm h-full">
      <h3 className="text-lg font-bold text-text mb-6">Revenue Breakdown</h3>
      
      {chartData.every(val => val === 0) ? (
        <div className="h-64 flex items-center justify-center text-sm text-text/50">
          No revenue data to display.
        </div>
      ) : (
        <div className="h-72">
           <DonutChart data={chartData} labels={labels} colors={colors} />
        </div>
      )}
    </div>
  );
};
