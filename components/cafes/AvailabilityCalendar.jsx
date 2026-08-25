'use client';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import { Button } from '../ui/Button';
import { X, Calendar as CalendarIcon } from 'lucide-react';

// Custom styles mapping to Fahara design system
const customClassNames = {
  root: 'p-4 bg-white border border-border rounded-xl shadow-sm w-full max-w-sm mx-auto',
  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
  month: 'space-y-4',
  caption: 'flex justify-center pt-1 relative items-center mb-4',
  caption_label: 'text-sm font-semibold text-text',
  nav: 'space-x-1 flex items-center',
  nav_button: 'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-surface text-text transition-colors',
  nav_button_previous: 'absolute left-1',
  nav_button_next: 'absolute right-1',
  day: 'h-10 w-10 p-0 font-medium aria-selected:opacity-100 flex items-center justify-center rounded-md transition-colors hover:bg-surface text-text',
  day_selected: 'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
  day_today: 'bg-surface text-primary font-bold',
  day_outside: 'text-text/30 opacity-50',
  day_disabled: 'text-text/30 opacity-50 cursor-not-allowed hover:bg-transparent',
  day_range_middle: 'aria-selected:bg-surface aria-selected:text-text',
  day_hidden: 'invisible',
};

export const AvailabilityCalendar = ({ selectedDates = [], onDatesChange }) => {
  const [selected, setSelected] = useState(selectedDates);

  const handleSelect = (dates) => {
    setSelected(dates);
    if (onDatesChange) onDatesChange(dates);
  };

  const removeDate = (dateToRemove) => {
    const updated = selected.filter(d => d.getTime() !== dateToRemove.getTime());
    setSelected(updated);
    if (onDatesChange) onDatesChange(updated);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 max-w-sm mx-auto xl:mx-0 bg-white/40 p-2 rounded-2xl calendar-container">
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={handleSelect}
          classNames={customClassNames}
          disabled={[{ before: new Date() }]} // Disable past dates
        />
      </div>

      <div className="flex-1 bg-white border border-border rounded-xl shadow-sm p-4 flex flex-col h-[350px]">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h4 className="font-medium text-text">Blocked Dates</h4>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selected.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text/40">
              <CalendarIcon className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">Select dates on the calendar to mark them as unavailable.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selected.sort((a,b) => a - b).map((date, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-sm font-medium text-text">
                    {format(date, 'PPP')}
                  </span>
                  <button 
                    type="button"
                    onClick={() => removeDate(date)}
                    className="p-1.5 text-text/40 hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
