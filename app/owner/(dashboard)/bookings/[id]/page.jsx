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

import { useAuthStore } from '@/store/auth.store';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const confirm = useConfirm();
  const userRole = useAuthStore((state) => state.role);
  
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
  
  // Cafe owner amount calculation: sum of itemized CAFE items or stored subtotal/cafe_amount
  const allBookingItems = bookingData.booking_items || bookingData.bookingItems || [];
  
  // Sum of itemized CAFE inclusions / package items / cafe charges attached to this booking
  const cafeItems = allBookingItems.filter(it => it.provider_type === 'CAFE' || it.item_type === 'CAFE_INCLUSION' || it.item_type === 'CAFE_CHARGE' || it.item_type === 'PACKAGE');
  const itemizedCafeTotal = cafeItems.reduce((sum, it) => sum + Number(it.amount || (Number(it.unit_price || 0) * (it.pricing_type === 'PER_GUEST' ? Number(guests || 1) : Number(it.quantity || 1)))), 0);

  // Stored subtotal / cafe_amount / subtotal from booking record
  const storedCafeAmount = Number(bookingData.cafe_amount || 0);
  const storedFoodAmount = Number(bookingData.food_amount || 0);
  const storedSubtotal = Number(bookingData.subtotal || bookingData.total || 0);

  let amount = 0;
  if (itemizedCafeTotal > 0) {
    amount = itemizedCafeTotal;
  } else if (storedCafeAmount > 0 || storedFoodAmount > 0) {
    amount = storedCafeAmount + storedFoodAmount;
  } else {
    amount = storedSubtotal;
  }

  amount = Math.max(0, Number(amount.toFixed(2)));

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

            {/* Selected Table(s) */}
            {(() => {
              const bookingTables = bookingData.booking_tables || bookingData.bookingTables || [];
              if (bookingTables.length === 0) return null;

              const LOCATION_COLORS = {
                indoor:  { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   pill: 'bg-blue-100 text-blue-700 border-blue-300' },
                outdoor: { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  pill: 'bg-green-100 text-green-700 border-green-300' },
                private: { bg: 'bg-purple-50', border: 'border-purple-200',text: 'text-purple-700', pill: 'bg-purple-100 text-purple-700 border-purple-300' },
                rooftop: { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700', pill: 'bg-orange-100 text-orange-700 border-orange-300' },
              };
              const getLocColors = (loc) =>
                LOCATION_COLORS[String(loc || '').toLowerCase()] ||
                { bg: 'bg-surface/40', border: 'border-border/50', text: 'text-[#6F4E37]', pill: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#DDB892]/60' };

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">
                        Selected {bookingTables.length > 1 ? 'Tables' : 'Table'}
                      </h3>
                      <p className="text-xs text-text/60">
                        {bookingTables.length} table{bookingTables.length > 1 ? 's' : ''} reserved by the guest
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookingTables.map((bt, idx) => {
                      const tbl = bt.cafe_tables || bt;
                      const tableNum = tbl.table_number || tbl.tableNumber || `T-${idx + 1}`;
                      const capacity = tbl.capacity || tbl.max_capacity || tbl.seats || null;
                      const location = tbl.location || tbl.area || null;
                      const status = tbl.status || 'AVAILABLE';
                      const locColors = getLocColors(location);

                      return (
                        <div
                          key={tbl.id || idx}
                          className={`p-4 rounded-2xl border ${locColors.bg} ${locColors.border} flex items-start gap-3`}
                        >
                          {/* Table Number Badge */}
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 font-black text-lg ${locColors.bg} ${locColors.border} ${locColors.text}`}>
                            {tableNum}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-[#2C1810] text-sm">
                                Table {tableNum}
                              </span>
                              {location && (
                                <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${locColors.pill}`}>
                                  {location}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs text-text/60">
                              {capacity && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-[#6F4E37]" />
                                  <span className="font-bold text-[#2C1810]">{capacity} seats</span>
                                </span>
                              )}
                              <span className={`flex items-center gap-1 font-bold ${
                                status === 'RESERVED' || status === 'BOOKED' ? 'text-amber-600' :
                                status === 'OCCUPIED' ? 'text-rose-600' : 'text-emerald-600'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                  status === 'RESERVED' || status === 'BOOKED' ? 'bg-amber-500' :
                                  status === 'OCCUPIED' ? 'bg-rose-500' : 'bg-emerald-500'
                                }`} />
                                {status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Included Services & Packages */}
            {(() => {
              // Parse booking_items for inclusions
              const allItems = bookingData.booking_items || bookingData.bookingItems || [];
              const inclusionItems = allItems.filter(
                (it) => it.item_type === 'CAFE_INCLUSION' || it.item_type === 'EVENT_INCLUSION' || it.item_type === 'INCLUSION'
              );

              // Also parse inclusions JSON field as fallback
              let parsedInclusions = [];
              const rawInclusions = bookingData.inclusions;
              if (rawInclusions) {
                let inc = typeof rawInclusions === 'string' ? (() => { try { return JSON.parse(rawInclusions); } catch { return null; } })() : rawInclusions;
                if (Array.isArray(inc)) {
                  parsedInclusions = inc;
                } else if (inc && typeof inc === 'object') {
                  Object.values(inc).forEach((val) => {
                    if (Array.isArray(val)) val.forEach((v) => v && typeof v === 'object' && parsedInclusions.push(v));
                    else if (val && typeof val === 'object') parsedInclusions.push(val);
                  });
                }
              }

              // Merge: prefer booking_items, fallback to parsedInclusions
              const displayInclusions = inclusionItems.length > 0
                ? inclusionItems.map((it) => ({
                    name: it.item_name || it.name || 'Inclusion',
                    tierName: it.tier_name || null,
                    tierId: it.tier_id || null,
                    tierLevel: it.package_level || null,
                    description: it.description || null,
                    pricingType: it.pricing_type || 'FIXED',
                    unitPrice: Number(it.unit_price || 0),
                    quantity: Number(it.quantity || 1),
                    amount: Number(it.amount || it.unit_price || 0),
                  }))
                : parsedInclusions.map((it) => {
                    const tierName = it.tier_name || it.tierName || it.name || null;
                    const tierId = it.tier_id || it.tierId || it.id || null;
                    return {
                      name: it.item_name || it.inclusion_name || it.inclusionName || tierName || 'Inclusion',
                      tierName,
                      tierId,
                      tierLevel: it.level || it.tierLevel || tierName,
                      description: it.description || null,
                      pricingType: it.pricing_type || it.pricingType || 'FIXED',
                      unitPrice: Number(it.unit_price || it.unitPrice || it.price || 0),
                      quantity: Number(it.quantity || 1),
                      amount: Number(it.amount || it.price || it.unit_price || it.unitPrice || 0),
                    };
                  });

              const packageItem = allItems.find((it) => it.item_type === 'PACKAGE') || bookingData.packages;
              const hasAnything = displayInclusions.length > 0 || packageItem || bookingData.event_services;

              const TIER_COLORS = {
                BASIC:    { bg: 'bg-sky-50',    border: 'border-sky-300/60',    text: 'text-sky-700',    pill: 'bg-sky-100 text-sky-700 border-sky-300' },
                STANDARD: { bg: 'bg-violet-50', border: 'border-violet-300/60', text: 'text-violet-700', pill: 'bg-violet-100 text-violet-700 border-violet-300' },
                PREMIUM:  { bg: 'bg-amber-50',  border: 'border-amber-300/60',  text: 'text-amber-700',  pill: 'bg-amber-100 text-amber-700 border-amber-400' },
              };
              const getTierColors = (tier) => TIER_COLORS[String(tier || '').toUpperCase()] || { bg: 'bg-surface/40', border: 'border-border/50', text: 'text-[#6F4E37]', pill: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#DDB892]/60' };

              if (!hasAnything) return null;

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Included Services & Packages</h3>
                      <p className="text-xs text-text/60">Selected party packages and event add-ons</p>
                    </div>
                  </div>

                  <div className="space-y-3">

                    {/* Package base row */}
                    {packageItem && (
                      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#DDB892]/30 to-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-[#2C1810] text-sm">
                              {packageItem.package_name || packageItem.item_name || packageItem.name || 'Cafe Package'}
                            </h4>
                            <span className="text-[10px] font-black bg-[#6F4E37]/10 text-[#6F4E37] border border-[#DDB892]/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Package</span>
                          </div>
                          {(packageItem.description || packageItem.package_description) && (
                            <p className="text-xs text-text/60 mt-0.5">{packageItem.description || packageItem.package_description}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Inclusion rows */}
                    {displayInclusions.map((inc, idx) => {
                      const tierKey = String(inc.tierName || inc.tierLevel || '').toUpperCase();
                      const colors = getTierColors(tierKey);
                      const isPerGuest = String(inc.pricingType || '').toUpperCase() === 'PER_GUEST';
                      const guestCount = bookingData.total_persons || bookingData.guestCount || 1;
                      const computedAmount = isPerGuest
                        ? (inc.unitPrice * Number(guestCount)).toFixed(2)
                        : inc.amount > 0 ? inc.amount.toFixed(2) : (inc.unitPrice * inc.quantity).toFixed(2);

                      return (
                        <div key={inc.tierId || idx} className={`p-4 rounded-2xl border ${colors.bg} ${colors.border} flex items-start gap-4`}>
                          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 font-black text-sm ${colors.bg} ${colors.border} ${colors.text}`}>
                            {tierKey ? tierKey.charAt(0) : '★'}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-extrabold text-[#2C1810] text-sm">{inc.name}</h4>
                              {tierKey && (
                                <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.pill}`}>
                                  {tierKey}
                                </span>
                              )}
                              <span className="text-[10px] font-bold bg-white border border-border/50 text-text/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {isPerGuest ? 'Per Guest' : 'Fixed'}
                              </span>
                            </div>

                            {inc.description && (
                              <p className="text-xs text-text/60">{inc.description}</p>
                            )}

                            <div className="flex flex-wrap gap-3 pt-1 text-xs">
                              <span className="text-text/60">
                                Unit Price: <span className="font-bold text-[#2C1810]">₹{inc.unitPrice.toFixed(2)}</span>
                              </span>
                              {isPerGuest && (
                                <span className="text-text/60">
                                  × <span className="font-bold text-[#2C1810]">{guestCount} guests</span>
                                </span>
                              )}
                              <span className={`font-black ${colors.text}`}>= ₹{computedAmount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* No inclusions message */}
                    {displayInclusions.length === 0 && !packageItem && !bookingData.event_services && (
                      <p className="text-xs text-text/60 text-center py-4">No inclusions found for this booking.</p>
                    )}

                    {/* Event service row */}
                    {bookingData.event_services && (
                      <div className="p-4 rounded-2xl bg-surface/40 border border-border/50 flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-[#2C1810] text-sm truncate">
                            {bookingData.event_services.service_name || 'Event Service'}
                          </h4>
                          <p className="text-xs text-text/60">
                            By {bookingData.event_services.users?.event_management_profiles?.company_name || bookingData.event_services.users?.name || 'Event Partner'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

            {/* Payment & Online Settlement Status Card (Hidden for Restaurant Owners) */}
            {userRole !== 'RESTAURANT_OWNER' && (
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
            )}

          </div>
        </div>

      </div>
    </PageContainer>
  );
}
