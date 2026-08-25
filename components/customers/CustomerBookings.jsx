import React from 'react';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CustomerBookings = ({ bookings }) => {
  const router = useRouter();

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface/30 rounded-3xl border border-border/50 border-dashed">
        <CalendarCheck className="w-10 h-10 text-text/20 mb-3" />
        <p className="text-text/60 font-medium">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-surface/50 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border">
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Cafe</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {bookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="hover:bg-surface/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/owner/bookings/${booking.id}`)}
              >
                <td className="px-6 py-4 font-medium text-text">#{booking.booking_number || booking.id.substring(0,8)}</td>
                <td className="px-6 py-4 text-text/80">{booking.cafes?.name || booking.cafe_name || 'Cafe'}</td>
                <td className="px-6 py-4 text-text/70">{new Date(booking.booking_date || booking.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    (booking.booking_status || booking.status) === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    (booking.booking_status || booking.status) === 'CANCELLED' ? 'bg-danger/10 text-danger' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.booking_status || booking.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">₹{Number(booking.total_price ?? booking.total ?? booking.subtotal ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
