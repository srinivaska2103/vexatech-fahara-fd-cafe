import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

const RATING_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '5 Stars ★★★★★' },
  { value: '4', label: '4 Stars ★★★★' },
  { value: '3', label: '3 Stars ★★★' },
  { value: '2', label: '2 Stars ★★' },
  { value: '1', label: '1 Star ★' },
];

const DATE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export const ReviewFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Rating Filter */}
      <CustomSelect
        options={RATING_OPTIONS}
        value={filters.rating || ''}
        onChange={(val) => setFilters({ ...filters, rating: val })}
        icon={Star}
        className="min-w-[160px]"
      />

      {/* Date Range Filter */}
      <CustomSelect
        options={DATE_OPTIONS}
        value={filters.dateRange || ''}
        onChange={(val) => setFilters({ ...filters, dateRange: val })}
        icon={Calendar}
        className="min-w-[150px]"
      />
    </div>
  );
};
