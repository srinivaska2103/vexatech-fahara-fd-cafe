import React from 'react';
import { Filter, ArrowDownUp } from 'lucide-react';

export const CustomerFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Customer Status Filter */}
      <div className="relative">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Customers</option>
          <option value="VIP">VIP Customers</option>
          <option value="ACTIVE">Active Customers</option>
          <option value="INACTIVE">Inactive Customers</option>
          <option value="BLOCKED">Blocked Customers</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Sorting */}
      <div className="relative">
        <select
          value={filters.sort || ''}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest_spending">Highest Spending</option>
          <option value="most_bookings">Most Bookings</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        <ArrowDownUp className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>
    </div>
  );
};
