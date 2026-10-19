'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  Check, X
} from 'lucide-react';
import moment from 'moment';

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES_STEP = ['00', '15', '30', '45'];

export default function ModernDateTimePicker({
  label,
  value, // format: "YYYY-MM-DDTHH:mm"
  onChange,
  isAllDay = false,
  minDate = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value
  const parsed = React.useMemo(() => {
    if (!value) return moment();
    const m = moment(value);
    return m.isValid() ? m : moment();
  }, [value]);

  const [viewDate, setViewDate] = useState(() => parsed.clone());

  // Extracted parts
  const selectedDateStr = parsed.format('YYYY-MM-DD');
  const rawHour = parsed.hour();
  const currentAmpm = rawHour >= 12 ? 'PM' : 'AM';
  const currentHour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const currentMinute = String(parsed.minute()).padStart(2, '0');

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  // Synchronize view month with parsed when opened
  useEffect(() => {
    if (isOpen) {
      setViewDate(parsed.clone());
    }
  }, [isOpen]);

  // Update parts
  const handleDateSelect = (dayMoment) => {
    const updated = dayMoment.clone();
    if (!isAllDay) {
      updated.hour(parsed.hour());
      updated.minute(parsed.minute());
    } else {
      updated.hour(0).minute(0);
    }
    onChange(updated.format('YYYY-MM-DDTHH:mm'));
    if (isAllDay) {
      setIsOpen(false);
    }
  };

  const handleTimeSelect = (hour12, ampm, minuteStr) => {
    let hour24 = hour12 % 12;
    if (ampm === 'PM') hour24 += 12;
    const updated = parsed.clone().hour(hour24).minute(parseInt(minuteStr, 10));
    onChange(updated.format('YYYY-MM-DDTHH:mm'));
  };

  // Calendar matrix calculations
  const monthStart = viewDate.clone().startOf('month');
  const monthEnd = viewDate.clone().endOf('month');
  const startDate = monthStart.clone().startOf('week');
  const endDate = monthEnd.clone().endOf('week');

  const days = [];
  const day = startDate.clone();
  while (day.isSameOrBefore(endDate, 'day')) {
    days.push(day.clone());
    day.add(1, 'day');
  }

  // Display text formatted cleanly
  const displayFormatted = React.useMemo(() => {
    if (!value) return 'Select date & time';
    if (isAllDay) {
      return parsed.format('ddd, MMM D, YYYY');
    }
    return parsed.format('ddd, MMM D, YYYY • h:mm A');
  }, [value, isAllDay, parsed]);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[11px] font-black text-[#2C1810] mb-1 uppercase tracking-wider">
        {label} <span className="text-rose-500">*</span>
      </label>

      {/* Styled Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-2xl text-xs sm:text-sm font-bold text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
          isOpen 
            ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/20 bg-[#FFFDFB]' 
            : 'border-[#E8DED5] hover:border-[#DDB892] hover:bg-[#FFF8F0]/30 text-[#2C1810]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="truncate font-black text-[#2C1810]">
            {displayFormatted}
          </span>
        </div>
        <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-lg border border-[#DDB892]/50 shrink-0">
          {isAllDay ? 'DATE' : 'DATE & TIME'}
        </span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full sm:w-[350px] bg-[#FFFDFB] rounded-3xl border border-[#DDB892] shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 text-[#2C1810]">
          
          {/* Header Month / Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DED5]">
            <div>
              <p className="text-xs font-black text-[#2C1810]">
                {viewDate.format('MMMM YYYY')}
              </p>
              <p className="text-[10px] font-semibold text-[#A67B5B]">
                {isAllDay ? 'Select Date' : 'Select Date & Duration Slot'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewDate(viewDate.clone().subtract(1, 'month'))}
                className="w-7 h-7 rounded-xl bg-white border border-[#E8DED5] hover:bg-[#FFF8F0] hover:text-[#6F4E37] flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewDate(moment())}
                className="px-2 py-1 text-[10px] font-black rounded-lg bg-stone-100 hover:bg-[#FFF8F0] text-stone-600 hover:text-[#6F4E37] transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setViewDate(viewDate.clone().add(1, 'month'))}
                className="w-7 h-7 rounded-xl bg-white border border-[#E8DED5] hover:bg-[#FFF8F0] hover:text-[#6F4E37] flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-black text-[#A67B5B] uppercase">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((dItem) => {
              const isSelected = dItem.format('YYYY-MM-DD') === selectedDateStr;
              const isCurrentMonth = dItem.month() === viewDate.month();
              const isToday = dItem.isSame(moment(), 'day');

              return (
                <button
                  key={dItem.format('YYYY-MM-DD')}
                  type="button"
                  onClick={() => handleDateSelect(dItem)}
                  className={`h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] text-white shadow-xs scale-105 z-10'
                      : isToday
                      ? 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892] font-black'
                      : isCurrentMonth
                      ? 'text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                      : 'text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {dItem.date()}
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#6F4E37] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Time Picker Component (If not all day) */}
          {!isAllDay && (
            <div className="mt-3 pt-3 border-t border-[#E8DED5] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-[#2C1810] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                  <span>Choose Time</span>
                </span>
                <span className="text-xs font-black text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#DDB892]/60 shadow-2xs">
                  {currentHour12}:{currentMinute} {currentAmpm}
                </span>
              </div>

              {/* AM / PM Segmented Control */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTimeSelect(currentHour12, 'AM', currentMinute)}
                  className={`py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    currentAmpm === 'AM'
                      ? 'bg-white text-[#6F4E37] shadow-xs'
                      : 'text-stone-500 hover:text-[#2C1810]'
                  }`}
                >
                  AM (Morning / Noon)
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeSelect(currentHour12, 'PM', currentMinute)}
                  className={`py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    currentAmpm === 'PM'
                      ? 'bg-white text-[#6F4E37] shadow-xs'
                      : 'text-stone-500 hover:text-[#2C1810]'
                  }`}
                >
                  PM (Afternoon / Night)
                </button>
              </div>

              {/* Hour Grid */}
              <div>
                <p className="text-[9.5px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Hour
                </p>
                <div className="grid grid-cols-6 gap-1">
                  {HOURS_12.map((h) => {
                    const active = currentHour12 === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleTimeSelect(h, currentAmpm, currentMinute)}
                        className={`h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          active
                            ? 'bg-[#6F4E37] text-white shadow-2xs'
                            : 'bg-white border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0]'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Grid */}
              <div>
                <p className="text-[9.5px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Minutes
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {MINUTES_STEP.map((mStr) => {
                    const active = currentMinute === mStr;
                    return (
                      <button
                        key={mStr}
                        type="button"
                        onClick={() => handleTimeSelect(currentHour12, currentAmpm, mStr)}
                        className={`h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          active
                            ? 'bg-[#6F4E37] text-white shadow-2xs'
                            : 'bg-white border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0]'
                        }`}
                      >
                        :{mStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Done Confirmation Action */}
          <div className="mt-3.5 pt-2.5 border-t border-[#E8DED5] flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-bold">
              {parsed.format('YYYY-MM-DD HH:mm')}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 bg-[#6F4E37] hover:bg-[#4A2C11] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
