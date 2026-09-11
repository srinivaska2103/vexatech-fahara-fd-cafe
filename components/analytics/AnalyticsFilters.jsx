import React from 'react';
import { Calendar, Building2 } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

const DATE_RANGE_OPTIONS = [
  { value: 'TODAY', label: 'Today' },
  { value: 'YESTERDAY', label: 'Yesterday' },
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'ALL', label: 'All Time' },
];

const CAFE_OPTIONS = [
  { value: '', label: 'All Cafes' },
  { value: 'cafe1', label: 'Downtown Hub' },
  { value: 'cafe2', label: 'Tech Park' },
];

export const AnalyticsFilters = ({ filters, setFilters, hideCafeFilter = false }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Filter */}
      <CustomSelect
        options={DATE_RANGE_OPTIONS}
        value={filters.date_range || 'THIS_MONTH'}
        onChange={(val) => setFilters({ ...filters, date_range: val })}
        icon={Calendar}
        className="min-w-[160px]"
      />

      {/* Cafe Filter */}
      {!hideCafeFilter && (
        <CustomSelect
          options={CAFE_OPTIONS}
          value={filters.cafe_id || ''}
          onChange={(val) => setFilters({ ...filters, cafe_id: val })}
          icon={Building2}
          className="min-w-[160px]"
        />
      )}
    </div>
  );
};
