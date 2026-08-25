'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { List, ArrowLeft, Calendar as CalendarIcon, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import { useBookingCalendar } from '@/hooks/booking';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';

export default function BookingsCalendarPage() {
  const router = useRouter();
  const { data: bookingsData, isLoading, refetch } = useBookingCalendar();
  
  // Safely extract array
  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.data || bookingsData?.bookings || []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <button 
            onClick={() => router.push('/owner/bookings')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0"
            title="Back to List View"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">
                Visual Booking Calendar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                CALENDAR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Interactive timeline view to track table reservations and daily peak dining slots.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 z-10">
          <button 
            onClick={() => refetch()}
            className="w-10 h-10 rounded-2xl border border-[#DDB892]/60 bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
            title="Refresh Calendar Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link href="/owner/bookings">
            <Button className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all">
              <List className="w-4 h-4 text-white" />
              <span>List View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Interactive Calendar Section */}
      <div>
        {isLoading ? (
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs h-[720px]">
            <LoadingSkeleton type="card" className="h-full rounded-2xl" />
          </div>
        ) : (
          <BookingCalendar bookings={bookings} />
        )}
      </div>

    </div>
  );
}
