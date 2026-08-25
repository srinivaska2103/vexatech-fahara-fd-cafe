'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useBooking, useApproveBooking, useRejectBooking } from '@/hooks/booking';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  CreditCard, 
  Clock, 
  Calendar, 
  Coffee, 
  Users, 
  Store, 
  Sparkles, 
  Copy, 
  Mail, 
  Phone, 
  MessageSquare,
  ArrowRightLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const confirm = useConfirm();
  
  const { data: booking, isLoading } = useBooking(id);
  const approveMutation = useApproveBooking();
  const rejectMutation = useRejectBooking();

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSkeleton type="card" className="h-[200px] mb-6 rounded-3xl" />
        <LoadingSkeleton type="list" className="h-[300px] rounded-3xl" />
      </PageContainer>
    );
  }

  if (!booking) {
    return (
      <PageContainer>
        <div className="p-12 text-center bg-white rounded-3xl border border-border/60 shadow-2xs max-w-md mx-auto my-10 space-y-4 text-[#2C1810]">
          <Calendar className="w-12 h-12 text-[#6F4E37] opacity-40 mx-auto" />
          <h3 className="text-lg font-extrabold">Booking Record Not Found</h3>
          <p className="text-xs text-text/60">The reservation record you requested does not exist or has been removed.</p>
          <BackButton href="/owner/bookings" label="Back to Bookings" />
        </div>
      </PageContainer>
    );
  }

  const formatTimeStr = (timeStr) => {
    if (!timeStr) return '';
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      const localDate = new Date();
      localDate.setHours(d.getUTCHours(), d.getUTCMinutes(), 0);
      return localDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return timeStr;
  };

  const bookingData = booking.data || booking;

  const customerName = bookingData.customerName || bookingData.users?.name || 'Guest';
  const customerEmail = bookingData.customerEmail || bookingData.users?.email || '';
  const customerPhone = bookingData.customerPhone || bookingData.users?.phone || '';
  const bookingDate = bookingData.bookingDate || bookingData.booking_date;
  const startTime = formatTimeStr(bookingData.startTime || bookingData.start_time);
  const endTime = formatTimeStr(bookingData.endTime || bookingData.end_time);
  const guests = bookingData.guestCount || bookingData.total_persons;
  
  // Cafe owner amount: subtotal minus external event service amount (if any)
  let baseAmount = bookingData.subtotal || Math.max(0, (bookingData.total || 0) - (bookingData.fahara_service_charge || 0));
  if (bookingData.event_service_id) {
    baseAmount -= (bookingData.event_service_amount || 0);
  }
  const amount = Math.max(0, baseAmount);

  const paymentStatus = bookingData.paymentStatus || bookingData.payment_status;
  const status = bookingData.status || bookingData.booking_status;
  const cafeName = bookingData.cafeName || bookingData.cafes?.name || '';
  const specialRequests = bookingData.specialRequests || bookingData.special_request || '';
  const createdAt = bookingData.createdAt || bookingData.created_at;
  const idDisplay = bookingData.booking_number?.toUpperCase() || bookingData.id?.substring(0,8).toUpperCase();

  return (
    <PageContainer>
      <div className="space-y-6 text-[#2C1810]">
        
        {/* Modern SaaS Header Hero Banner */}
        <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <BackButton href="/owner/bookings" label="Back to Bookings" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RESERVATION DETAILS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
                  Booking #{idDisplay}
                </h1>
                <BookingStatusBadge status={status} />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(bookingData.booking_number || bookingData.id);
                    toast.success('Booking reference copied!');
                  }}
                  className="p-1.5 rounded-xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Copy Booking Ref"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-text/60 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                <span>Placed on {createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy · hh:mm a') : 'Unknown Date'}</span>
              </p>
            </div>

            {status === 'PENDING' && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'Approve Booking',
                      message: `Approve booking #${idDisplay} for ${customerName}?`,
                      confirmText: 'Approve',
                      type: 'success'
                    });
                    if (ok) {
                      approveMutation.mutate({ id: bookingData._id || bookingData.id, data: {} });
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Booking</span>
                </Button>

                <Button
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'Reject Booking',
                      message: `Reject booking #${idDisplay} for ${customerName}?`,
                      confirmText: 'Reject',
                      type: 'danger'
                    });
                    if (ok) {
                      rejectMutation.mutate({ id: bookingData._id || bookingData.id, data: { reason: 'Capacity full' } });
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Info Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Reservation Specs Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2C1810]">Reservation Details</h3>
                  <p className="text-xs text-text/60">Schedule time, guest count & venue location</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-surface/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Date</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2C1810]">
                    {bookingDate ? format(new Date(bookingDate), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Time Slot</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2C1810] truncate">
                    {startTime} - {endTime}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Guest Count</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2C1810]">
                    {guests} People
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Venue Cafe</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2C1810] truncate">
                    {cafeName || 'N/A'}
                  </p>
                </div>
              </div>

              {specialRequests && (
                <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 space-y-1">
                  <p className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Special Guest Requests
                  </p>
                  <p className="text-xs text-[#2C1810] leading-relaxed italic">"{specialRequests}"</p>
                </div>
              )}
            </div>

            {/* Included Services & Packages */}
            {(bookingData.event_services || bookingData.packages) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810]">Included Services & Packages</h3>
                    <p className="text-xs text-text/60">Selected party packages and event add-ons</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {bookingData.event_services && (
                    <div className="p-4 rounded-2xl bg-surface/40 border border-border/50 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0 font-bold">
                        <Coffee className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-extrabold text-[#2C1810] text-sm sm:text-base truncate">
                          {bookingData.event_services.service_name || 'Event Service'}
                        </h4>
                        <p className="text-xs text-text/60">
                          Provided by {bookingData.event_services.users?.event_management_profiles?.company_name || bookingData.event_services.users?.name || 'Third-Party Event Partner'}
                        </p>
                      </div>
                    </div>
                  )}

                  {bookingData.packages && (
                    <div className="p-4 rounded-2xl bg-surface/40 border border-border/50 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0 font-bold">
                        <Coffee className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-extrabold text-[#2C1810] text-sm sm:text-base truncate">
                          {bookingData.packages.package_name || 'Cafe Package'}
                        </h4>
                        <p className="text-xs text-text/60">
                          {bookingData.packages.description || 'Provided by Cafe'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Customer Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2C1810]">Customer Profile</h3>
                  <p className="text-[11px] text-text/60">Diner contact info</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center text-lg font-black shrink-0 border border-[#DDB892]/40">
                  {customerName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[#2C1810] text-sm truncate">{customerName}</p>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-0.5">
                    Verified Customer
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-text/60 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#6F4E37]" /> Email
                  </span>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-bold text-[#2C1810] truncate max-w-[150px]">
                      {customerEmail || 'N/A'}
                    </span>
                    {customerEmail && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(customerEmail);
                          toast.success('Email copied!');
                        }}
                        className="p-1 rounded-lg hover:bg-surface text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                        title="Copy Email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-text/60 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#6F4E37]" /> Phone
                  </span>
                  <div className="flex items-center gap-1 min-w-0">
                    <a href={customerPhone ? `tel:${customerPhone}` : '#'} className="font-bold text-[#6F4E37] hover:underline truncate">
                      {customerPhone || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Online Settlement Status Card */}
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2C1810]">Payment & Settlement</h3>
                  <p className="text-[11px] text-text/60">Online split details</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-text/60 font-extrabold uppercase text-[10px] tracking-wider">BOOKING STATUS</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> {status || 'Confirmed'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-text/60 font-extrabold uppercase text-[10px] tracking-wider">PAYMENT STATUS</span>
                  <PaymentStatusBadge status={paymentStatus || 'Paid'} />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-text/60 font-extrabold uppercase text-[10px] tracking-wider">SETTLEMENT</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    (bookingData.settlementStatus || bookingData.settlement_status) === 'Settled'
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                  }`}>
                    {bookingData.settlementStatus || bookingData.settlement_status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block">Cafe Earnings Net Split</span>
                  <p className="text-2xl font-black text-[#6F4E37]">₹{amount.toLocaleString()}</p>
                </div>

                <div className="mt-3 text-xs text-text/60 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>Payment Method</span>
                    <span className="font-bold text-[#2C1810]">
                      {bookingData.paymentMethod ? bookingData.paymentMethod.replace(/\s*\/\s*(Cashfree|Razorpay)/gi, '').replace(/(Cashfree|Razorpay)/gi, 'Online') : 'Online'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Online Txn ID</span>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-mono text-[11px] text-[#6F4E37] font-bold truncate max-w-[130px]">
                        {bookingData.transactionId || 'TXN-CONFIRMED'}
                      </span>
                      {bookingData.transactionId && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(bookingData.transactionId);
                            toast.success('Txn ID copied!');
                          }}
                          className="p-1 rounded-lg hover:bg-surface text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                          title="Copy Transaction ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </PageContainer>
  );
}
