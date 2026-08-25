import React from 'react';
import { Filter, Star } from 'lucide-react';

export const ReviewFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Rating Filter */}
      <div className="relative">
        <select
          value={filters.rating || ''}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>



      {/* Date Range Filter */}
      <div className="relative">
        <select
          value={filters.dateRange || ''}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
};
