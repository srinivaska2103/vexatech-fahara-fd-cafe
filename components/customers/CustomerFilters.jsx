import React from 'react';
import { Filter, ArrowDownUp } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: '', label: 'All Customers' },
  { value: 'VIP', label: 'VIP Customers' },
  { value: 'ACTIVE', label: 'Active Customers' },
  { value: 'INACTIVE', label: 'Inactive Customers' },
  { value: 'BLOCKED', label: 'Blocked Customers' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest_spending', label: 'Highest Spending' },
  { value: 'most_bookings', label: 'Most Bookings' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export const CustomerFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Customer Status Filter */}
      <CustomSelect
        options={STATUS_OPTIONS}
        value={filters.status || ''}
        onChange={(val) => setFilters({ ...filters, status: val })}
        icon={Filter}
        className="min-w-[160px]"
      />

      {/* Sorting */}
      <CustomSelect
        options={SORT_OPTIONS}
        value={filters.sort || 'newest'}
        onChange={(val) => setFilters({ ...filters, sort: val })}
        icon={ArrowDownUp}
        className="min-w-[170px]"
      />
    </div>
  );
};
