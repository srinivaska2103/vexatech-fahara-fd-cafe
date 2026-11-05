'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  Bike, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  ChevronRight, 
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  UtensilsCrossed,
  ArrowRight,
  UserCheck,
  Flame,
  Bell,
  Sparkles
} from 'lucide-react';
import { foodOrderService } from '@/services/foodOrder.service';
import ModernDropdown from '@/components/ui/ModernDropdown';
import { toast } from 'react-hot-toast';

export default function CafeOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  // 1. Fetch Orders Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['cafe-order-stats'],
    queryFn: () => foodOrderService.getOrderStats()
  });

  // 2. Fetch Orders List
  const { data: ordersData, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['cafe-orders', statusFilter, typeFilter, searchQuery],
    queryFn: () => foodOrderService.getOrders({
      status: statusFilter,
      orderType: typeFilter,
      search: searchQuery
    })
  });

  // 3. Fetch Delivery Employees for Assignment
  const { data: staffData } = useQuery({
    queryKey: ['cafe-delivery-staff'],
    queryFn: () => foodOrderService.getDeliveryEmployees()
  });

  // 4. Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => foodOrderService.updateOrderStatus(orderId, status),
    onSuccess: (res, vars) => {
      toast.success(`Order updated to ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ['cafe-orders'] });
      queryClient.invalidateQueries({ queryKey: ['cafe-order-stats'] });
      if (selectedOrder?.id === vars.orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: vars.status }));
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  });

  // 5. Assign Driver Mutation
  const assignMutation = useMutation({
    mutationFn: ({ orderId, employeeId }) => foodOrderService.assignDelivery(orderId, employeeId),
    onSuccess: () => {
      toast.success('Delivery staff assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['cafe-orders'] });
      setAssignModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to assign delivery staff');
    }
  });

  const stats = statsData?.data || {
    totalOrders: 0,
    takeawayOrders: 0,
    deliveryOrders: 0,
    newOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    outForDeliveryOrders: 0,
    completedOrders: 0
  };

  const orders = ordersData?.data || [];
  const drivers = staffData?.data || [];

  // Urgent attention: Paid orders that are either NEW or ACCEPTED and awaiting food preparation
  const pendingPrepOrders = orders.filter(
    (o) => o.payment_status === 'PAID' && ['NEW', 'ACCEPTED'].includes(o.order_status)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
              Food Orders Management
            </h1>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            Accept, prepare and dispatch customer takeaway and restaurant-managed delivery orders
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-xs font-bold text-[#252525] rounded-xl cursor-pointer shadow-2xs transition-all w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
          Refresh Orders
        </button>
      </div>

      {/* ── LIVE ACTION BANNER: PAID ORDERS NOTIFICATION & START PREPARATION PROMPT ── */}
      {pendingPrepOrders.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E50914] via-[#D32F2F] to-[#B71C1C] text-white p-4 sm:p-5 shadow-lg shadow-red-500/20 border border-white/20 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-amber-300 animate-pulse">
                <Flame className="w-6 h-6 fill-amber-300" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#E50914] shadow-xs">
                    Action Required
                  </span>
                  <span className="text-xs font-extrabold text-amber-200">
                    Payment Verified &amp; Notification Received
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  {pendingPrepOrders.length} Paid {pendingPrepOrders.length === 1 ? 'Order is' : 'Orders are'} ready for kitchen preparation!
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  Customer payment is confirmed. Click below to start food preparation and update the customer in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {pendingPrepOrders.slice(0, 2).map((order) => (
                <button
                  key={order.id}
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ orderId: order.id, status: 'PREPARING' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#E50914] hover:bg-stone-50 text-xs font-black shadow-md cursor-pointer transition-transform active:scale-95 disabled:opacity-60"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Start Prep #{order.order_number.slice(-4)}</span>
                </button>
              ))}
              {pendingPrepOrders.length > 2 && (
                <span className="text-xs font-bold text-white/80 self-center">
                  +{pendingPrepOrders.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STATS OVERVIEW CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Total', count: stats.totalOrders, color: 'text-stone-800', bg: 'bg-stone-50' },
          { label: 'New', count: stats.newOrders, color: 'text-[#E50914]', bg: 'bg-red-50' },
          { label: 'Preparing', count: stats.preparingOrders, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Ready', count: stats.readyOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Out for Del.', count: stats.outForDeliveryOrders, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Takeaway', count: stats.takeawayOrders, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Delivery', count: stats.deliveryOrders, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Completed', count: stats.completedOrders, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => (
          <div key={idx} className={`p-3 rounded-2xl border border-[#FEE2E2] ${item.bg} text-center`}>
            <span className="text-[10px] font-black text-[#757575] uppercase block truncate">{item.label}</span>
            <span className={`text-xl font-black ${item.color} mt-0.5 block`}>{item.count}</span>
          </div>
        ))}
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number or customer name..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ModernDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'NEW', label: 'New' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'PREPARING', label: 'Preparing' },
              { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
              { value: 'ASSIGNED', label: 'Driver Assigned' },
              { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'REFUND_PENDING', label: 'Refund Pending' },
              { value: 'REFUNDED', label: 'Refunded' }
            ]}
          />

          <ModernDropdown
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'ALL', label: 'All Fulfilments' },
              { value: 'TAKEAWAY', label: 'Takeaway' },
              { value: 'RESTAURANT_DELIVERY', label: 'Restaurant Delivery' }
            ]}
          />
        </div>
      </div>

      {/* ── ORDERS LIST ── */}
      {ordersLoading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-6 h-6 text-[#E50914] animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#757575] font-bold">Loading restaurant orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#FEE2E2] p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-[#252525]">No Food Orders Found</h3>
          <p className="text-xs text-[#757575] max-w-sm mx-auto">
            When customers place takeaway or delivery orders through your menu, they will appear live right here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const isTakeaway = order.order_type === 'TAKEAWAY';

            return (
              <div 
                key={order.id}
                className="bg-white rounded-3xl border border-[#FEE2E2] p-4.5 space-y-3.5 shadow-xs hover:border-[#E50914]/40 transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black text-[#252525] block">{order.order_number}</span>
                    <span className="text-[10px] text-[#757575] font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#E50914]" />
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                    order.order_status === 'NEW' ? 'bg-red-50 text-red-700 border border-red-200' :
                    order.order_status === 'ACCEPTED' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    order.order_status === 'PREPARING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    order.order_status === 'READY_FOR_PICKUP' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    order.order_status === 'OUT_FOR_DELIVERY' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    order.order_status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.order_status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300 font-black' :
                    'bg-stone-100 text-stone-700'
                  }`}>
                    {order.order_status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Cancellation Banner on Card if Cancelled */}
                {order.order_status === 'CANCELLED' && (
                  <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-rose-700 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ORDER CANCELLED</span>
                    </div>
                    {order.cancellation_reason && (
                      <p className="text-[10px] text-rose-800 line-clamp-1">
                        <strong className="text-rose-900">Reason:</strong> {order.cancellation_reason}
                      </p>
                    )}
                    {order.order_cancellations?.[0] && (
                      <div className="text-[10px] text-rose-700 flex items-center justify-between pt-0.5">
                        <span>Status: <strong className="uppercase">{order.order_cancellations[0].status || 'Cancelled'}</strong></span>
                        <span>{new Date(order.order_cancellations[0].created_at || order.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Fulfilment badge & customer */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#FEE2E2]">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 ${
                    isTakeaway ? 'bg-orange-50 text-orange-700' : 'bg-cyan-50 text-cyan-700'
                  }`}>
                    {isTakeaway ? <UtensilsCrossed className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
                    {isTakeaway ? 'Takeaway' : 'Delivery'}
                  </span>
                  <span className="font-bold text-[#252525] truncate">{order.customer_name}</span>
                </div>

                {/* Items Summary */}
                <div className="bg-[#FFF5F5] rounded-2xl p-2.5 space-y-1 text-xs">
                  {order.order_items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] font-bold text-[#252525]">
                      <span className="truncate pr-2">{item.quantity}x {item.item_name_snapshot}</span>
                      <span className="shrink-0 text-stone-600">₹{Number(item.line_total).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-[#FEE2E2] flex justify-between items-center text-xs font-black text-[#252525]">
                    <span>Total Amount</span>
                    <span className="text-[#E50914] text-sm">₹{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Assigned staff if delivery */}
                {!isTakeaway && order.assigned_employee && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <Bike className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[11px] font-black">Driver: {order.assigned_employee.name}</span>
                  </div>
                )}

                {/* Action Buttons based on Status */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-xs font-bold text-[#252525] transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  {order.order_status === 'CANCELLED' && (
                    <span className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black text-center select-none">
                      Cancelled
                    </span>
                  )}

                  {order.order_status === 'NEW' && (
                    <button
                      onClick={() => statusMutation.mutate({ orderId: order.id, status: 'ACCEPTED' })}
                      className="flex-1 py-2 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-xs font-black text-white transition-colors cursor-pointer text-center"
                    >
                      Accept
                    </button>
                  )}

                  {order.order_status === 'ACCEPTED' && (
                    <button
                      onClick={() => statusMutation.mutate({ orderId: order.id, status: 'PREPARING' })}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-black text-white transition-colors cursor-pointer text-center"
                    >
                      Start Prep
                    </button>
                  )}

                  {order.order_status === 'PREPARING' && (
                    <button
                      onClick={() => statusMutation.mutate({ orderId: order.id, status: 'READY_FOR_PICKUP' })}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-black text-white transition-colors cursor-pointer text-center"
                    >
                      Ready
                    </button>
                  )}

                  {order.order_status === 'READY_FOR_PICKUP' && isTakeaway && (
                    <button
                      onClick={() => statusMutation.mutate({ orderId: order.id, status: 'COMPLETED' })}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white transition-colors cursor-pointer text-center"
                    >
                      Handover
                    </button>
                  )}

                  {order.order_status === 'READY_FOR_PICKUP' && !isTakeaway && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setAssignModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-black text-white transition-colors cursor-pointer text-center"
                    >
                      Assign Staff
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── ORDER DETAILS POPUP MODAL ── */}
      {selectedOrder && !assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#FEE2E2] shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-3">
              <div>
                <h3 className="text-base font-black text-[#252525]">{selectedOrder.order_number}</h3>
                <span className="text-[10px] text-[#757575] font-bold">
                  {selectedOrder.order_type === 'TAKEAWAY' ? 'Takeaway / Self Pickup' : 'Restaurant Delivery'}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-xl text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Contact */}
            <div className="bg-[#FFF5F5] rounded-2xl p-3 space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block">Customer Details</span>
              <div className="font-bold text-[#252525] flex justify-between items-center">
                <span>{selectedOrder.customer_name}</span>
                <span className="flex items-center gap-1 text-[#E50914] font-black">
                  <Phone className="w-3 h-3" /> {selectedOrder.customer_phone}
                </span>
              </div>
              {selectedOrder.users?.email && (
                <div className="text-[11px] text-stone-600 font-medium">
                  Email: {selectedOrder.users.email}
                </div>
              )}
              {selectedOrder.fulfilment_address && (
                <div className="text-[11px] text-[#757575] flex items-start gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.fulfilment_address.addressLine}, {selectedOrder.fulfilment_address.city}
                  </span>
                </div>
              )}
            </div>

            {/* Cancellation & Refund Information if Cancelled or Pending Approval */}
            {(selectedOrder.order_status === 'CANCELLED' || selectedOrder.cancellation_reason || selectedOrder.order_cancellations?.length > 0) && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-rose-200 pb-1.5">
                  <span className="font-black text-rose-900 uppercase text-[10px]">Cancellation & Refund Details</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black text-[9px] uppercase">
                    {selectedOrder.order_cancellations?.[0]?.cancellation_status || 'CANCELLED'}
                  </span>
                </div>
                <div className="space-y-1 text-stone-700">
                  <div><strong>Reason:</strong> {selectedOrder.order_cancellations?.[0]?.cancellation_reason || selectedOrder.cancellation_reason || 'Customer requested'}</div>
                  {selectedOrder.order_cancellations?.[0]?.additional_message && (
                    <div><strong>Message:</strong> &ldquo;{selectedOrder.order_cancellations[0].additional_message}&rdquo;</div>
                  )}
                  <div>
                    <strong>Date & Time:</strong> {new Date(selectedOrder.order_cancellations?.[0]?.cancelled_at || selectedOrder.updated_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </div>
                  <div className="pt-1 flex justify-between items-center border-t border-rose-200/60 font-bold">
                    <span>Refund Amount:</span>
                    <span className="font-black text-[#ED0014]">
                      {selectedOrder.payment_status === 'PAID' ? `₹${Number(selectedOrder.total_amount).toFixed(2)}` : '₹0.00 (Unpaid)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>Refund Status:</span>
                    <span className="font-bold uppercase text-emerald-700">
                      {selectedOrder.payment_refunds?.[0]?.refund_status || (selectedOrder.payment_status === 'PAID' ? 'PROCESSING' : 'NOT APPLICABLE')}
                    </span>
                  </div>
                </div>

                {/* Approve/Reject Buttons if Pending Approval */}
                {selectedOrder.order_cancellations?.[0]?.cancellation_status === 'PENDING_APPROVAL' && (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await foodOrderService.approveCancellation(selectedOrder.id);
                          toast.success('Cancellation approved');
                          queryClient.invalidateQueries({ queryKey: ['cafe-orders'] });
                          setSelectedOrder(null);
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Failed to approve');
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors"
                    >
                      Approve Cancellation
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const reason = prompt('Please enter reason for rejecting cancellation:');
                        if (!reason) return;
                        try {
                          await foodOrderService.rejectCancellation(selectedOrder.id, reason);
                          toast.success('Cancellation rejected');
                          queryClient.invalidateQueries({ queryKey: ['cafe-orders'] });
                          setSelectedOrder(null);
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Failed to reject');
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs transition-colors"
                    >
                      Reject Cancellation
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Ordered Items List */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block">Items in Order</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.order_items?.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#FEE2E2]/60">
                    <span className="font-bold text-[#252525]">{i.quantity}x {i.item_name_snapshot}</span>
                    <span className="font-black text-[#252525]">₹{Number(i.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Settlement Snapshot */}
            <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 text-xs border border-stone-200">
              <div className="flex justify-between text-[#757575]">
                <span>Food Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discounts Applied</span>
                  <span>-₹{Number(selectedOrder.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#252525] font-semibold pt-1 border-t border-dashed border-stone-200">
                <span>Net Food Amount</span>
                <span>₹{(Number(selectedOrder.subtotal) - Number(selectedOrder.discount_amount)).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.delivery_charge) > 0 && (
                <div className="flex justify-between text-[#757575]">
                  <span>Delivery Charge</span>
                  <span>+₹{Number(selectedOrder.delivery_charge).toFixed(2)}</span>
                </div>
              )}

              {/* Restaurant Settlement Calculation */}
              <div className="mt-2 pt-2 border-t border-stone-200 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-emerald-900 text-xs uppercase tracking-wider">
                    Restaurant Net Payout:
                  </span>
                  <span className="font-black text-emerald-700 text-base">
                    ₹{((Number(selectedOrder.subtotal) - Number(selectedOrder.discount_amount)) + Number(selectedOrder.delivery_charge)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
                  <span>Settlement Route:</span>
                  <span className="font-bold uppercase text-stone-700">
                    {selectedOrder.payment_status === 'PAID' ? 'Automated Razorpay Route' : 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#252525] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── ASSIGN DELIVERY DRIVER MODAL ── */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-[#252525]">Assign Delivery Staff</h3>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="p-1 rounded-xl text-[#757575] hover:bg-[#FFF5F5]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#757575]">
              Select an available in-house delivery employee for Order <strong>{selectedOrder.order_number}</strong>:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drivers.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No delivery employees registered yet.</p>
              ) : (
                drivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      selectedDriverId === driver.id 
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/20' 
                        : 'border-[#FEE2E2] hover:bg-[#FFF5F5]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-[#252525] block">{driver.name}</span>
                      <span className="text-[10px] text-[#757575] font-bold">
                        {driver.vehicle_type} ({driver.vehicle_number || 'No reg'}) • {driver.phone}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                      driver.availability_status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {driver.availability_status}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#FEE2E2]">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!selectedDriverId || assignMutation.isPending}
                onClick={() => assignMutation.mutate({ orderId: selectedOrder.id, employeeId: selectedDriverId })}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-black text-white cursor-pointer shadow-md disabled:opacity-50"
              >
                {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

