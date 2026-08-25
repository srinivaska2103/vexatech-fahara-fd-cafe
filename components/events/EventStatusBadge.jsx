import React from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const EventStatusBadge = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED':
      case 'ACTIVE':
        return {
          icon: CheckCircle2,
          className: 'bg-success/10 text-success border-success/20',
          label: 'Published'
        };
      case 'DRAFT':
        return {
          icon: Clock,
          className: 'bg-warning/10 text-warning border-warning/20',
          label: 'Draft'
        };
      case 'INACTIVE':
        return {
          icon: AlertCircle,
          className: 'bg-danger/10 text-danger border-danger/20',
          label: 'Inactive'
        };
      default:
        return {
          icon: Clock,
          className: 'bg-surface text-text/50 border-border/50',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
      config.className,
      className
    )}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};
