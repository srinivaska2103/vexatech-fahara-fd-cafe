import React from 'react';
import { Filter, Calendar } from 'lucide-react';

export const PaymentFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <div className="relative">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-w-[140px]"
        >
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Method Filter */}
      <div className="relative">
        <select
          value={filters.method || ''}
          onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-w-[160px]"
        >
          <option value="">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Credit / Debit Card</option>
          <option value="NETBANKING">Net Banking</option>
          <option value="WALLET">Wallet</option>
          <option value="CASH">Cash</option>
        </select>
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>

      {/* Date Range Filter */}
      <div className="relative">
        <select
          value={filters.date_range || 'ALL'}
          onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
          className="appearance-none bg-white border border-border rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-w-[140px]"
        >
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="THIS_WEEK">This Week</option>
          <option value="THIS_MONTH">This Month</option>
        </select>
        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      </div>
    </div>
  );
};
