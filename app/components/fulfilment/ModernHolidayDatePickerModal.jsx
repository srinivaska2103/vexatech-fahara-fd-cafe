'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function ModernHolidayDatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  minDate = new Date().toISOString().slice(0, 10)
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [activeDate, setActiveDate] = useState(selectedDate || minDate);

  if (!isOpen) return null;

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleApply = () => {
    if (activeDate) {
      onSelectDate(activeDate);
    }
    onClose();
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#FEE2E2] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#FEE2E2] bg-[#FFF5F5]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E50914] text-white flex items-center justify-center shadow-xs">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#252525]">Select Closure Date</h3>
              <p className="text-[10px] text-[#757575] font-semibold">Special holiday or scheduled closure</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center text-[#757575] hover:text-[#252525] border border-stone-200 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Month Navigator */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#252525]">
              {MONTH_NAMES[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-xl hover:bg-stone-100 text-[#757575] hover:text-[#252525] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-xl hover:bg-stone-100 text-[#757575] hover:text-[#252525] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS.map((d) => (
              <span key={d} className="text-[10px] font-black text-[#999999] uppercase tracking-wider py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayStr = day < 10 ? `0${day}` : `${day}`;
              const monthStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              const isSelected = activeDate === dateStr;
              const isToday = todayStr === dateStr;
              const isPast = minDate && dateStr < minDate;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => setActiveDate(dateStr)}
                  className={`h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#E50914] text-white shadow-xs scale-105'
                      : isToday
                      ? 'bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]'
                      : isPast
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'hover:bg-stone-100 text-[#252525]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-[#FEE2E2] flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[9px] font-black uppercase text-[#888888] block">Selected:</span>
            <span className="font-black text-[#252525]">{activeDate || 'None'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-[#666666] hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <Check size={13} />
              <span>Apply</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

