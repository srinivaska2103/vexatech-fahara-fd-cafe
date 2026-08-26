'use client';
import React, { useState } from 'react';
import { usePayments, useRevenueSummary } from '@/hooks/payment';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { PaymentSearch } from '@/components/payments/PaymentSearch';
import { PaymentFilters } from '@/components/payments/PaymentFilters';
import { EmptyPaymentState } from '@/components/payments/EmptyPaymentState';
import { LoadingSkeleton } from '@/components/payments/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FileText, 
  ArrowRightLeft, 
  Grid, 
  List as ListIcon, 
  TrendingUp, 
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  ShieldCheck,
  Building2,
  Sparkles,
  Download,
  Search,
  ArrowUpRight,
  Copy
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export default function PaymentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('30_DAYS');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    method: '',
    date_range: 'ALL'
  });

  const { data: paymentsData, isLoading, isError, error, refetch } = usePayments({ search, dateFilter, ...filters });
  const { data: revenueData } = useRevenueSummary();
  
  const rawPayments = Array.isArray(paymentsData?.data) ? paymentsData.data : (Array.isArray(paymentsData) ? paymentsData : []);
  const revenue = revenueData?.data || {};

  // Filter payments
  const payments = rawPayments.filter(p => {
    const searchLower = search.toLowerCase();
    const bookingId = (p.bookingId || p.booking_id || '').toLowerCase();
    const customer = (p.customerName || p.customer_name || '').toLowerCase();
    const matchesSearch = !search || bookingId.includes(searchLower) || customer.includes(searchLower);

    return matchesSearch;
  });

  // Calculate dynamic stats from payments list if revenue object is empty
  const totalBookingValue = revenue.total_booking_value ?? rawPayments.reduce((sum, p) => sum + Number(p.bookingAmount || p.amount || 0), 0);
  const yourEarnings = revenue.your_earnings ?? rawPayments.reduce((sum, p) => sum + Number(p.cafeAmount || p.amount || 0), 0);
  const pendingSettlement = revenue.pending_settlement ?? rawPayments.filter(p => String(p.settlementStatus || p.settlement_status || '').toUpperCase() === 'PENDING').reduce((sum, p) => sum + Number(p.cafeAmount || p.amount || 0), 0);
  const settledAmount = revenue.settled_amount ?? rawPayments.filter(p => ['SETTLED', 'COMPLETED', 'SUCCESS'].includes(String(p.settlementStatus || p.settlement_status || '').toUpperCase())).reduce((sum, p) => sum + Number(p.cafeAmount || p.amount || 0), 0);
  const refundAmount = revenue.refund_amount ?? rawPayments.filter(p => ['REFUNDED', 'PARTIALLY_REFUNDED'].includes(String(p.status || p.paymentStatus || '').toUpperCase())).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const handleExportCSV = () => {
    let csv = 'Booking ID,Customer Name,Booking Date,Gross Amount,Cafe Net Amount,Payment Status,Settlement Status,Payment Date\n';
    
    if (payments && payments.length > 0) {
      payments.forEach(p => {
        const id = p.bookingId || p.booking_id || 'N/A';
        const name = p.customerName || p.customer_name || 'Guest';
        const date = p.booking_date || p.bookingDate || p.date ? format(new Date(p.booking_date || p.bookingDate || p.date), 'yyyy-MM-dd') : 'N/A';
        const gross = p.bookingAmount || p.amount || 0;
        const net = p.cafeAmount || p.amount || 0;
        const status = p.paymentStatus || p.status || 'Paid';
        const settlement = p.settlementStatus || p.settlement_status || 'Pending';
        const pDate = p.payment_date || p.paymentDate || p.date ? format(new Date(p.payment_date || p.paymentDate || p.date), 'yyyy-MM-dd') : 'N/A';

        csv += `"${id}","${name}","${date}","${gross}","${net}","${status}","${settlement}","${pDate}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_payments_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const uppercaseStatus = String(status || '').toUpperCase();
    if (['PAID', 'SETTLED', 'COMPLETED', 'SUCCESS'].includes(uppercaseStatus)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> {status}
        </span>
      );
    }
    if (uppercaseStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-700 border border-amber-500/30">
          <Clock className="w-3 h-3" /> {status}
        </span>
      );
    }
    if (uppercaseStatus === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-700 border border-blue-500/30">
          <RefreshCw className="w-3 h-3 animate-spin" /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-700 border border-rose-500/30">
        <XCircle className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FINANCIAL & SETTLEMENT STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Payments & Finances
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Track Razorpay customer booking payments, platform fee adjustments, and net cafe bank split settlements.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <button 
            type="button"
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-2xl bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892] text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <Link href="/owner/payments/account">
            <button 
              type="button"
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Payment Account</span>
            </button>
          </Link>

          <Link href="/owner/payments/settlements">
            <button 
              type="button"
              className="py-2.5 px-4 rounded-2xl bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892] text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Settlements</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Date Filter Toolbar */}
      <div className="bg-white p-3 px-5 rounded-3xl border border-border/60 shadow-2xs flex items-center justify-between overflow-x-auto custom-scrollbar">
        <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider shrink-0 mr-4">Filter Period:</span>
        <div className="flex items-center gap-2">
          {[
            { id: 'TODAY', label: 'Today' },
            { id: '7_DAYS', label: '7 Days' },
            { id: '30_DAYS', label: '30 Days' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'CUSTOM', label: 'Custom' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDateFilter(item.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-2xl text-xs font-extrabold transition-all shrink-0",
                dateFilter === item.id 
                  ? "bg-[#6F4E37] text-white shadow-2xs" 
                  : "bg-surface/50 text-[#2C1810] hover:bg-surface"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Dynamic Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Total Booking Value */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Total Booking Value</span>
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#2C1810]">
              ₹{Number(totalBookingValue).toLocaleString()}
            </p>
            <p className="text-[10px] text-text/50 font-medium mt-0.5">Gross customer payments</p>
          </div>
        </div>

        {/* Your Earnings */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider">Your Net Earnings</span>
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#6F4E37]">
              ₹{Number(yourEarnings).toLocaleString()}
            </p>
            <p className="text-[10px] text-text/50 font-medium mt-0.5">After platform adjustments</p>
          </div>
        </div>

        {/* Pending Settlement */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Settlement</span>
          <div>
            <p className="text-xl sm:text-2xl font-black text-amber-700">
              ₹{Number(pendingSettlement).toLocaleString()}
            </p>
            <p className="text-[10px] text-amber-700/70 font-medium mt-0.5">Razorpay split pending</p>
          </div>
        </div>

        {/* Settled Amount */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Settled Amount</span>
          <div>
            <p className="text-xl sm:text-2xl font-black text-emerald-700">
              ₹{Number(settledAmount).toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-700/70 font-medium mt-0.5">Transferred to bank</p>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] sm:text-xs font-extrabold text-rose-700 uppercase tracking-wider">Refund Amount</span>
          <div>
            <p className="text-xl sm:text-2xl font-black text-rose-700">
              ₹{Number(refundAmount).toLocaleString()}
            </p>
            <p className="text-[10px] text-rose-700/70 font-medium mt-0.5">Customer adjustments</p>
          </div>
        </div>

      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
              <Search className="h-4 w-4" />
            </div>
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
              placeholder="Search transaction ID, booking ID, diner name..." 
            />
          </div>

          <div className="flex items-center gap-3">
            <PaymentFilters filters={filters} setFilters={setFilters} />
            
            <button 
              onClick={() => refetch()}
              className="w-10 h-10 rounded-2xl border border-border/60 bg-surface/40 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all shrink-0"
              title="Refresh Payments"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Interactive Payment Table */}
      {isLoading ? (
        <LoadingSkeleton type="table" />
      ) : isError ? (
        <div className="bg-rose-500/10 text-rose-700 p-6 rounded-3xl border border-rose-500/20 text-center text-xs">
          <p className="font-extrabold text-sm mb-1">Unable to Load Payment Transactions</p>
          <p>{error?.message || 'Please check backend connection and retry.'}</p>
        </div>
      ) : payments.length === 0 ? (
        <EmptyPaymentState 
          showClear={Boolean(search || dateFilter !== '30_DAYS')}
          onClear={() => {
            setSearch('');
            setDateFilter('30_DAYS');
          }}
        />
      ) : (
        <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer Diner</th>
                  <th className="px-6 py-4">Booking Date</th>
                  <th className="px-6 py-4 text-right">Cafe Net Amount</th>
                  <th className="px-6 py-4 text-center">Payment Status</th>
                  <th className="px-6 py-4 text-center">Settlement Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {payments.map((p) => {
                  const bookingId = p.bookingId || p.booking_id || 'N/A';
                  const customerName = p.customerName || p.customer_name || 'Guest Diner';
                  const cafeAmount = Number(p.cafeAmount || p.amount || 0);
                  const paymentStatus = p.paymentStatus || p.status || 'Paid';
                  const settlementStatus = p.settlementStatus || p.settlement_status || 'Pending';

                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedPayment(p)}
                      className="hover:bg-surface/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono font-extrabold text-[#2C1810]">
                        {bookingId}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-[#2C1810]">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 text-text/60">
                        {p.booking_date || p.bookingDate || p.date ? format(new Date(p.booking_date || p.bookingDate || p.date), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#6F4E37] text-sm">
                        ₹{cafeAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(paymentStatus)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(settlementStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white transition-all inline-flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Payment Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/60 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white h-[90vh] sm:h-full max-h-[92vh] sm:max-h-none rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between text-[#2C1810]"
            >
              <div>
                {/* Mobile Drawer Touch Handle */}
                <div className="sm:hidden w-12 h-1 rounded-full bg-border/80 mx-auto mb-3 shrink-0" />

                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-border/50 mb-5 gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#2C1810]">Payment Details</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-text/50 font-mono truncate max-w-[180px] sm:max-w-[240px]">
                        ID: {selectedPayment.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPayment.id);
                          toast.success('Payment ID copied!');
                        }}
                        className="p-1 rounded-lg hover:bg-surface text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer"
                        title="Copy Payment ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedPayment(null)}
                    className="w-9 h-9 rounded-2xl bg-surface/50 hover:bg-[#6F4E37] text-text/60 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Statuses Header */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1.5">Payment Status</span>
                      {getStatusBadge(selectedPayment.paymentStatus || selectedPayment.status)}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1.5">Settlement Status</span>
                      {getStatusBadge(selectedPayment.settlementStatus || selectedPayment.settlement_status || 'Pending')}
                    </div>
                  </div>

                  {/* Financial Breakdown Section */}
                  <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-border/60 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6F4E37] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>Razorpay Split Breakdown</span>
                      </h4>
                      <span className="text-[10px] font-bold text-[#6F4E37] bg-[#6F4E37]/10 px-2 py-0.5 rounded-full">
                        T+1 Split
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="text-text/70">Customer Total Paid</span>
                      <span className="font-extrabold text-[#2C1810]">
                        ₹{Number(selectedPayment.bookingAmount || selectedPayment.amount || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 text-rose-600">
                      <span className="text-text/70">Fahara Platform Fee Adjustment</span>
                      <span className="font-bold">
                        -₹{Number(selectedPayment.faharaFee || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2.5 font-black text-[#6F4E37] border-t border-border/40 pt-2.5 mt-1 bg-[#FFF8F0]/60 p-2.5 rounded-xl">
                      <span>Final Cafe Settlement Amount</span>
                      <span className="text-base font-black text-[#6F4E37]">
                        ₹{Number(selectedPayment.cafeAmount || selectedPayment.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Metadata Card List */}
                  <div className="space-y-2.5 text-xs bg-surface/30 p-4 rounded-2xl border border-border/50">
                    
                    {/* Booking ID */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Booking ID</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono font-extrabold text-[#2C1810] truncate max-w-[170px] sm:max-w-[220px]">
                          {selectedPayment.bookingId || selectedPayment.booking_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedPayment.bookingId || selectedPayment.booking_id);
                            toast.success('Booking ID copied!');
                          }}
                          className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                          title="Copy Booking ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Diner */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Customer Diner</span>
                      <span className="font-bold text-[#2C1810] truncate">
                        {selectedPayment.customerName || selectedPayment.customer_name || 'Guest'}
                      </span>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Payment Method</span>
                      <span className="font-bold text-[#2C1810] truncate">
                        {selectedPayment.paymentMethod || selectedPayment.method || 'UPI / Razorpay Gateway'}
                      </span>
                    </div>

                    {/* Razorpay Reference */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Razorpay Reference</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono text-xs text-[#6F4E37] font-bold truncate max-w-[160px] sm:max-w-[200px]">
                          {selectedPayment.razorpayRef || selectedPayment.cashfreeRef || selectedPayment.cashfree_reference || selectedPayment.razorpay_reference || 'RZP_SPLIT_SETTLED'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedPayment.razorpayRef || selectedPayment.cashfreeRef || selectedPayment.cashfree_reference || selectedPayment.razorpay_reference || 'RZP_SPLIT_SETTLED');
                            toast.success('Razorpay Ref copied!');
                          }}
                          className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                          title="Copy Razorpay Reference"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Payment Date */}
                    <div className="flex items-center justify-between py-1.5 gap-2">
                      <span className="text-text/60 shrink-0">Payment Date</span>
                      <span className="font-medium text-[#2C1810] text-right truncate">
                        {selectedPayment.paymentDate || selectedPayment.date ? format(new Date(selectedPayment.paymentDate || selectedPayment.date), 'MMMM dd, yyyy · hh:mm a') : 'N/A'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Drawer Footer Action */}
              <div className="pt-5 border-t border-border/50 mt-6 shrink-0">
                <Button 
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:opacity-95 text-white font-extrabold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer" 
                  onClick={() => setSelectedPayment(null)}
                >
                  Close Payment Panel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
