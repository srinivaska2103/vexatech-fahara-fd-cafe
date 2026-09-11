import React from 'react';
import { Filter } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

export const NotificationFilters = ({ filters, setFilters }) => {
  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Unread', value: 'UNREAD' },
    { label: 'Read', value: 'READ' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: '' },
    { label: 'High Priority', value: 'HIGH' },
    { label: 'Medium Priority', value: 'MEDIUM' },
    { label: 'Low Priority', value: 'LOW' },
  ];

  const typeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Booking', value: 'BOOKING' },
    { label: 'Events', value: 'EVENT' },
    { label: 'Payments', value: 'PAYMENT' },
    { label: 'Reviews', value: 'REVIEW' },
    { label: 'System', value: 'SYSTEM' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
      {/* Read Status Filter */}
      <CustomSelect
        options={statusOptions}
        value={filters.status || ''}
        onChange={(val) => setFilters({ ...filters, status: val })}
        placeholder="All Statuses"
        icon={Filter}
        className="w-32 sm:w-36 shrink-0 text-xs"
      />

      {/* Priority Filter */}
      <CustomSelect
        options={priorityOptions}
        value={filters.priority || ''}
        onChange={(val) => setFilters({ ...filters, priority: val })}
        placeholder="All Priorities"
        icon={Filter}
        className="w-34 sm:w-38 shrink-0 text-xs"
      />

      {/* Type Filter */}
      <CustomSelect
        options={typeOptions}
        value={filters.type || ''}
        onChange={(val) => setFilters({ ...filters, type: val })}
        placeholder="All Types"
        icon={Filter}
        className="w-32 sm:w-36 shrink-0 text-xs"
      />
    </div>
  );
};
