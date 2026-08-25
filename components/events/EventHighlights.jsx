import React from 'react';
import { Users, Clock, IndianRupee, Tag, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const EventHighlights = ({ event }) => {
  const highlights = [
    {
      icon: Tag,
      label: 'Category',
      value: event.event_type || 'N/A',
      color: 'text-primary bg-primary/10'
    },
    {
      icon: Users,
      label: 'Capacity',
      value: `${event.minimum_persons || 1} - ${event.maximum_persons || 'Unlimited'} guests`,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      icon: Clock,
      label: 'Duration',
      value: event.duration_hours ? `${event.duration_hours} Hours` : 'Flexible',
      color: 'text-warning bg-warning/10'
    },
    {
      icon: IndianRupee,
      label: 'Base Price',
      value: event.price ? `₹${event.price}` : 'Free',
      color: 'text-success bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {highlights.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.color)}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text/50 mb-0.5">{item.label}</p>
            <p className="font-semibold text-text text-sm truncate">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
