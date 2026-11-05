'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function ModernDateTimePicker({
  value,
  onChange,
  label = 'Select Date & Time',
  align = 'auto', // 'left', 'right', 'auto'
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse incoming value or fallback to today
  const parseDateTime = (val) => {
    if (!val) return new Date();
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const currentDate = parseDateTime(value);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  
  // 12-hour clock state
  const rawH = currentDate.getHours();
  const initialAmPm = rawH >= 12 ? 'PM' : 'AM';
  const initial12H = rawH % 12 === 0 ? 12 : rawH % 12;
  const [hour12, setHour12] = useState(initial12H);
  const [minuteVal, setMinuteVal] = useState(currentDate.getMinutes());
  const [period, setPeriod] = useState(initialAmPm);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync internal state when external value changes
  useEffect(() => {
    if (value) {
      const d = parseDateTime(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setSelectedDay(d.getDate());
      const h = d.getHours();
      setHour12(h % 12 === 0 ? 12 : h % 12);
      setMinuteVal(d.getMinutes());
      setPeriod(h >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  // Days calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const emitChange = (y, m, d, h12, min, ampm) => {
    let h24 = h12 % 12;
    if (ampm === 'PM') h24 += 12;
    const formattedHours = String(h24).padStart(2, '0');
    const formattedMonth = String(m + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const formattedMinutes = String(min).padStart(2, '0');
    const str = `${y}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
    onChange(str);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    emitChange(viewYear, viewMonth, day, hour12, minuteVal, period);
  };

  const handleHourStep = (increment) => {
    let next = hour12 + increment;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    setHour12(next);
    emitChange(viewYear, viewMonth, selectedDay, next, minuteVal, period);
  };

  const handleMinuteStep = (increment) => {
    let next = (Math.round(minuteVal / 5) * 5) + (increment * 5);
    if (next >= 60) next = 0;
    if (next < 0) next = 55;
    setMinuteVal(next);
    emitChange(viewYear, viewMonth, selectedDay, hour12, next, period);
  };

  const handleTogglePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    emitChange(viewYear, viewMonth, selectedDay, hour12, minuteVal, newPeriod);
  };

  // Format display string
  const formatDisplay = () => {
    if (!value) return 'Select Date & Time';
    const d = parseDateTime(value);
    const datePart = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart}, ${timePart}`;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-[#E50914] ring-2 ring-[#E50914]/20 text-[#252525]'
            : 'border-[#FEE2E2] hover:border-[#E50914]/40 text-[#252525] hover:bg-[#FFF5F5]/40'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
          <span className="truncate">{formatDisplay()}</span>
        </div>
        <Clock className="w-3 h-3 text-[#757575] shrink-0" />
      </button>

      {/* Floating Modern Calendar Modal Dialog with backdrop & perfect viewport centering or positioning */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft invisible click catcher for reliable closing */}
            <div 
              className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px]" 
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] max-w-[90vw] bg-white rounded-3xl border border-[#FEE2E2] shadow-2xl shadow-black/25 p-4 space-y-3.5`}
            >
              {/* Header with Month / Year & Close */}
              <div className="flex items-center justify-between px-1 border-b border-[#FEE2E2] pb-2">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#E50914]" />
                  <span className="text-xs font-black text-[#252525]">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-[#FFF5F5] text-[#252525] hover:text-[#E50914] rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-[#FFF5F5] text-[#252525] hover:text-[#E50914] rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 ml-1 hover:bg-[#FFF5F5] text-[#757575] hover:text-[#E50914] rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS.map((d) => (
                  <span key={d} className="text-[10px] font-black text-[#757575] uppercase">
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty leading slots */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-8 h-8" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    day === selectedDay &&
                    viewMonth === currentDate.getMonth() &&
                    viewYear === currentDate.getFullYear();

                  const isToday =
                    day === new Date().getDate() &&
                    viewMonth === new Date().getMonth() &&
                    viewYear === new Date().getFullYear();

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/25 scale-105'
                          : isToday
                          ? 'border border-[#E50914] text-[#E50914] hover:bg-[#FFF5F5]'
                          : 'text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E50914]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* MODERN TIME CONTROLS */}
              <div className="pt-2.5 border-t border-[#FEE2E2] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#E50914]" />
                  Time:
                </span>

                <div className="flex items-center gap-1.5 select-none">
                  {/* Hours Stepper */}
                  <div className="flex items-center bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleHourStep(-1)}
                      className="text-[#757575] hover:text-[#E50914] px-1 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-black text-[#252525] px-1 w-6 text-center">
                      {String(hour12).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleHourStep(1)}
                      className="text-[#757575] hover:text-[#E50914] px-1 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-black text-[#252525] text-xs">:</span>

                  {/* Minutes Stepper */}
                  <div className="flex items-center bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleMinuteStep(-1)}
                      className="text-[#757575] hover:text-[#E50914] px-1 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-black text-[#252525] px-1 w-6 text-center">
                      {String(minuteVal).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMinuteStep(1)}
                      className="text-[#757575] hover:text-[#E50914] px-1 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* AM / PM Toggle Pills */}
                  <div className="flex items-center bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl p-0.5 ml-1">
                    <button
                      type="button"
                      onClick={() => handleTogglePeriod('AM')}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-colors ${
                        period === 'AM' ? 'bg-[#E50914] text-white shadow-2xs' : 'text-[#757575] hover:text-[#252525]'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePeriod('PM')}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-colors ${
                        period === 'PM' ? 'bg-[#E50914] text-white shadow-2xs' : 'text-[#757575] hover:text-[#252525]'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Done Action */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black cursor-pointer shadow-md shadow-[#E50914]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Done & Apply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
