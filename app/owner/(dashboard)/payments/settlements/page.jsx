'use client';
import React, { useState } from 'react';
import { useSettlements, useSyncSettlements } from '@/hooks/payment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowRightLeft, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  IndianRupee,
  ChevronRight,
  X,
  FileSpreadsheet,
  Sparkles,
  Download,
  ArrowUpRight,
  ArrowLeft,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function SettlementsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  const { data, isLoading, refetch } = useSettlements({ search, status: statusFilter, vendor_type: 'CAFE' });
  const { mutate: syncSettlements, isPending: isSyncing } = useSyncSettlements();
  const rawSettlements = (data?.data || []).map(s => {
    const rawSt = s.status || s.settlement_status;
    const isCompleted = ['SETTLED', 'COMPLETED', 'SUCCESS'].includes(String(rawSt || '').toUpperCase());
    const initialStatus = isCompleted ? 'Settled' : (rawSt === 'Processing' ? 'Processing' : 'Pending');
    return {
      ...s,
      status: initialStatus,
      settlement_status: initialStatus,
      tag: isCompleted ? null : (s.tag || 'Date as Expected')
    };
  }).filter(s => 
    (s.vendor_type === 'CAFE' || !s.vendor_type) &&
    s.cashfreeRef !== 'FAHARA_PLATFORM' && 
    s.cashfree_reference !== 'FAHARA_PLATFORM' &&
    s.vendor_type !== 'FAHARA' &&
    s.vendor_type !== 'EVENT_MANAGER' &&
    !['REFUNDED', 'PARTIALLY_REFUNDED', 'REVERSED', 'CANCELLED'].includes(String(s.status || s.settlement_status || '').toUpperCase())
  );

  const seenBookings = new Set();
  const settlements = rawSettlements.filter(s => {
    const bId = s.bookingId || s.booking_id || s.id;
    if (seenBookings.has(bId)) return false;
    seenBookings.add(bId);
    return true;
  });

  const filteredSettlements = settlements.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      (s.bookingId || s.booking_id || '').toLowerCase().includes(searchLower) ||
      (s.cashfreeRef || s.cashfree_reference || '').toLowerCase().includes(searchLower) ||
      (s.id || '').toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'ALL' || (s.status || s.settlement_status)?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate high-level summary metrics
  const totalSettled = settlements.filter(s => ['SETTLED', 'COMPLETED', 'SUCCESS'].includes(String(s.status || s.settlement_status || '').toUpperCase())).reduce((sum, s) => sum + Number(s.amount || s.settled_amount || 0), 0);
  const pendingSettlement = settlements.filter(s => String(s.status || s.settlement_status || '').toUpperCase() === 'PENDING').reduce((sum, s) => sum + Number(s.amount || s.settled_amount || 0), 0);
  const processingSettlement = settlements.filter(s => String(s.status || s.settlement_status || '').toUpperCase() === 'PROCESSING').reduce((sum, s) => sum + Number(s.amount || s.settled_amount || 0), 0);
  const failedSettlement = settlements.filter(s => ['FAILED', 'REVERSED'].includes(String(s.status || s.settlement_status || '').toUpperCase())).reduce((sum, s) => sum + Number(s.amount || s.settled_amount || 0), 0);

  const handleExportCSV = () => {
    let csv = 'Booking ID,Razorpay Reference,Settlement Date,Amount,Status,Tag\n';
    if (settlements && settlements.length > 0) {
      settlements.forEach(s => {
        csv += `"${s.bookingId || s.booking_id || ''}","${s.razorpayRef || s.cashfreeRef || s.cashfree_reference || s.razorpay_reference || ''}","${s.date ? format(new Date(s.date), 'yyyy-MM-dd') : ''}","${s.amount || s.settled_amount || 0}","${s.status || s.settlement_status || ''}","${s.tag || ''}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fahara_settlements_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const getStatusBadge = (status, tag) => {
    const uppercaseStatus = String(status || '').toUpperCase();
    const isCompleted = ['SETTLED', 'COMPLETED', 'SUCCESS'].includes(uppercaseStatus);
    const isProcessing = uppercaseStatus === 'PROCESSING';
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Settled
          </span>
        ) : isProcessing ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-700 border border-blue-500/30">
            <RefreshCw className="w-3 h-3 animate-spin" /> Processing
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-700 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )}

        {!isCompleted && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#6F4E37]/10 text-[#6F4E37] border border-[#DDB892]/60 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 text-[#6F4E37]" /> {tag || 'Date as Expected'}
          </span>
        )}
      </div>
    );
  };

  const statusTabs = [
    { id: 'ALL', label: 'All Settlements', count: settlements.length },
    { id: 'Settled', label: 'Settled to Bank', count: settlements.filter(s => ['SETTLED', 'COMPLETED', 'SUCCESS'].includes(String(s.status || s.settlement_status || '').toUpperCase())).length },
    { id: 'Pending', label: 'Pending Split', count: settlements.filter(s => String(s.status || s.settlement_status || '').toUpperCase() === 'PENDING').length },
    { id: 'Processing', label: 'Processing', count: settlements.filter(s => String(s.status || s.settlement_status || '').toUpperCase() === 'PROCESSING').length },
    { id: 'Failed', label: 'Failed / Hold', count: settlements.filter(s => ['FAILED', 'REVERSED'].includes(String(s.status || s.settlement_status || '').toUpperCase())).length },
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
            <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">• BANK SETTLEMENTS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Bank Payout Settlements
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Track vendor payout transfers directly into your registered bank account.
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
            disabled={isSyncing}
            onClick={() => syncSettlements({ vendor_type: 'CAFE' })}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={cn("w-4 h-4 text-white", isSyncing && "animate-spin")} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Settlements'}</span>
          </button>
        </div>
      </div>

      {/* 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Settled */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Total Settled</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-emerald-700">₹{totalSettled.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-700/70 font-medium">Transferred to bank</p>
        </div>

        {/* Pending Settlement */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Settlement</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-amber-700">₹{pendingSettlement.toLocaleString()}</p>
          <p className="text-[10px] text-amber-700/70 font-medium">Split settlement pending</p>
        </div>

        {/* Processing */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-wider">Processing Queue</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-blue-700">₹{processingSettlement.toLocaleString()}</p>
          <p className="text-[10px] text-text/50 font-medium">Active bank transfers</p>
        </div>

        {/* Failed / Reversed */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border/60 shadow-2xs hover:shadow-xs transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold text-rose-700 uppercase tracking-wider">Failed / Reversed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-rose-700">₹{failedSettlement.toLocaleString()}</p>
          <p className="text-[10px] text-rose-700/70 font-medium">Hold or returned funds</p>
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
              placeholder="Search Booking ID, Reference..." 
            />
          </div>

        </div>
      </div>

      {/* Settlement Table / Cards */}
      {filteredSettlements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-border/60 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mx-auto font-bold">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#2C1810]">No Settlement Records Found</h3>
          <p className="text-xs text-text/60 max-w-sm mx-auto">
            No bank split settlement entries match your current search and status filters.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden bg-white border border-border/60 rounded-3xl shadow-2xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[11px] font-extrabold uppercase bg-surface/50 text-[#6F4E37] border-b border-border/50 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Settlement Date</th>
                  <th className="px-6 py-4 text-right">Net Cafe Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Reference ID</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredSettlements.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedSettlement(item)}
                    className="hover:bg-surface/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-extrabold text-[#2C1810]">
                      {item.bookingId || item.booking_id}
                    </td>
                    <td className="px-6 py-4 text-text/60">
                      {item.date ? format(new Date(item.date), 'MMM dd, yyyy · hh:mm a') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[#6F4E37] text-sm">
                      ₹{Number(item.amount || item.settled_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status || item.settlement_status, item.tag)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#6F4E37] font-bold">
                      {item.razorpayRef || item.cashfreeRef || item.cashfree_reference || item.razorpay_reference || 'RZP_SPLIT_REF'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white transition-all inline-flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settlement Detail Drawer */}
      <AnimatePresence>
        {selectedSettlement && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/60 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setSelectedSettlement(null)}
          >
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white h-[88vh] sm:h-full max-h-[90vh] sm:max-h-none rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between text-[#2C1810]"
            >
              <div>
                {/* Mobile Drawer Touch Handle */}
                <div className="sm:hidden w-12 h-1 rounded-full bg-border/80 mx-auto mb-3 shrink-0" />

                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-border/50 mb-5 gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#2C1810]">Settlement Details</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-text/50 font-mono truncate max-w-[170px] sm:max-w-[220px]">
                        ID: {selectedSettlement.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedSettlement.id);
                          toast.success('Settlement ID copied!');
                        }}
                        className="p-1 rounded-lg hover:bg-surface text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer"
                        title="Copy Settlement ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedSettlement(null)}
                    className="w-9 h-9 rounded-2xl bg-surface/50 hover:bg-[#6F4E37] text-text/60 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Payout Overview Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1">Status</span>
                      {getStatusBadge(selectedSettlement.status || selectedSettlement.settlement_status, selectedSettlement.tag)}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1">Net Cafe Split</span>
                      <span className="text-xl font-black text-[#6F4E37]">
                        ₹{Number(selectedSettlement.amount || selectedSettlement.settled_amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Metadata List Container */}
                  <div className="space-y-2.5 text-xs bg-surface/30 p-4 rounded-2xl border border-border/50">
                    
                    {/* Booking ID */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Booking ID</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono font-extrabold text-[#2C1810] truncate max-w-[160px] sm:max-w-[200px]">
                          {selectedSettlement.bookingId || selectedSettlement.booking_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedSettlement.bookingId || selectedSettlement.booking_id);
                            toast.success('Booking ID copied!');
                          }}
                          className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                          title="Copy Booking ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Razorpay Reference */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Razorpay Reference</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono font-bold text-[#6F4E37] truncate max-w-[150px] sm:max-w-[190px]">
                          {selectedSettlement.razorpayRef || selectedSettlement.cashfreeRef || selectedSettlement.cashfree_reference || selectedSettlement.razorpay_reference || 'N/A'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedSettlement.razorpayRef || selectedSettlement.cashfreeRef || selectedSettlement.cashfree_reference || selectedSettlement.razorpay_reference || 'N/A');
                            toast.success('Razorpay Ref copied!');
                          }}
                          className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
                          title="Copy Razorpay Reference"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Settlement Date */}
                    <div className="flex items-center justify-between py-1.5 border-b border-border/30 gap-2">
                      <span className="text-text/60 shrink-0">Settlement Date</span>
                      <span className="font-medium text-[#2C1810] text-right truncate">
                        {selectedSettlement.date ? format(new Date(selectedSettlement.date), 'MMMM dd, yyyy · hh:mm a') : 'N/A'}
                      </span>
                    </div>

                    {/* Destination Bank */}
                    <div className="flex items-center justify-between py-1.5 gap-2">
                      <span className="text-text/60 shrink-0">Destination Bank</span>
                      <span className="font-extrabold text-[#2C1810] truncate">
                        Direct Bank Split (Verified Account)
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Drawer Footer Action */}
              <div className="pt-5 border-t border-border/50 mt-6 shrink-0">
                <Button 
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:opacity-95 text-white font-extrabold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer" 
                  onClick={() => setSelectedSettlement(null)}
                >
                  Close Settlement Panel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
