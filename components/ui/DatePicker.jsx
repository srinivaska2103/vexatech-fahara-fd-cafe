'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker = React.forwardRef(({
  value = '',
  onChange,
  placeholder = 'dd-mm-yyyy',
  min,
  max,
  className,
  error,
  disabled = false,
  id,
  name,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Selected date state
  const parseValueToDate = (val) => {
    if (!val) return null;
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const selectedDate = parseValueToDate(value);

  // Current view month & year
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const formatDateToString = (d) => {
    if (!d) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDisplayValue = (d) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleSelectDate = (dateObj) => {
    const formatted = formatDateToString(dateObj);
    if (onChange) {
      // Pass synthetic-like event or value
      onChange({
        target: { name, value: formatted, id },
        value: formatted
      });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        target: { name, value: '', id },
        value: ''
      });
    }
  };

  const handleToday = (e) => {
    e.stopPropagation();
    handleSelectDate(new Date());
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    calendarDays.push({
      date: new Date(viewYear, viewMonth - 1, dayNum),
      dayNum,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      date: new Date(viewYear, viewMonth, d),
      dayNum: d,
      isCurrentMonth: true
    });
  }

  // Next month padding to fill 35 or 42 grid cells
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      date: new Date(viewYear, viewMonth + 1, i),
      dayNum: i,
      isCurrentMonth: false,
      isNextMonth: true
    });
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const minDate = min ? parseValueToDate(min) : null;
  const maxDate = max ? parseValueToDate(max) : null;

  const isDateDisabled = (d) => {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59)) return true;
    return false;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button / Custom Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 py-2 text-sm transition-all duration-200 cursor-pointer shadow-xs select-none",
          isOpen ? "border-[#6F4E37] ring-2 ring-[#6F4E37]/20 bg-[#FFF8F0]/30" : "border-border hover:border-[#6F4E37]/50 hover:bg-neutral-50/50",
          disabled && "opacity-50 cursor-not-allowed bg-neutral-100",
          error && "border-danger ring-danger/20",
          className
        )}
      >
        <div className="flex items-center gap-2 text-[#2C1810]">
          <span className={cn("font-medium", !selectedDate && "text-text/40 font-normal")}>
            {selectedDate ? formatDisplayValue(selectedDate) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#6F4E37]">
          {selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-neutral-200/60 text-text/40 hover:text-text transition-colors"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <CalendarIcon className="w-4 h-4 text-[#6F4E37] transition-transform duration-200 hover:scale-110" />
        </div>
      </div>

      {/* Modern Popover Calendar UI */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-72 sm:w-80 rounded-2xl border border-[#DDB892]/40 bg-white p-4 shadow-2xl shadow-[#6F4E37]/15 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#2C1810] text-base">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="text-[#6F4E37] font-semibold text-sm bg-[#FFF8F0] px-2 py-0.5 rounded-lg border border-[#DDB892]/30">
                {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl border border-neutral-200/80 hover:bg-[#FFF8F0] hover:border-[#DDB892] text-[#6F4E37] transition-all"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-neutral-200/80 hover:bg-[#FFF8F0] hover:border-[#DDB892] text-[#6F4E37] transition-all"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div 
                key={day} 
                className={cn(
                  "text-xs font-bold py-1 text-text/50 uppercase tracking-wider",
                  (idx === 0 || idx === 6) && "text-[#6F4E37]/70"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map(({ date, dayNum, isCurrentMonth }, idx) => {
              const selected = isSameDay(date, selectedDate);
              const isTodayDay = isSameDay(date, today);
              const disabledDay = isDateDisabled(date);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    "h-9 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition-all relative group",
                    !isCurrentMonth && "text-neutral-300 font-normal",
                    isCurrentMonth && !selected && !isTodayDay && "text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37] hover:scale-105",
                    isTodayDay && !selected && "border-2 border-[#6F4E37] text-[#6F4E37] font-bold bg-[#FFF8F0]/50",
                    selected && "bg-gradient-to-tr from-[#6F4E37] to-[#8B5E3C] text-white font-black shadow-md shadow-[#6F4E37]/30 scale-105",
                    disabledDay && "opacity-25 cursor-not-allowed hover:bg-transparent hover:scale-100"
                  )}
                >
                  {dayNum}
                  {isTodayDay && !selected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6F4E37]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-xs font-medium">
            <button
              type="button"
              onClick={handleClear}
              className="text-text/60 hover:text-danger flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="text-[#6F4E37] font-bold hover:underline flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF8F0] border border-[#DDB892]/30 hover:bg-[#DDB892]/20 transition-all"
            >
              <Sparkles className="w-3 h-3 text-[#6F4E37]" />
              Today
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-danger animate-fade-in">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
