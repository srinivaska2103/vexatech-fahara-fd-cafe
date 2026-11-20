import React from 'react';
import { 
  Filter, 
  UtensilsCrossed, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  Users, 
  Bike, 
  Crown, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

export const NotificationFilters = ({ filters, setFilters }) => {
  const statusOptions = [
    { label: 'All Statuses', value: '', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { label: 'Unread Alerts', value: 'UNREAD', icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'Read Alerts', value: 'READ', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: '', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { label: 'Critical Priority', value: 'CRITICAL', icon: <Flame className="w-3.5 h-3.5 text-rose-600" /> },
    { label: 'High Priority', value: 'HIGH', icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> },
    { label: 'Medium Priority', value: 'MEDIUM', icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'Low Priority', value: 'LOW', icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: '', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { label: 'Food Orders', value: 'FOOD_ORDER', icon: <UtensilsCrossed className="w-3.5 h-3.5 text-[#E50914]" /> },
    { label: 'Bookings & Tables', value: 'BOOKING', icon: <CalendarCheck className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: 'Payments & Finance', value: 'PAYMENT', icon: <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Reviews & Ratings', value: 'REVIEW', icon: <Star className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'Customers', value: 'CUSTOMER', icon: <Users className="w-3.5 h-3.5 text-sky-500" /> },
    { label: 'Delivery & Operations', value: 'DELIVERY', icon: <Bike className="w-3.5 h-3.5 text-teal-500" /> },
    { label: 'Subscription', value: 'SUBSCRIPTION', icon: <Crown className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'System Alerts', value: 'SYSTEM', icon: <Bell className="w-3.5 h-3.5 text-rose-500" /> },
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
        className="w-44 sm:w-52 shrink-0 text-xs"
      />

      {/* Read Status Filter */}
      <CustomSelect
        options={statusOptions}
        value={filters.status || ''}
        onChange={(val) => setFilters({ ...filters, status: val })}
        placeholder="All Statuses"
        icon={Filter}
        className="w-36 sm:w-40 shrink-0 text-xs"
      />

      {/* Priority Filter */}
      <CustomSelect
        options={priorityOptions}
        value={filters.priority || ''}
        onChange={(val) => setFilters({ ...filters, priority: val })}
        placeholder="All Priorities"
        icon={Filter}
        className="w-36 sm:w-42 shrink-0 text-xs"
      />
    </div>
  );
};
