'use client';
import React, { useState } from 'react';
import { useRefunds } from '@/hooks/payment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  FileSpreadsheet,
  ArrowDownLeft,
  Info,
  Sparkles,
  Download,
  ArrowLeft,
  RotateCcw,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export default function RefundsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, isLoading, refetch } = useRefunds({ search, status: statusFilter });
  const refunds = data?.data || [];

  const filteredRefunds = refunds.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      (r.bookingId || r.booking_id || '').toLowerCase().includes(searchLower) ||
      (r.customer || r.customer_name || '').toLowerCase().includes(searchLower) ||
      (r.reason || '').toLowerCase().includes(searchLower) ||
      (r.id || '').toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'ALL' || (r.status || r.refund_status)?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic refund metrics
  const totalRefunded = refunds.filter(r => (r.status || r.refund_status) === 'Refunded').reduce((sum, r) => sum + Number(r.refundAmount || r.refund_amount || 0), 0);
  const pendingRefunds = refunds.filter(r => ['Pending', 'Refund Pending'].includes(r.status || r.refund_status)).reduce((sum, r) => sum + Number(r.refundAmount || r.refund_amount || 0), 0);
  const processedCount = refunds.filter(r => (r.status || r.refund_status) === 'Refunded').length;
  const failedCount = refunds.filter(r => (r.status || r.refund_status) === 'Failed').length;

  const handleExportCSV = () => {
    let csv = 'Booking ID,Customer Name,Refund Amount,Reason,Status,Date\n';
    if (refunds && refunds.length > 0) {
      refunds.forEach(r => {
        csv += `"${r.bookingId || r.booking_id || ''}","${r.customer || r.customer_name || ''}","${r.refundAmount || r.refund_amount || 0}","${(r.reason || '').replace(/"/g, '""')}","${r.status || r.refund_status || ''}","${r.date ? format(new Date(r.date), 'yyyy-MM-dd') : ''}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_refunds_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Refunded
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-700 border border-blue-500/30">
            <RefreshCw className="w-3 h-3 animate-spin" /> Processing
          </span>
        );
      case 'Refund Pending':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-700 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Refund Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-700 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return <span className="text-[10px] font-bold text-text/60">{status || 'Pending'}</span>;
    }
  };

  const statusTabs = [
    { id: 'ALL', label: 'All Refunds', count: refunds.length },
    { id: 'Refunded', label: 'Completed Refund', count: processedCount },
    { id: 'Refund Pending', label: 'Pending Request', count: refunds.filter(r => ['Pending', 'Refund Pending'].includes(r.status || r.refund_status)).length },
    { id: 'Processing', label: 'Processing', count: refunds.filter(r => (r.status || r.refund_status) === 'Processing').length },
    { id: 'Failed', label: 'Failed / Rejected', count: failedCount },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/owner/payments')}
              className="px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold flex items-center gap-1 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Payments</span>
            </button>
            <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">• FINANCIAL ADJUSTMENTS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Customer Refunds & Adjustments
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Track customer booking refund activities, cancellation adjustments, and automated Razorpay payout reversals.
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

          <button 
            type="button"
            onClick={() => refetch()}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Sync Razorpay Refunds</span>
          </button>
        </div>
      </div>

      {/* 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Refunded */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-rose-700 uppercase tracking-wider">Total Refunded</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-rose-700">₹{totalRefunded.toLocaleString()}</p>
          <p className="text-[10px] text-rose-700/70 font-medium">{processedCount} Completed refunds</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-amber-700">₹{pendingRefunds.toLocaleString()}</p>
          <p className="text-[10px] text-amber-700/70 font-medium">Awaiting processing</p>
        </div>

        {/* Processed Count */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Processed Adjustments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{processedCount}</p>
          <p className="text-[10px] text-emerald-700/70 font-bold">Successful refunds</p>
        </div>

        {/* Failed / Rejected */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-text/50 uppercase tracking-wider">Failed / Rejected</span>
            <div className="w-8 h-8 rounded-xl bg-surface/60 text-text/50 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-[#2C1810]">{failedCount}</p>
          <p className="text-[10px] text-text/50 font-medium">Rejected claims</p>
        </div>

      </div>

      {/* Security & API Policy Reminder */}
      <div className="p-4 rounded-3xl bg-[#FFF8F0] border border-[#DDB892]/50 text-[#2C1810] flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold text-[#6F4E37] block mb-0.5">Automated Backend Refund Protocol</span>
          All customer refunds are initiated and authorized strictly via secure backend Fahara API integrations. The frontend displays confirmed Razorpay gateway adjustment logs to maintain complete financial transparency.
        </div>
      </div>

      {/* Toolbar & Status Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0",
                    isActive
                      ? "bg-[#6F4E37] text-white shadow-2xs"
                      : "bg-surface/50 text-[#2C1810] hover:bg-surface"
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-white/20 text-white" : "bg-white text-[#6F4E37]"
                  )}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
              <Search className="h-4 w-4" />
            </div>
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810] placeholder:text-text/40" 
              placeholder="Search Booking ID, Customer..." 
            />
          </div>

        </div>
      </div>

      {/* Refund Activity Table / Cards */}
      {filteredRefunds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-border/60 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center mx-auto font-bold">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#2C1810]">No Refund Records Found</h3>
          <p className="text-xs text-text/60 max-w-sm mx-auto">
            No customer refund adjustments match your current search and status filters.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer Diner</th>
                  <th className="px-6 py-4 text-right">Refund Amount</th>
                  <th className="px-6 py-4">Cancellation Reason</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Settlement Impact</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredRefunds.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-extrabold text-[#2C1810]">
                      {item.bookingId || item.booking_id}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#2C1810]">
                      {item.customer || item.customer_name || 'Guest Diner'}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-rose-600 text-sm">
                      ₹{Number(item.refundAmount || item.refund_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-text/70 max-w-xs truncate">
                      {item.reason || 'Customer cancellation request'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status || item.refund_status)}
                    </td>
                    <td className="px-6 py-4">
                      {item.settlementAdjustment ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          <ArrowDownLeft className="w-3 h-3" />
                          Settlement Adjustment (-₹{item.adjustmentAmount || item.refundAmount})
                        </span>
                      ) : (
                        <span className="text-[10px] text-text/40 font-bold">No Direct Adjustment</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-text/60">
                      {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
