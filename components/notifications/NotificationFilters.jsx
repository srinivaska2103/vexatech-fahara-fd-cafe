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
    { label: 'Critical Priority', value: 'CRITICAL' },
    { label: 'High Priority', value: 'HIGH' },
    { label: 'Medium Priority', value: 'MEDIUM' },
    { label: 'Low Priority', value: 'LOW' },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    { label: '🍔 Food Orders', value: 'FOOD_ORDER' },
    { label: '📅 Bookings & Tables', value: 'BOOKING' },
    { label: '💳 Payments & Finance', value: 'PAYMENT' },
    { label: '⭐ Reviews & Ratings', value: 'REVIEW' },
    { label: '👥 Customers', value: 'CUSTOMER' },
    { label: '🛵 Delivery & Operations', value: 'DELIVERY' },
    { label: '👑 Subscription', value: 'SUBSCRIPTION' },
    { label: '🔔 System Alerts', value: 'SYSTEM' },
  ];

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
      {/* Category Filter */}
      <CustomSelect
        options={categoryOptions}
        value={filters.category || filters.type || ''}
        onChange={(val) => setFilters({ ...filters, category: val, type: val })}
        placeholder="All Categories"
        icon={Filter}
        className="w-38 sm:w-44 shrink-0 text-xs"
      />

      {/* Read Status Filter */}
      <CustomSelect
        options={statusOptions}
        value={filters.status || ''}
        onChange={(val) => setFilters({ ...filters, status: val })}
        placeholder="All Statuses"
        icon={Filter}
        className="w-32 sm:w-34 shrink-0 text-xs"
      />

      {/* Priority Filter */}
      <CustomSelect
        options={priorityOptions}
        value={filters.priority || ''}
        onChange={(val) => setFilters({ ...filters, priority: val })}
        placeholder="All Priorities"
        icon={Filter}
        className="w-34 sm:w-36 shrink-0 text-xs"
      />
    </div>
  );
};
