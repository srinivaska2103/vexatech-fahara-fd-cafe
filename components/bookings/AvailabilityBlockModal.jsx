'use client';
import React, { useState, useEffect } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, AlertTriangle, 
  Trash2, Sparkles, Check, Info, Repeat, ShieldAlert,
  Palmtree, PartyPopper, Wrench, UserX, HelpCircle,
  CalendarCheck, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import ModernDateTimePicker from './ModernDateTimePicker';

const REASONS = [
  { 
    value: 'HOLIDAY', 
    label: 'Holiday Closure', 
    desc: 'Public or national festival holiday',
    icon: Palmtree,
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    sampleTitles: ['Diwali Public Holiday', 'New Year Closure', 'National Holiday', 'Festival Break']
  },
  { 
    value: 'PRIVATE_EVENT', 
    label: 'Private Event', 
    desc: 'Exclusive party, corporate or family gathering',
    icon: PartyPopper,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    sampleTitles: ['Private Birthday Party', 'Exclusive Corporate Dinner', 'Wedding Reception Booking', 'VIP Closed Event']
  },
  { 
    value: 'MAINTENANCE', 
    label: 'Maintenance / Renovation', 
    desc: 'Kitchen renovation, repair, deep cleaning',
    icon: Wrench,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    sampleTitles: ['Deep Kitchen Cleaning', 'Espresso Machine Servicing', 'Interior Renovation', 'Electrical Maintenance']
  },
  { 
    value: 'PERSONAL_CLOSURE', 
    label: 'Personal Closure', 
    desc: 'Owner or staff team off / emergency',
    icon: UserX,
    color: '#475569',
    bgColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    sampleTitles: ['Staff Training Day', 'Staff Annual Outing', 'Emergency Closure', 'Personal Day Off']
  },
  { 
    value: 'OTHER', 
    label: 'Other Reason', 
    desc: 'Custom special circumstance closure',
    icon: HelpCircle,
    color: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    sampleTitles: ['Special Closure', 'Filming / Photo Shoot', 'Inventory Audit Day', 'Temporary Closure']
  }
];

const RECURRENCES = [
  { value: 'NONE', label: 'Does not repeat', desc: 'One-time block for the chosen dates' },
  { value: 'DAILY', label: 'Repeats daily', desc: 'Repeats every day during the period' },
  { value: 'WEEKLY', label: 'Repeats weekly', desc: 'Repeats every week on this day' }
];

export default function AvailabilityBlockModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData = null,
  cafes = [],
  selectedCafeId = ''
}) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData?.id);

  // Form states
  const [cafeId, setCafeId] = useState(initialData?.cafe_id || selectedCafeId || cafes[0]?.id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [reason, setReason] = useState(initialData?.reason || 'HOLIDAY');
  const [isAllDay, setIsAllDay] = useState(initialData?.is_all_day ?? false);

  // Quick preset duration tracker: 'custom' | '2h' | '4h' | 'allday' | 'weekend'
  const [activeDurationPreset, setActiveDurationPreset] = useState('custom');

  // Format datetime for datetime-local input
  const formatInputDateTime = (dateVal, defaultTimeStr = '09:00') => {
    if (!dateVal) {
      const d = new Date();
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${yr}-${mo}-${da}T${defaultTimeStr}`;
    }
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hr = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yr}-${mo}-${da}T${hr}:${mi}`;
  };

  const [startAt, setStartAt] = useState(() => formatInputDateTime(initialData?.start_at, '09:00'));
  const [endAt, setEndAt] = useState(() => formatInputDateTime(initialData?.end_at, '18:00'));
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [recurrence, setRecurrence] = useState(initialData?.recurrence || 'NONE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Whenever reason changes and title is empty, or user clicks quick suggestions
  const selectedReasonObj = REASONS.find(r => r.value === reason) || REASONS[0];

  // Duration computation in hours
  const computedDurationText = React.useMemo(() => {
    if (isAllDay) return 'All Day (24 Hours)';
    const s = new Date(startAt);
    const e = new Date(endAt);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return null;
    const diffMs = e - s;
    const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(1).replace('.0', '');
    return `${diffHours} Hour${diffHours === '1' ? '' : 's'}`;
  }, [startAt, endAt, isAllDay]);

  // Handle all-day toggle adjustments
  const handleAllDayToggle = (checked) => {
    setIsAllDay(checked);
    if (checked) {
      const sDate = startAt ? startAt.split('T')[0] : new Date().toISOString().split('T')[0];
      setStartAt(`${sDate}T00:00`);
      setEndAt(`${sDate}T23:59`);
      setActiveDurationPreset('allday');
    } else {
      const sDate = startAt ? startAt.split('T')[0] : new Date().toISOString().split('T')[0];
      setStartAt(`${sDate}T09:00`);
      setEndAt(`${sDate}T18:00`);
      setActiveDurationPreset('custom');
    }
  };

  // Quick duration presets
  const applyQuickPreset = (presetKey) => {
    setActiveDurationPreset(presetKey);
    const baseDate = startAt ? startAt.split('T')[0] : new Date().toISOString().split('T')[0];
    const baseTime = startAt && startAt.includes('T') ? startAt.split('T')[1] : '18:00';
    
    if (presetKey === 'allday') {
      setIsAllDay(true);
      setStartAt(`${baseDate}T00:00`);
      setEndAt(`${baseDate}T23:59`);
    } else if (presetKey === '2h') {
      setIsAllDay(false);
      const [h, m] = baseTime.split(':').map(Number);
      const startH = isNaN(h) ? 18 : h;
      const endH = (startH + 2) % 24;
      setStartAt(`${baseDate}T${String(startH).padStart(2, '0')}:00`);
      setEndAt(`${baseDate}T${String(endH).padStart(2, '0')}:00`);
    } else if (presetKey === '4h') {
      setIsAllDay(false);
      const [h, m] = baseTime.split(':').map(Number);
      const startH = isNaN(h) ? 18 : h;
      const endH = (startH + 4) % 24;
      setStartAt(`${baseDate}T${String(startH).padStart(2, '0')}:00`);
      setEndAt(`${baseDate}T${String(endH).padStart(2, '0')}:00`);
    } else if (presetKey === 'evening') {
      setIsAllDay(false);
      setStartAt(`${baseDate}T18:00`);
      setEndAt(`${baseDate}T23:00`);
    }
  };

  const [overlapWarning, setOverlapWarning] = useState(null);

  const handleSubmit = async (e, forceOverwrite = false) => {
    if (e) e.preventDefault();

    if (!cafeId) {
      toast.error('Please select a cafe');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for this block');
      return;
    }

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error('Please enter valid start and end dates');
      return;
    }

    if (end <= start) {
      toast.error('End date and time must be after start date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: initialData?.id,
        cafeId,
        title: title.trim(),
        reason,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        isAllDay,
        notes: notes.trim() || null,
        recurrence,
        allowOverlap: forceOverwrite
      });
      setOverlapWarning(null);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409 && err.response?.data?.overlappingBlock) {
        setOverlapWarning(err.response.data.overlappingBlock);
      } else {
        toast.error(err.response?.data?.message || err.message || 'Failed to save availability block');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsSubmitting(true);
    try {
      await onDelete(initialData.id);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete availability block');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-xl bg-[#FFFDFB] rounded-3xl border border-[#DDB892]/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-[#2C1810]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Fahara Warm Gradients */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#FFF8F0] via-[#FFF3E3] to-[#FFF5EA] border-b border-[#E8DED5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#4A2C11] text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight">
                  {isEditing ? 'Edit Availability Block' : 'Add Availability Block'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#6F4E37]/10 text-[#6F4E37]">
                  {isEditing ? 'Update Slot' : 'Instant Block'}
                </span>
              </div>
              <p className="text-[11px] text-[#A67B5B] font-semibold">
                Restrict table reservations & bookings for maintenance, events, or holidays
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white border border-[#E8DED5] text-stone-400 hover:text-[#2C1810] hover:bg-[#FFF8F0] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body with Smooth Scrolling */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4.5 scrollbar-thin">

          {/* Overlap Warning Alert Banner */}
          {overlapWarning && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-amber-400 rounded-2xl flex flex-col gap-2.5 text-amber-950 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-black text-amber-900">
                    Overlapping Block Detected: "{overlapWarning.title}"
                  </p>
                  <p className="text-[11px] text-amber-800">
                    This cafe already has a closure period scheduled from {new Date(overlapWarning.start_at).toLocaleDateString()} to {new Date(overlapWarning.end_at).toLocaleDateString()}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => handleSubmit(null, true)}
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Create Block Anyway</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOverlapWarning(null)}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Adjust Time Range
                </button>
              </div>
            </div>
          )}
          
          {/* Cafe Selection (if user owns multiple cafes) */}
          {cafes.length > 1 && (
            <div>
              <label className="block text-[11px] font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Cafe Branch <span className="text-rose-500">*</span>
              </label>
              <select
                value={cafeId}
                onChange={(e) => setCafeId(e.target.value)}
                disabled={isEditing}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8DED5] rounded-xl text-xs sm:text-sm font-bold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30 transition-all cursor-pointer"
              >
                {cafes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.city ? `(${c.city})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Interactive Block Reason Cards */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-1.5">
                <span>Select Closure Reason</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-full border border-[#DDB892]/50">
                {selectedReasonObj.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REASONS.map((r) => {
                const isSelected = reason === r.value;
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setReason(r.value);
                      // If title is currently empty, autofill with first suggestion
                      if (!title.trim() && r.sampleTitles?.[0]) {
                        setTitle(r.sampleTitles[0]);
                      }
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[82px] group ${
                      isSelected 
                        ? 'border-[#6F4E37] bg-[#FFF8F0] shadow-sm ring-2 ring-[#6F4E37]/25 scale-[1.02]' 
                        : 'bg-white border-[#E8DED5] hover:border-[#DDB892] hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div 
                        className="w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: isSelected ? r.bgColor : '#F5F5F4', color: r.color }}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#6F4E37]" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-[#6F4E37]' : 'text-[#2C1810]'}`}>
                        {r.label}
                      </p>
                      <p className="text-[9.5px] text-stone-500 line-clamp-1 leading-tight">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block Title + Quick Suggestions */}
          <div>
            <label className="block text-[11px] font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
              Block Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Diwali Public Holiday, Kitchen Renovation..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8DED5] rounded-xl text-xs sm:text-sm font-bold text-[#2C1810] placeholder:text-stone-400 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30 transition-all shadow-2xs"
            />
            
            {/* Quick Interactive Title Suggestion Chips */}
            {selectedReasonObj.sampleTitles && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#A67B5B]" /> Quick:
                </span>
                {selectedReasonObj.sampleTitles.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTitle(st)}
                    className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-600 transition-all cursor-pointer border border-transparent hover:border-[#DDB892]/60 active:scale-95"
                  >
                    + {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All-Day Interactive Switch Card */}
          <div 
            onClick={() => handleAllDayToggle(!isAllDay)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isAllDay 
                ? 'bg-[#FFF8F0] border-[#6F4E37] shadow-xs' 
                : 'bg-white border-[#E8DED5] hover:border-[#DDB892]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isAllDay ? 'bg-[#6F4E37] text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#2C1810] block">All-Day Block</span>
                <span className="text-[10.5px] text-stone-500">Close reservations for the entire 24-hour business day</span>
              </div>
            </div>

            {/* Custom Interactive Toggle Pill */}
            <div 
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                isAllDay ? 'bg-[#6F4E37]' : 'bg-stone-300'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  isAllDay ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Quick Preset Buttons for Partial Time Slots */}
          {!isAllDay && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                Quick Slot:
              </span>
              <button
                type="button"
                onClick={() => applyQuickPreset('2h')}
                className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeDurationPreset === '2h'
                    ? 'bg-[#6F4E37] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-[#FFF8F0] text-stone-700 border border-stone-200'
                }`}
              >
                2 Hours
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset('4h')}
                className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeDurationPreset === '4h'
                    ? 'bg-[#6F4E37] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-[#FFF8F0] text-stone-700 border border-stone-200'
                }`}
              >
                4 Hours
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset('evening')}
                className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeDurationPreset === 'evening'
                    ? 'bg-[#6F4E37] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-[#FFF8F0] text-stone-700 border border-stone-200'
                }`}
              >
                Evening (6 PM - 11 PM)
              </button>
            </div>
          )}

          {/* Date & Time Range Pickers with Computed Duration Badge */}
          <div className="p-3.5 bg-stone-50/70 border border-stone-200/90 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                Interval Timing
              </span>
              {computedDurationText && (
                <span className="text-[10.5px] font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/80 flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Duration: {computedDurationText}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModernDateTimePicker
                label="Start Date & Time"
                value={startAt}
                isAllDay={isAllDay}
                onChange={(val) => {
                  setStartAt(val);
                  if (isAllDay) {
                    const datePart = val.split('T')[0];
                    setEndAt(`${datePart}T23:59`);
                  }
                  setActiveDurationPreset('custom');
                }}
              />

              <ModernDateTimePicker
                label="End Date & Time"
                value={endAt}
                isAllDay={isAllDay}
                onChange={(val) => {
                  setEndAt(val);
                  setActiveDurationPreset('custom');
                }}
              />
            </div>
          </div>

          {/* Repeat Option */}
          <div>
            <label className="block text-[11px] font-black text-[#2C1810] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-[#6F4E37]" />
              <span>Repeat Recurrence</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RECURRENCES.map((rc) => {
                const isSelected = recurrence === rc.value;
                return (
                  <button
                    key={rc.value}
                    type="button"
                    onClick={() => setRecurrence(rc.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#FFF8F0] border-[#6F4E37] shadow-xs ring-1 ring-[#6F4E37]/30' 
                        : 'bg-white border-[#E8DED5] hover:border-[#DDB892] text-stone-600'
                    }`}
                  >
                    <span className={`block text-xs font-black ${isSelected ? 'text-[#6F4E37]' : 'text-[#2C1810]'}`}>
                      {rc.label}
                    </span>
                    <span className="text-[9px] text-stone-400 block mt-0.5 line-clamp-1">
                      {rc.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-[11px] font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
              Internal Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Booking reserved for Sharma family party. Deep cleaning contractor coming at 2 PM."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#E8DED5] rounded-xl text-xs font-medium text-[#2C1810] placeholder:text-stone-400 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30 resize-none shadow-2xs"
            />
            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-[#A67B5B]" />
              Internal notes are only visible to your cafe staff and will not be seen by customers.
            </p>
          </div>

          {/* Actions & Delete Confirmation */}
          <div className="pt-3 border-t border-[#E8DED5] flex flex-col sm:flex-row items-center justify-between gap-3">
            {isEditing ? (
              confirmDelete ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Block</span>
                </button>
              )
            ) : <div />}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0] rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-black shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-amber-200" />
                    <span>{isEditing ? 'Save Changes' : 'Create Block'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
