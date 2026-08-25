'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Clock, ChevronDown, Check } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const PRESET_TIMES = [
  { label: '08:00 AM', open: '08:00' },
  { label: '09:00 AM', open: '09:00' },
  { label: '10:00 AM', open: '10:00' },
  { label: '06:00 PM', open: '18:00' },
  { label: '09:00 PM', open: '21:00' },
  { label: '10:00 PM', open: '22:00' },
  { label: '11:00 PM', open: '23:00' },
];

const ModernTimePicker = ({ name, disabled, register }) => {
  const { watch, setValue } = useFormContext();
  const value = watch(name) || "09:00";
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Parse current value
  const [hStr, mStr] = (typeof value === 'string' && value.includes(':')) ? value.split(':') : ["09", "00"];
  let hour = parseInt(hStr, 10);
  if (isNaN(hour)) hour = 9;
  const minute = mStr ? mStr.substring(0, 2) : "00";

  const ampm = hour >= 12 ? 'PM' : 'AM';
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  const formattedDisplayTime = `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`;

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
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

  const updateTime = (newDisplayHour, newMinute, newAmPm) => {
    let newHour = newDisplayHour;
    if (newAmPm === 'PM' && newDisplayHour !== 12) newHour += 12;
    if (newAmPm === 'AM' && newDisplayHour === 12) newHour = 0;

    const formatted = `${newHour.toString().padStart(2, '0')}:${newMinute}`;
    setValue(name, formatted, { shouldDirty: true });
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <input type="hidden" {...register(name)} />
      
      {/* Modern Time Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-2xs",
          disabled 
            ? "bg-surface/50 border-border/40 text-text/30 cursor-not-allowed" 
            : isOpen 
              ? "bg-[#6F4E37] text-white border-[#6F4E37] shadow-xs" 
              : "bg-[#FFF8F0] border-[#DDB892]/70 text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white"
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{formattedDisplayTime}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Floating Popover Selector Modal */}
      {isOpen && !disabled && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs sm:static sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:z-auto">
          <div className="w-full max-w-[280px] bg-white rounded-3xl sm:rounded-2xl border border-[#DDB892]/60 shadow-2xl sm:shadow-xl p-5 sm:p-4 space-y-3.5 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64 z-50 text-[#2C1810] animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider">Select Time</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#2C1810] bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#DDB892]/50">
                  {formattedDisplayTime}
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden w-6 h-6 rounded-full bg-surface text-text/60 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

          {/* Quick Presets Bar */}
          <div>
            <p className="text-[10px] font-extrabold uppercase text-text/50 mb-1.5">Quick Presets</p>
            <div className="flex flex-wrap gap-1">
              {PRESET_TIMES.map((preset) => {
                const isSelected = value === preset.open;
                return (
                  <button
                    key={preset.open}
                    type="button"
                    onClick={() => {
                      setValue(name, preset.open, { shouldDirty: true });
                      setIsOpen(false);
                    }}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                      isSelected
                        ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                        : "bg-surface/50 border-border/40 text-[#2C1810] hover:bg-[#6F4E37]/10 hover:text-[#6F4E37]"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AM / PM Segmented Switch */}
          <div className="flex bg-surface/60 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => updateTime(displayHour, minute, 'AM')}
              className={cn(
                "flex-1 py-1 text-xs font-black rounded-lg transition-all text-center",
                ampm === 'AM'
                  ? "bg-[#6F4E37] text-white shadow-2xs"
                  : "text-text/60 hover:text-[#2C1810]"
              )}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => updateTime(displayHour, minute, 'PM')}
              className={cn(
                "flex-1 py-1 text-xs font-black rounded-lg transition-all text-center",
                ampm === 'PM'
                  ? "bg-[#6F4E37] text-white shadow-2xs"
                  : "text-text/60 hover:text-[#2C1810]"
              )}
            >
              PM
            </button>
          </div>

          {/* Hour Selector Grid */}
          <div>
            <p className="text-[10px] font-extrabold uppercase text-text/50 mb-1.5">Hour</p>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                const isSelected = displayHour === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updateTime(h, minute, ampm)}
                    className={cn(
                      "py-1 rounded-lg text-xs font-bold transition-all text-center border",
                      isSelected
                        ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                        : "bg-white border-border/40 text-[#2C1810] hover:bg-[#6F4E37]/10"
                    )}
                  >
                    {h.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Selector Grid */}
          <div>
            <p className="text-[10px] font-extrabold uppercase text-text/50 mb-1.5">Minute</p>
            <div className="grid grid-cols-4 gap-1">
              {['00', '15', '30', '45'].map((m) => {
                const isSelected = minute === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateTime(displayHour, m, ampm)}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-bold transition-all text-center border",
                      isSelected
                        ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                        : "bg-white border-border/40 text-[#2C1810] hover:bg-[#6F4E37]/10"
                    )}
                  >
                    :{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Done Action */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-2xs hover:shadow-xs text-center"
          >
            Apply Time
          </button>

          </div>
        </div>
      )}
    </div>
  );
};

export const BusinessHours = ({ className }) => {
  const { register, watch, setValue } = useFormContext();

  return (
    <div className={cn("space-y-3", className)}>
      
      {/* Desktop Column Titles */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 pb-3 border-b border-border/40 text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider">
        <div className="col-span-3">Day of Week</div>
        <div className="col-span-3 text-center">Open Status</div>
        <div className="col-span-3 text-center">Opening Time</div>
        <div className="col-span-3 text-center">Closing Time</div>
      </div>

      {DAYS.map(day => {
        const rawIsOpen = watch(`businessHours.${day}.isOpen`);
        const isOpen = Array.isArray(rawIsOpen) ? Boolean(rawIsOpen[0]) : Boolean(rawIsOpen);

        const handleToggle = () => {
          const nextVal = !isOpen;
          setValue(`businessHours.${day}.isOpen`, nextVal, { shouldValidate: true, shouldDirty: true });
        };

        return (
          <div 
            key={day} 
            className="p-3.5 sm:p-3 rounded-2xl bg-surface/30 sm:bg-transparent hover:bg-surface/50 border border-border/40 transition-all flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-3"
          >
            
            {/* Day Name & Mobile Status Toggle */}
            <div className="flex items-center justify-between sm:col-span-3">
              <span className="text-xs font-extrabold text-[#2C1810] capitalize">{day}</span>
              <div className="sm:hidden">
                <button 
                  type="button"
                  onClick={handleToggle}
                  className="relative inline-flex items-center cursor-pointer select-none"
                >
                  <div className={cn(
                    "w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5",
                    isOpen ? "bg-[#6F4E37]" : "bg-border/60"
                  )}>
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform shadow-2xs",
                      isOpen ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                  <span className="ml-2 text-[11px] font-bold text-[#2C1810]">
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Status Toggle */}
            <div className="hidden sm:flex sm:col-span-3 justify-center">
              <button 
                type="button"
                onClick={handleToggle}
                className="relative inline-flex items-center cursor-pointer select-none"
              >
                <div className={cn(
                  "w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5",
                  isOpen ? "bg-[#6F4E37]" : "bg-border/60"
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform shadow-2xs",
                    isOpen ? "translate-x-4" : "translate-x-0"
                  )} />
                </div>
                <span className="ml-2 text-xs font-bold text-[#2C1810]">
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              </button>
            </div>

            {/* Time Controls (Modern Time Picker Trigger) */}
            {isOpen ? (
              <div className="flex flex-wrap items-center justify-between sm:grid sm:grid-cols-6 sm:col-span-6 gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
                <div className="flex items-center gap-2 sm:col-span-3 sm:justify-center">
                  <span className="text-[10px] font-extrabold uppercase text-text/50 sm:hidden">Opens:</span>
                  <ModernTimePicker name={`businessHours.${day}.open`} disabled={!isOpen} register={register} />
                </div>

                <div className="flex items-center gap-2 sm:col-span-3 sm:justify-center">
                  <span className="text-[10px] font-extrabold uppercase text-text/50 sm:hidden">Closes:</span>
                  <ModernTimePicker name={`businessHours.${day}.close`} disabled={!isOpen} register={register} />
                </div>
              </div>
            ) : (
              <div className="sm:col-span-6 text-left sm:text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Venue Closed
                </span>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};
