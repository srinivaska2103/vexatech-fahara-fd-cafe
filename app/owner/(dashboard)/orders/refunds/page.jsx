'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodOrderService } from '@/services/foodOrder.service';
import { 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Receipt,
  Store,
  Eye,
  Filter,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  User,
  Phone,
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderRefundsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch refund requests from backend
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['cafe-refund-requests', statusFilter, search],
    queryFn: () => foodOrderService.getRefundRequests({ status: statusFilter, search }),
    staleTime: 1000 * 15,
  });

  const refundRequests = data?.data?.refundRequests || [];
  const metrics = data?.data?.metrics || {};

  // Mutation: Approve refund
  const approveMutation = useMutation({
    mutationFn: (requestId) => foodOrderService.approveRefundRequest(requestId),
    onSuccess: (res) => {
      toast.success(res?.message || 'Refund approved! Gateway processing initiated.');
      queryClient.invalidateQueries({ queryKey: ['cafe-refund-requests'] });
      setSelectedRequest(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to approve refund.');
    }
  });

  // Mutation: Reject refund
  const rejectMutation = useMutation({
    mutationFn: ({ requestId, reason }) => foodOrderService.rejectRefundRequest(requestId, reason),
    onSuccess: (res) => {
      toast.success(res?.message || 'Refund request rejected.');
      queryClient.invalidateQueries({ queryKey: ['cafe-refund-requests'] });
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectReason('');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to reject refund.');
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleApprove = (req) => {
    if (window.confirm(`Approve refund of ₹${req.refundRequestedAmount || req.totalOrderAmount} for Order #${req.orderNumber}? The amount will be automatically returned via the payment gateway.`)) {
      approveMutation.mutate(req.refundRequestId);
    }
  };

  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason for the customer.');
      return;
    }
    rejectMutation.mutate({
      requestId: selectedRequest.refundRequestId,
      reason: rejectReason.trim()
    });
  };

  // Metrics
  const totalRequests = metrics.totalRequests ?? refundRequests.length;
  const pendingRequests = metrics.pendingRequests ?? refundRequests.filter(r => r.refundStatus === 'REQUESTED' || r.canApprove).length;
  const refundedCount = metrics.refundedCount ?? refundRequests.filter(r => r.refundStatus === 'REFUNDED').length;
  const totalRefundedAmount = metrics.totalRefundedAmount ?? refundRequests
    .filter(r => r.refundStatus === 'REFUNDED')
    .reduce((sum, r) => sum + (Number(r.refundRequestedAmount) || 0), 0);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'REFUNDED':
        return {
          label: 'REFUNDED',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2
        };
      case 'APPROVED':
        return {
          label: 'APPROVED',
          className: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: CheckCircle2
        };
      case 'REFUND_PROCESSING':
      case 'PROCESSING':
        return {
          label: 'REFUND PROCESSING',
          className: 'bg-sky-50 text-sky-800 border-sky-200',
          icon: RefreshCw
        };
      case 'REJECTED':
        return {
          label: 'REJECTED',
          className: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: XCircle
        };
      case 'REFUND_FAILED':
      case 'FAILED':
        return {
          label: 'REFUND FAILED',
          className: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: AlertTriangle
        };
      case 'UNDER_REVIEW':
        return {
          label: 'UNDER REVIEW',
          className: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Clock
        };
      case 'REQUESTED':
      default:
        return {
          label: 'REQUESTED',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-20 font-sans">
      {/* ── HEADER & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F8FAFC] text-[#E50914] text-[10px] font-black uppercase tracking-wider border border-[#E2E8F0]">
              Restaurant Operations
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              Gateway Automated
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#252525] tracking-tight mt-1">
            Food Order Refund Requests
          </h1>
          <p className="text-xs text-[#757575] font-semibold mt-0.5">
            Review customer refund requests, approve for automatic payment gateway processing, or decline with customer feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-black text-[#252525] shadow-2xs transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E50914] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* ── METRIC SNAPSHOT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-3.5 sm:p-4.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block truncate">Total Requests</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#252525]">{totalRequests}</span>
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300 shrink-0" />
          </div>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block truncate">All food refund cases</span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-3.5 sm:p-4.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block truncate">Action Required</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600">{pendingRequests}</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block truncate">Pending owner approval</span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-3.5 sm:p-4.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block truncate">Settled Refunds</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">{refundedCount}</span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block truncate">Credited to customer bank</span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-3.5 sm:p-4.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block truncate">Total Refunded Capital</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#E50914]">₹{totalRefundedAmount.toFixed(2)}</span>
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#E50914]/40 shrink-0" />
          </div>
          <span className="text-[10px] text-[#757575] font-semibold mt-1 block truncate">Direct reversal via Route</span>
        </div>
      </div>

      {/* ── SEARCH & STATUS FILTERS ── */}
      <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order Number, Customer Name, Phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#252525] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'REQUESTED', 'APPROVED', 'REJECTED', 'REFUND_PROCESSING', 'REFUNDED', 'REFUND_FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black whitespace-nowrap uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-[#E50914] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#F8FAFC] text-stone-600 border border-stone-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ── REFUND REQUESTS LISTING (Responsive: Cards for Mobile, Table for Desktop) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="py-16 sm:py-20 text-center space-y-3">
            <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 text-[#E50914] animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-bold">Loading refund requests...</p>
          </div>
        ) : refundRequests.length === 0 ? (
          <div className="py-16 sm:py-20 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#E50914]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#252525]">No Refund Requests Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto font-medium">
              There are currently no customer refund requests matching your selected filters.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (< md screens) */}
            <div className="block md:hidden divide-y divide-[#E2E8F0]/60">
              {refundRequests.map((req) => {
                const badge = getStatusBadge(req.refundStatus);
                const BadgeIcon = badge.icon;
                const isActionable = req.canApprove || req.refundStatus === 'REQUESTED';

                return (
                  <div key={req.id} className="p-4 space-y-3 hover:bg-[#F8FAFC]/30 transition-colors">
                    {/* Header Row: Order ID + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-mono font-black text-sm text-[#252525]">
                          #{req.orderNumber}
                        </div>
                        <span className="text-[10px] font-bold text-[#E50914] block">
                          Req: {String(req.refundRequestId).substring(0, 14)}...
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {req.requestDate ? format(new Date(req.requestDate), 'dd MMM yyyy, HH:mm') : 'N/A'}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${badge.className}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC]/50 p-2.5 rounded-xl border border-[#E2E8F0]/60">
                      <div>
                        <span className="text-[9px] font-black uppercase text-stone-400 block">Customer</span>
                        <span className="font-bold text-[#252525] block truncate">{req.customerName}</span>
                        <span className="text-[10px] font-mono text-stone-500">{req.customerPhone}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase text-stone-400 block">Refund / Total</span>
                        <span className="font-black text-[#E50914] block">
                          ₹{Number(req.refundRequestedAmount || req.totalOrderAmount).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          Total ₹{Number(req.totalOrderAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Items & Reason */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-bold truncate">
                          {req.items?.length > 0 
                            ? req.items.map(i => `${i.quantity}x ${i.name}`).join(', ') 
                            : 'Prepared food items'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-100">
                        <span className="font-semibold text-stone-400">Reason: </span>
                        <span className="font-medium text-[#252525]">&ldquo;{req.cancellationReason}&rdquo;</span>
                        {req.rejectionReason && (
                          <p className="text-[10px] text-rose-600 font-bold mt-0.5">
                            Rejected: {req.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-1 flex items-center justify-end gap-2">
                      {isActionable ? (
                        <>
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={approveMutation.isPending}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs transition-all shadow-2xs flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => openRejectModal(req)}
                            disabled={rejectMutation.isPending}
                            className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 active:scale-95 text-rose-600 border border-rose-200 font-black text-xs transition-all shadow-2xs flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-black text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[10px] font-black uppercase tracking-wider text-stone-600 border-b border-[#E2E8F0]">
                    <th className="py-3.5 px-4">Request / Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Ordered Items</th>
                    <th className="py-3.5 px-4">Total / Refund</th>
                    <th className="py-3.5 px-4">Payment & Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/60 text-xs">
                  {refundRequests.map((req) => {
                    const badge = getStatusBadge(req.refundStatus);
                    const BadgeIcon = badge.icon;
                    const isActionable = req.canApprove || req.refundStatus === 'REQUESTED';

                    return (
                      <tr key={req.id} className="hover:bg-[#F8FAFC]/40 transition-colors">
                        {/* Request & Order ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-black text-[#252525] text-xs">
                            #{req.orderNumber}
                          </div>
                          <span className="text-[10px] font-bold text-[#E50914] block">
                            Req ID: {String(req.refundRequestId).substring(0, 14)}...
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {req.requestDate ? format(new Date(req.requestDate), 'dd MMM yyyy, HH:mm') : 'N/A'}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#252525]">{req.customerName}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{req.customerPhone}</div>
                        </td>

                        {/* Ordered Items */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-[180px]">
                            <span className="font-bold text-stone-700 block truncate">
                              {req.items?.length > 0 
                                ? req.items.map(i => `${i.quantity}x ${i.name}`).join(', ') 
                                : 'Prepared food items'}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {req.items?.length || 1} item(s) total
                            </span>
                          </div>
                        </td>

                        {/* Total & Refund Amount */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-[#E50914]">
                            ₹{Number(req.refundRequestedAmount || req.totalOrderAmount).toFixed(2)}
                          </div>
                          <span className="text-[10px] text-stone-400 block">
                            Total: ₹{Number(req.totalOrderAmount).toFixed(2)}
                          </span>
                        </td>

                        {/* Payment Method & Reason */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-700 capitalize">
                            {req.paymentMethod || 'Online'}
                          </div>
                          <p className="text-[11px] text-[#252525] font-medium max-w-[200px] truncate" title={req.cancellationReason}>
                            &ldquo;{req.cancellationReason}&rdquo;
                          </p>
                          {req.rejectionReason && (
                            <p className="text-[10px] text-rose-600 font-bold truncate" title={req.rejectionReason}>
                              Rejected: {req.rejectionReason}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.className}`}>
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                          {req.gatewayRefundId && (
                            <div className="text-[9px] font-mono text-stone-400 mt-1 truncate max-w-[130px]" title={req.gatewayRefundId}>
                              Ref: {req.gatewayRefundId}
                            </div>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isActionable ? (
                              <>
                                <button
                                  onClick={() => handleApprove(req)}
                                  disabled={approveMutation.isPending}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-2xs disabled:opacity-50 flex items-center gap-1"
                                  title="Approve refund and trigger automatic gateway refund"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => openRejectModal(req)}
                                  disabled={rejectMutation.isPending}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-black text-xs transition-colors shadow-2xs disabled:opacity-50 flex items-center gap-1"
                                  title="Reject refund with reason"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── REJECT REASON MODAL ── */}
      <AnimatePresence>
        {isRejectModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#252525]">Reject Refund Request</h3>
                  <span className="text-[11px] font-bold text-stone-500">
                    Order #{selectedRequest.orderNumber} • ₹{Number(selectedRequest.totalOrderAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-stone-700 block">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this refund request is rejected (e.g., Food already prepared and packaged, order handed over to driver)..."
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#252525] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 focus:border-[#E50914]"
                />
                <p className="text-[10px] text-stone-400">
                  This explanation will be recorded on the customer&apos;s refund tracking timeline and sent via notification.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={rejectMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={rejectMutation.isPending || !rejectReason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors shadow-2xs disabled:opacity-50"
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DETAILS MODAL / DRAWER ── */}
      <AnimatePresence>
        {selectedRequest && !isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#E50914] shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#252525]">Refund Request Details</h3>
                    <span className="text-[11px] font-bold text-[#E50914]">
                      Order #{selectedRequest.orderNumber}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-stone-500 block uppercase">Customer</span>
                  <span className="font-black text-[#252525] block mt-0.5 truncate">{selectedRequest.customerName}</span>
                  <span className="text-[10px] text-stone-500">{selectedRequest.customerPhone}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-stone-500 block uppercase">Refund Amount</span>
                  <span className="font-black text-[#E50914] text-base block mt-0.5">
                    ₹{Number(selectedRequest.refundRequestedAmount || selectedRequest.totalOrderAmount).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate block">Method: {selectedRequest.paymentMethod}</span>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs space-y-1">
                <span className="font-black text-amber-900 block uppercase text-[10px]">Cancellation Reason</span>
                <p className="text-amber-800 font-medium">&ldquo;{selectedRequest.cancellationReason}&rdquo;</p>
                {selectedRequest.additionalNotes && (
                  <p className="text-[11px] text-amber-700 italic">Notes: {selectedRequest.additionalNotes}</p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 text-xs">
                <span className="font-black text-stone-700 block uppercase text-[10px]">Ordered Items ({selectedRequest.items?.length || 0})</span>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-3">
                  {selectedRequest.items?.map((item) => (
                    <div key={item.id} className="py-1.5 flex justify-between items-center text-xs">
                      <span className="font-bold text-[#252525]">{item.quantity}x {item.name}</span>
                      <span className="font-black text-stone-700">₹{Number(item.lineTotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions if still actionable */}
              {(selectedRequest.canApprove || selectedRequest.refundStatus === 'REQUESTED') && (
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    disabled={approveMutation.isPending}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-2xs"
                  >
                    Approve Refund (Trigger Gateway)
                  </button>
                  <button
                    onClick={() => openRejectModal(selectedRequest)}
                    disabled={rejectMutation.isPending}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors shadow-2xs"
                  >
                    Reject Refund
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

