import React from 'react';
import { Filter } from 'lucide-react';

export const NotificationFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Read Status Filter */}
      <div className="relative">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Priority Filter */}
      <div className="relative">
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Type Filter */}
      <div className="relative">
        <select
          value={filters.type || ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        >
          <option value="">All Types</option>
          <option value="BOOKING">Booking</option>
          <option value="EVENT">Events</option>
          <option value="PAYMENT">Payments</option>
          <option value="REVIEW">Reviews</option>
          <option value="SYSTEM">System</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>
    </div>
  );
};
