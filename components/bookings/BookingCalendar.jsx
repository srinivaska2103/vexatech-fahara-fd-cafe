'use client';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, User } from 'lucide-react';

const localizer = momentLocalizer(moment);

export const BookingCalendar = ({ bookings = [] }) => {
  const router = useRouter();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Convert API bookings to React Big Calendar event format
  const events = bookings.map((booking) => {
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

    const name = booking.customerName || booking.users?.name || 'Guest';
    const guests = booking.guests || booking.total_persons || booking.guestCount || 1;

    return {
      id: booking._id || booking.id,
      title: `${name} (${guests} Guests)`,
      start: startDate,
      end: endDate,
      status: booking.status || booking.booking_status || 'PENDING',
      resource: booking,
    };
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = '#FFF8F0';
    let color = '#6F4E37';
    let border = '1px solid #DDB892';

    const statusUpper = (event.status || '').toUpperCase();

    if (statusUpper === 'APPROVED' || statusUpper === 'CONFIRMED') {
      backgroundColor = '#ECFDF5';
      color = '#047857';
      border = '1px solid #A7F3D0';
    } else if (statusUpper === 'COMPLETED') {
      backgroundColor = '#EFF6FF';
      color = '#1D4ED8';
      border = '1px solid #BFDBFE';
    } else if (statusUpper === 'REJECTED' || statusUpper === 'CANCELLED') {
      backgroundColor = '#FEF2F2';
      color = '#B91C1C';
      border = '1px solid #FECACA';
    } else if (statusUpper === 'PENDING') {
      backgroundColor = '#FEFCE8';
      color = '#A16207';
      border = '1px solid #FEF08A';
    }

    return {
      style: {
        backgroundColor,
        color,
        border,
        borderRadius: '10px',
        opacity: 0.95,
        display: 'block',
        fontSize: '11px',
        fontWeight: '800',
        padding: '3px 6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }
    };
  };

  const handleSelectEvent = (event) => {
    if (event.id) {
      router.push(`/owner/bookings/${event.id}`);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-border/60 shadow-2xs h-[720px] calendar-wrapper text-[#2C1810]">
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
          border-bottom: 1px solid #f3f4f6;
        }
        .calendar-wrapper .rbc-month-view, .calendar-wrapper .rbc-[#6F4E37]-view {
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          overflow: hidden;
        }
        .calendar-wrapper .rbc-today {
          background-color: #FFF8F0 !important;
        }
        .calendar-wrapper .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid #f3f4f6;
        }
        .calendar-wrapper .rbc-[#6F4E37]-bg + .rbc-[#6F4E37]-bg {
          border-top: 1px solid #f3f4f6;
        }
        .calendar-wrapper .rbc-event {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .calendar-wrapper .rbc-event:hover {
          transform: scale(1.03);
          z-index: 20;
        }
      `}} />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={['month', 'week', 'day']}
        tooltipAccessor="title"
      />
    </div>
  );
};
