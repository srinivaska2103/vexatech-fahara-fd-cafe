import React from 'react';
import { Filter, Calendar, CreditCard } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded' },
];

const METHOD_OPTIONS = [
  { value: '', label: 'All Methods' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'NETBANKING', label: 'Net Banking' },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'CASH', label: 'Cash' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'ALL', label: 'All Time' },
  { value: 'TODAY', label: 'Today' },
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
];

export const PaymentFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <CustomSelect
        options={STATUS_OPTIONS}
        value={filters.status || ''}
        onChange={(val) => setFilters({ ...filters, status: val })}
        icon={Filter}
        className="min-w-[150px]"
      />

      {/* Method Filter */}
      <CustomSelect
        options={METHOD_OPTIONS}
        value={filters.method || ''}
        onChange={(val) => setFilters({ ...filters, method: val })}
        icon={CreditCard}
        className="min-w-[160px]"
      />

      {/* Date Range Filter */}
      <CustomSelect
        options={DATE_RANGE_OPTIONS}
        value={filters.date_range || 'ALL'}
        onChange={(val) => setFilters({ ...filters, date_range: val })}
        icon={Calendar}
        className="min-w-[150px]"
      />
    </div>
  );
};
