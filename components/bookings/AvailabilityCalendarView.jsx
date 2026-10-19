'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, 
  Plus, Filter, ShieldAlert, Sparkles, CheckCircle2, AlertOctagon, 
  HelpCircle, Coffee, Armchair, ChevronDown, RefreshCw, CalendarDays
} from 'lucide-react';
import AvailabilityBlockModal from './AvailabilityBlockModal';
import { availabilityService } from '@/services/availability.service';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const FILTERS = [
  { id: 'ALL', label: 'All Events', color: '#6F4E37' },
  { id: 'BOOKED', label: 'Bookings', color: '#059669' },
  { id: 'BLOCKED', label: 'Blocked / Closures', color: '#B91C1C' },
  { id: 'PRIVATE_EVENT', label: 'Private Events', color: '#7C3AED' },
  { id: 'HOLIDAY', label: 'Holidays', color: '#D97706' },
  { id: 'MAINTENANCE', label: 'Maintenance', color: '#EA580C' }
];

export const AvailabilityCalendarView = ({ 
  bookings = [], 
  cafes = [], 
  selectedCafeId = '', 
  onCafeChange 
}) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Blocks & summary state
  const [blocks, setBlocks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const currentCafeId = selectedCafeId || cafes[0]?.id || '';

  // Fetch availability blocks and summary when cafe or date changes
  const fetchAvailability = async () => {
    if (!currentCafeId) return;
    setIsLoadingAvailability(true);
    try {
      const fromDate = moment(date).startOf('month').subtract(7, 'days').toISOString();
      const toDate = moment(date).endOf('month').add(7, 'days').toISOString();

      const [blocksRes, summaryRes] = await Promise.all([
        availabilityService.getAvailability(currentCafeId, fromDate, toDate).catch((e) => {
          console.error('getAvailability error:', e);
          return { data: { blocks: [] } };
        }),
        availabilityService.getAvailabilitySummary(currentCafeId).catch((e) => {
          console.error('getAvailabilitySummary error:', e);
          return { data: null };
        })
      ]);

      setBlocks(blocksRes?.data?.blocks || []);
      setSummary(summaryRes?.data || null);
    } catch (err) {
      console.error('Error fetching availability:', err);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [currentCafeId, cafes, date.getMonth(), date.getFullYear()]);

  // Handle Create / Update block submit
  const handleSaveBlock = async (payload) => {
    try {
      if (payload.id) {
        await availabilityService.updateBlock(payload.cafeId, payload.id, payload);
        toast.success('Availability block updated successfully!');
      } else {
        await availabilityService.createBlock(payload.cafeId, payload);
        toast.success('Availability block created successfully!');
      }
      setIsModalOpen(false);
      setSelectedBlock(null);
      await fetchAvailability();
    } catch (err) {
      console.error('Save block error:', err);
      if (err.response?.status !== 409) {
        toast.error(err.response?.data?.message || err.message || 'Failed to save block');
      }
      throw err;
    }
  };

  // Handle Delete block
  const handleDeleteBlock = async (blockId) => {
    if (!currentCafeId || !blockId) return;
    try {
      await availabilityService.deleteBlock(currentCafeId, blockId);
      toast.success('Availability block removed.');
      setIsModalOpen(false);
      setSelectedBlock(null);
      await fetchAvailability();
    } catch (err) {
      console.error('Delete block error:', err);
      toast.error(err.response?.data?.message || 'Failed to remove block');
      throw err;
    }
  };

  // Build calendar events from both customer Bookings and Vendor Blocks
  const calendarEvents = useMemo(() => {
    const list = [];

    // 1. Process Bookings
    bookings.forEach((booking) => {
      const startDate = new Date(booking.date || booking.booking_date || booking.bookingDate || new Date());
      if (booking.startTime || booking.start_time) {
        const timeStr = booking.startTime || booking.start_time;
        if (timeStr instanceof Date || (typeof timeStr === 'string' && timeStr.includes('T'))) {
          const startT = new Date(timeStr);
          startDate.setHours(startT.getUTCHours ? startT.getUTCHours() : startT.getHours(), startT.getUTCMinutes ? startT.getUTCMinutes() : startT.getMinutes(), 0);
        } else {
          const [startHour, startMinute] = (typeof timeStr === 'string' ? timeStr : '').split(':');
          if (startHour !== undefined) {
            startDate.setHours(parseInt(startHour, 10), parseInt(startMinute || 0, 10), 0);
          }
        }
      } else {
        startDate.setHours(9, 0, 0);
      }

      const endDate = new Date(booking.date || booking.booking_date || booking.bookingDate || new Date());
      if (booking.endTime || booking.end_time) {
        const timeStr = booking.endTime || booking.end_time;
        if (timeStr instanceof Date || (typeof timeStr === 'string' && timeStr.includes('T'))) {
          const endT = new Date(timeStr);
          endDate.setHours(endT.getUTCHours ? endT.getUTCHours() : endT.getHours(), endT.getUTCMinutes ? endT.getUTCMinutes() : endT.getMinutes(), 0);
        } else {
          const [endHour, endMinute] = (typeof timeStr === 'string' ? timeStr : '').split(':');
          if (endHour !== undefined) {
            endDate.setHours(parseInt(endHour, 10), parseInt(endMinute || 0, 10), 0);
          }
        }
      } else {
        endDate.setHours(11, 0, 0);
      }

      const name = booking.customerName || booking.users?.name || 'Guest Booking';
      const guests = booking.guests || booking.total_persons || booking.guestCount || 1;

      list.push({
        id: booking._id || booking.id,
        type: 'BOOKING',
        title: `🍽️ ${name} (${guests} Guests)`,
        start: startDate,
        end: endDate,
        status: booking.status || booking.booking_status || 'CONFIRMED',
        raw: booking
      });
    });

    // 2. Process Availability Blocks
    blocks.forEach((block) => {
      const s = new Date(block.start_at || block.startAt);
      const e = new Date(block.end_at || block.endAt);

      let icon = '🚫';
      if (block.reason === 'HOLIDAY') icon = '🏖️';
      else if (block.reason === 'PRIVATE_EVENT') icon = '🎉';
      else if (block.reason === 'MAINTENANCE') icon = '🔧';
      else if (block.reason === 'PERSONAL_CLOSURE') icon = '🔒';
      else if (block.reason === 'OTHER') icon = '⛔';

      const reasonLabel = block.reason === 'HOLIDAY' ? 'Holiday' :
                          block.reason === 'PRIVATE_EVENT' ? 'Private Event' :
                          block.reason === 'MAINTENANCE' ? 'Maintenance' :
                          block.reason === 'PERSONAL_CLOSURE' ? 'Personal Closure' : 'Blocked';

      list.push({
        id: block.id,
        type: 'BLOCK',
        title: `${icon} ${block.title || reasonLabel}`,
        start: s,
        end: e,
        reason: block.reason || 'OTHER',
        isAllDay: block.is_all_day || block.isAllDay,
        raw: block
      });
    });

    // Apply Filter
    return list.filter((item) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'BOOKED') return item.type === 'BOOKING';
      if (activeFilter === 'BLOCKED') return item.type === 'BLOCK';
      if (activeFilter === 'PRIVATE_EVENT') return item.type === 'BLOCK' && item.reason === 'PRIVATE_EVENT';
      if (activeFilter === 'HOLIDAY') return item.type === 'BLOCK' && item.reason === 'HOLIDAY';
      if (activeFilter === 'MAINTENANCE') return item.type === 'BLOCK' && item.reason === 'MAINTENANCE';
      return true;
    });
  }, [bookings, blocks, activeFilter]);

  // Color & badge styling for events
  const eventStyleGetter = (event) => {
    let backgroundColor = '#FFF8F0';
    let color = '#6F4E37';
    let border = '1px solid #DDB892';

    if (event.type === 'BOOKING') {
      const statusUpper = (event.status || '').toUpperCase();
      if (statusUpper === 'APPROVED' || statusUpper === 'CONFIRMED') {
        backgroundColor = '#ECFDF5';
        color = '#047857';
        border = '1px solid #A7F3D0';
      } else if (statusUpper === 'COMPLETED') {
        backgroundColor = '#EFF6FF';
        color = '#1D4ED8';
        border = '1px solid #BFDBFE';
      } else {
        backgroundColor = '#FEFCE8';
        color = '#A16207';
        border = '1px solid #FEF08A';
      }
    } else if (event.type === 'BLOCK') {
      if (event.reason === 'PRIVATE_EVENT') {
        backgroundColor = '#F5F3FF';
        color = '#6D28D9';
        border = '1px solid #DDD6FE';
      } else if (event.reason === 'HOLIDAY') {
        backgroundColor = '#FFFBEB';
        color = '#B45309';
        border = '1px solid #FDE68A';
      } else if (event.reason === 'MAINTENANCE') {
        backgroundColor = '#FFF7ED';
        color = '#C2410C';
        border = '1px solid #FED7AA';
      } else {
        backgroundColor = '#FEF2F2';
        color = '#B91C1C';
        border = '1px solid #FECACA';
      }
    }

    return {
      style: {
        backgroundColor,
        color,
        border,
        borderRadius: '8px',
        opacity: 0.96,
        display: 'block',
        fontSize: '11px',
        fontWeight: '800',
        padding: '3px 6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer'
      }
    };
  };

  const handleSelectEvent = (event) => {
    if (event.type === 'BLOCK') {
      setSelectedBlock(event.raw);
      setIsModalOpen(true);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedBlock({
      cafe_id: currentCafeId,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      is_all_day: false
    });
    setIsModalOpen(true);
  };

  // Selected-day events for Mobile Compact View
  const selectedDayEvents = useMemo(() => {
    const curDateStr = moment(date).format('YYYY-MM-DD');
    return calendarEvents.filter((evt) => {
      const evtStartStr = moment(evt.start).format('YYYY-MM-DD');
      const evtEndStr = moment(evt.end).format('YYYY-MM-DD');
      return curDateStr >= evtStartStr && curDateStr <= evtEndStr;
    });
  }, [calendarEvents, date]);

  return (
    <div className="space-y-6 text-[#2C1810]">

      {/* Top Bar Summary & Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* 1. Cafe Selector & Availability Action Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-wider">
                  Availability Engine
                </span>
                {isLoadingAvailability && (
                  <RefreshCw className="w-3.5 h-3.5 text-[#A67B5B] animate-spin" />
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
                Vendor Availability & Bookings Calendar
              </h2>
              <p className="text-xs text-[#A67B5B] font-medium">
                Manage business open slots, declare holiday blocks, and monitor dining table reservations in real-time.
              </p>
            </div>

            {/* Add Block CTA */}
            <button
              onClick={() => {
                setSelectedBlock(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] hover:brightness-105 active:scale-98 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>

          {/* Filter Chips & Cafe Selector Bar */}
          <div className="pt-3 border-t border-[#E8DED5] flex flex-wrap items-center justify-between gap-3">
            {/* Cafe Picker (if multi-cafe owner) */}
            {cafes.length > 1 && (
              <div className="flex items-center gap-2">
                <Coffee className="w-3.5 h-3.5 text-[#6F4E37]" />
                <select
                  value={currentCafeId}
                  onChange={(e) => onCafeChange && onCafeChange(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#DDB892] rounded-xl text-xs font-bold text-[#2C1810] focus:outline-none cursor-pointer"
                >
                  {cafes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                
                // Dynamic count for each filter
                let count = 0;
                if (f.id === 'ALL') {
                  count = calendarEvents.length;
                } else if (f.id === 'BOOKED') {
                  count = bookings.length;
                } else if (f.id === 'BLOCKED') {
                  count = blocks.length;
                } else {
                  count = blocks.filter(b => b.reason === f.id).length;
                }

                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-[#6F4E37] text-white shadow-sm ring-2 ring-[#6F4E37]/30'
                        : 'bg-white border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0] hover:border-[#DDB892]'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-[#6F4E37]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Today & Upcoming Availability Snapshot Card */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E8DED5] pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#6F4E37]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2C1810]">
                Today & Upcoming Pulse
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#A67B5B]">
              {moment().format('MMM D, YYYY')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-3">
            <div className="bg-[#FFF8F0] p-3 rounded-2xl border border-[#DDB892]/40 text-center">
              <p className="text-[10px] uppercase font-black text-[#A67B5B]">Today's Bookings</p>
              <p className="text-xl font-black text-[#6F4E37] mt-0.5">
                {summary?.todayBookingsCount ?? summary?.today_bookings_count ?? 0}
              </p>
            </div>
            <div className="bg-[#FEF2F2] p-3 rounded-2xl border border-rose-200 text-center">
              <p className="text-[10px] uppercase font-black text-rose-600">Active Blocks</p>
              <p className="text-xl font-black text-rose-700 mt-0.5">
                {summary?.totalActiveBlocksCount ?? (blocks.length > 0 ? blocks.length : (summary?.upcomingBlocksCount || 0))}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            {(() => {
              const now = new Date();
              const upcomingList = (summary?.upcomingBlocks && summary.upcomingBlocks.length > 0)
                ? summary.upcomingBlocks
                : (summary?.upcoming_blocks && summary.upcoming_blocks.length > 0)
                ? summary.upcoming_blocks
                : blocks.filter(b => new Date(b.end_at || b.endAt) >= now);

              const count = summary?.upcomingBlocksCount ?? upcomingList.length;

              return (
                <>
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                    Upcoming Closures ({count})
                  </p>
                  {upcomingList.length > 0 ? (
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                      {upcomingList.slice(0, 3).map((ub) => (
                        <div 
                          key={ub.id} 
                          onClick={() => {
                            setSelectedBlock(ub);
                            setIsModalOpen(true);
                          }}
                          className="text-[11px] p-2 rounded-xl bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/70 hover:border-[#DDB892] flex items-center justify-between cursor-pointer transition-all hover:translate-x-0.5 group"
                          title="Click to view or edit this closure"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span className="font-bold text-[#2C1810] group-hover:text-[#6F4E37] truncate max-w-[140px] transition-colors">
                              {ub.title || 'Blocked Slot'}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#6F4E37] bg-white px-2 py-0.5 rounded-md border border-[#DDB892]/40 shrink-0">
                            {moment(ub.start_at || ub.startAt).format('MMM D')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic">No upcoming closures scheduled.</p>
                  )}
                </>
              );
            })()}
          </div>
        </div>

      </div>

      {/* Main Big Calendar Container */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-2xs calendar-wrapper text-[#2C1810]">
        
        {/* Color Legend Header */}
        <div className="mb-4 pb-3 border-b border-[#E8DED5] flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold">
          <span className="text-[#A67B5B] uppercase text-[10px] font-black tracking-wider">Legend:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Confirmed Booking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Holiday Closure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Private Event Block</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span>Maintenance Closure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Other Closure</span>
            </div>
          </div>
        </div>

        {/* Custom Calendar CSS */}
        <style dangerouslySetInnerHTML={{__html: `
          .calendar-wrapper .rbc-calendar {
            font-family: inherit;
          }
          .calendar-wrapper .rbc-toolbar {
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 12px;
          }
          .calendar-wrapper .rbc-toolbar button {
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 700;
            color: #2C1810;
            transition: all 0.2s ease;
          }
          .calendar-wrapper .rbc-toolbar button:hover {
            background-color: #FFF8F0;
            color: #6F4E37;
            border-color: #DDB892;
          }
          .calendar-wrapper .rbc-toolbar button.rbc-active {
            background-color: #6F4E37 !important;
            color: #ffffff !important;
            border-color: #6F4E37 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .calendar-wrapper .rbc-toolbar-label {
            font-size: 16px;
            font-weight: 900;
            color: #2C1810;
          }
          .calendar-wrapper .rbc-header {
            padding: 12px 0;
            font-size: 11px;
            font-weight: 800;
            color: #6F4E37;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #E8DED5;
            background-color: #FFFDFB;
          }
          .calendar-wrapper .rbc-month-view, .calendar-wrapper .rbc-time-view {
            border-radius: 16px;
            border: 1px solid #E8DED5;
            overflow: hidden;
            background-color: #ffffff;
          }
          .calendar-wrapper .rbc-day-bg {
            cursor: pointer;
            transition: background-color 0.15s ease;
          }
          .calendar-wrapper .rbc-day-bg:hover {
            background-color: #FFF8F0/60 !important;
          }
          .calendar-wrapper .rbc-today {
            background-color: #FFF5EA !important;
          }
          .calendar-wrapper .rbc-day-bg + .rbc-day-bg {
            border-left: 1px solid #F3EDE6;
          }
          .calendar-wrapper .rbc-month-row + .rbc-month-row {
            border-top: 1px solid #F3EDE6;
          }
          .calendar-wrapper .rbc-date-cell {
            padding: 6px 8px;
            font-weight: 800;
            font-size: 12px;
            color: #2C1810;
          }
          .calendar-wrapper .rbc-date-cell.rbc-now {
            color: #6F4E37;
            font-weight: 900;
          }
          .calendar-wrapper .rbc-event {
            transition: all 0.15s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }
          .calendar-wrapper .rbc-event:hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 4px 8px rgba(111,78,55,0.18);
            z-index: 30;
          }
        `}} />

        <div className="h-[680px]">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            views={['month', 'week', 'day']}
            tooltipAccessor="title"
          />
        </div>
      </div>

      {/* Mobile Schedule Section for screens under 768px */}
      <div className="block lg:hidden bg-white p-5 rounded-3xl border border-[#DDB892]/60 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8DED5] pb-2.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#2C1810] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Selected Day Timeline ({moment(date).format('MMM D, YYYY')})</span>
          </h4>
          <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-full border border-[#DDB892]/40">
            {selectedDayEvents.length} Items
          </span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-3 text-center">
            No bookings or blocks scheduled for this date.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedDayEvents.map((evt) => (
              <div 
                key={evt.id} 
                onClick={() => evt.type === 'BLOCK' && handleSelectEvent(evt)}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  evt.type === 'BLOCK' ? 'bg-[#FFF8F0] border-[#DDB892] cursor-pointer hover:shadow-xs' : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div>
                  <p className="font-extrabold text-[#2C1810]">{evt.title}</p>
                  <p className="text-[10px] font-semibold text-stone-500 mt-0.5">
                    {moment(evt.start).format('h:mm A')} - {moment(evt.end).format('h:mm A')}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  evt.type === 'BLOCK' ? 'bg-[#6F4E37] text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {evt.type === 'BLOCK' ? (evt.reason || 'BLOCKED') : 'BOOKING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding / Editing Availability Blocks */}
      <AvailabilityBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlock(null);
        }}
        onSubmit={handleSaveBlock}
        onDelete={handleDeleteBlock}
        initialData={selectedBlock}
        cafes={cafes}
        selectedCafeId={currentCafeId}
      />

    </div>
  );
};
