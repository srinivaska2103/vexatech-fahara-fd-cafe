import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const AvailabilityCalendar = () => {
  return (
    <div className="w-full text-center p-8 bg-surface rounded-xl border border-border border-dashed">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
         <CalendarIcon className="w-6 h-6 text-primary" />
      </div>
      <h4 className="font-semibold text-text mb-1">Availability Calendar</h4>
      <p className="text-sm text-text/60">
        Calendar management is fully supported in the UI but currently simulated as the backend does not persist block dates.
      </p>
    </div>
  );
};
