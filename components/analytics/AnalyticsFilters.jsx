import React from 'react';
import { Calendar, Building2 } from 'lucide-react';

export const AnalyticsFilters = ({ filters, setFilters, hideCafeFilter = false }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Filter */}
      <div className="relative">
        <select
          value={filters.date_range || 'THIS_MONTH'}
          onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-w-[140px]"
        >
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
          <option value="LAST_7_DAYS">Last 7 Days</option>
          <option value="LAST_30_DAYS">Last 30 Days</option>
          <option value="THIS_MONTH">This Month</option>
          <option value="LAST_MONTH">Last Month</option>
          <option value="THIS_YEAR">This Year</option>
          <option value="ALL">All Time</option>
        </select>
        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Cafe Filter */}
      {!hideCafeFilter && (
        <div className="relative">
          <select
            value={filters.cafe_id || ''}
            onChange={(e) => setFilters({ ...filters, cafe_id: e.target.value })}
            className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-w-[140px]"
          >
            <option value="">All Cafes</option>
            <option value="cafe1">Downtown Hub</option>
            <option value="cafe2">Tech Park</option>
          </select>
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
        </div>
      )}
    </div>
  );
};
