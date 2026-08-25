'use client';
import React from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreVertical, Eye, CheckCircle, XCircle, Calendar, User, Clock, Users, ArrowUpRight } from 'lucide-react';
import { BookingStatusBadge, PaymentStatusBadge } from './BookingStatusBadge';
import { Button } from '../ui/Button';

export const BookingTable = ({ bookings = [], onApprove, onReject, onComplete }) => {
  const formatTimeStr = (timeStr) => {
    if (!timeStr) return '';
    try {
      let hours = 0;
      let minutes = 0;

      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
          hours = d.getUTCHours();
          minutes = d.getUTCMinutes();
        }
      } else if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const timeOnly = timeStr.includes(' ') ? timeStr.split(' ')[0] : timeStr;
        const parts = timeOnly.split(':');
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
      } else {
        return String(timeStr);
      }

      if (isNaN(hours) || isNaN(minutes)) return String(timeStr);

      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch(e) {
      return String(timeStr);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs text-[#2C1810]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
            <tr>
              <th className="px-6 py-4">Booking Ref</th>
              <th className="px-6 py-4">Diner Customer</th>
              <th className="px-6 py-4">Date & Time Slot</th>
              <th className="px-6 py-4">Guests</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Reservation Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {bookings.map((booking) => {
              const customerName = booking.customerName || booking.users?.name || 'Guest Diner';
              const customerEmail = booking.customerEmail || booking.users?.email || '';
              const bookingDate = booking.bookingDate || booking.booking_date || booking.date;
              const startTime = formatTimeStr(booking.startTime || booking.start_time);
              const endTime = formatTimeStr(booking.endTime || booking.end_time);
              const guests = booking.guestCount || booking.total_persons || booking.guests || 1;
              const amount = booking.amount || booking.total || booking.total_price || 0;
              const paymentStatus = booking.paymentStatus || booking.payment_status;
              const status = booking.status || booking.booking_status || 'PENDING';

              const bookingId = booking._id || booking.id;
              const bookingRef = booking.booking_number ? `#${booking.booking_number.toUpperCase()}` : `#${bookingId?.substring(0, 8).toUpperCase()}`;

              return (
                <tr key={bookingId} className="hover:bg-surface/40 transition-colors">
                  
                  {/* Booking Ref */}
                  <td className="px-6 py-4 font-extrabold text-[#6F4E37]">
                    <Link href={`/owner/bookings/${bookingId}`} className="hover:underline flex items-center gap-1">
                      <span>{bookingRef}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] font-extrabold text-xs flex items-center justify-center shrink-0">
                        {customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#2C1810]">{customerName}</p>
                        {customerEmail && <p className="text-[10px] text-text/50">{customerEmail}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Date & Time Slot */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#2C1810] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>{bookingDate ? format(new Date(bookingDate), 'MMM dd, yyyy') : 'N/A'}</span>
                      </p>
                      <p className="text-[10px] text-text/60 flex items-center gap-1.5 pl-5">
                        <span>{startTime} - {endTime}</span>
                      </p>
                    </div>
                  </td>

                  {/* Guests */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface/60 border border-border/40 font-extrabold text-[#2C1810]">
                      <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                      <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                    </span>
                  </td>

                  {/* Amount & Payment Badge */}
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-[#2C1810]">₹{amount}</p>
                    {paymentStatus && <PaymentStatusBadge status={paymentStatus} className="mt-0.5 inline-block text-[10px]" />}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <BookingStatusBadge status={status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => onApprove({ ...booking, customerName })}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            title="Approve Reservation"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => onReject(booking)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Reject Reservation"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <Link href={`/owner/bookings/${bookingId}`}>
                        <button className="p-1.5 text-[#6F4E37] hover:bg-[#6F4E37]/10 rounded-xl transition-colors" title="View Reservation Details">
                          <Eye className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
