'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  UtensilsCrossed, 
  Bike, 
  XCircle, 
  Sparkles,
  Calendar,
  IndianRupee,
  AlertCircle,
  Copy,
  Receipt,
  Gift,
  ChefHat,
  ArrowRight,
  ShieldCheck,
  Check,
  Radio,
  Compass
} from 'lucide-react';
import { foodOrderService } from '@/services/foodOrder.service';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerOrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ['cafe-order-detail', id],
    queryFn: () => foodOrderService.getOrderById(id),
    enabled: !!id
  });

  const order = orderData?.data || orderData;

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => foodOrderService.updateOrderStatus(orderId, status),
    onSuccess: (res, vars) => {
      toast.success(`Order updated to ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ['cafe-order-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['cafe-orders'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  });

  const copyToClipboard = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 w-36 bg-surface/80 rounded-2xl" />
          <div className="h-8 w-28 bg-surface/80 rounded-full" />
        </div>
        <div className="h-44 bg-surface/80 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-surface/80 rounded-3xl" />
          <div className="h-96 bg-surface/80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push('/owner/orders')} className="-ml-3">
          <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Orders
        </Button>
        <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-950">Order Not Found</h2>
            <p className="text-sm text-rose-700/80 mt-1">The requested food order could not be loaded or may belong to another venue.</p>
          </div>
          <Button onClick={() => router.push('/owner/orders')} className="bg-[#E50914] text-white hover:bg-[#c90711] rounded-2xl px-6">
            Return to Orders List
          </Button>
        </div>
      </div>
    );
  }

  // Items support both order_items and food_order_items shapes
  const items = order.order_items || order.food_order_items || order.items || [];
  const appliedOffers = Array.isArray(order.applied_offers) ? order.applied_offers : [];

  const statusConfig = {
    NEW: { label: 'New Order', color: 'bg-amber-500/10 text-amber-700 border-amber-500/30' },
    ACCEPTED: { label: 'Accepted', color: 'bg-blue-500/10 text-blue-700 border-blue-500/30' },
    PREPARING: { label: 'Preparing in Kitchen', color: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30' },
    READY_FOR_PICKUP: { label: 'Ready for Pickup', color: 'bg-purple-500/10 text-purple-700 border-purple-500/30' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30' },
    COMPLETED: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' },
    CANCELLED: { label: 'Cancelled', color: 'bg-rose-500/10 text-rose-700 border-rose-500/30' },
  };

  const netFoodRevenue = Math.max(0, Number(order.subtotal || 0) - Number(order.discount_amount || 0));

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6 text-[#252525]">
      {/* ── TOP HEADER / BREADCRUMB ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/owner/orders')} 
          className="-ml-2 hover:bg-surface/80 rounded-2xl text-text/70 hover:text-[#252525]"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Orders
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider border shadow-2xs ${statusConfig[order.order_status]?.color || 'bg-surface text-text/70 border-border'}`}>
            {statusConfig[order.order_status]?.label || order.order_status}
          </span>
          <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 shadow-2xs">
            Payment {order.payment_status || 'PAID'}
          </span>
        </div>
      </div>

      {/* ── MAIN ORDER HERO CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-border/70 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-border/40">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#E50914]/10 via-[#E50914]/5 to-transparent text-[#E50914] flex items-center justify-center font-black shrink-0 border border-[#EF5350]/20 shadow-2xs">
              <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-[#252525] tracking-tight break-all">
                  Order #{order.order_number}
                </h1>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.order_number, 'Order number')}
                  className="p-1 rounded-lg text-text/40 hover:text-[#E50914] hover:bg-surface transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black uppercase bg-[#FFF5F5] text-[#E50914] border border-[#EF5350]/30 shrink-0">
                  {order.order_type || 'TAKEAWAY'}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 text-xs text-text/60 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text/40 shrink-0" />
                  {order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                </span>
                {order.pickup_time && (
                  <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold shrink-0">
                    <Clock className="w-3.5 h-3.5 shrink-0" /> {order.pickup_time}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Progression Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {order.order_status === 'NEW' && (
              <Button
                onClick={() => statusMutation.mutate({ orderId: order.id, status: 'ACCEPTED' })}
                disabled={statusMutation.isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold px-5 py-2.5 shadow-2xs"
              >
                Accept Order
              </Button>
            )}

            {['NEW', 'ACCEPTED'].includes(order.order_status) && (
              <Button
                onClick={() => statusMutation.mutate({ orderId: order.id, status: 'PREPARING' })}
                disabled={statusMutation.isPending}
                className="w-full sm:w-auto bg-[#E50914] hover:bg-[#c90711] text-white rounded-2xl text-xs font-bold px-5 py-2.5 shadow-2xs flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4" /> Start Preparing
              </Button>
            )}

            {order.order_status === 'PREPARING' && (
              <Button
                onClick={() => statusMutation.mutate({ orderId: order.id, status: 'READY_FOR_PICKUP' })}
                disabled={statusMutation.isPending}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold px-5 py-2.5 shadow-2xs"
              >
                Mark Ready for Pickup
              </Button>
            )}

            {['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(order.order_status) && (
              <Button
                onClick={() => statusMutation.mutate({ orderId: order.id, status: 'COMPLETED' })}
                disabled={statusMutation.isPending}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold px-5 py-2.5 shadow-2xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Order
              </Button>
            )}
          </div>
        </div>

        {/* Status Tracker Bar */}
        <div className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
          <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'].includes(order.order_status) ? 'bg-[#FFF5F5]/70 border-[#EF5350]/40' : 'bg-surface/30 border-border/40 opacity-50'}`}>
            <span className="text-[10px] font-black uppercase text-[#E50914] block mb-0.5">1. Received</span>
            <p className="font-extrabold text-[#252525] text-xs sm:text-sm">Order Placed</p>
          </div>
          <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'].includes(order.order_status) ? 'bg-[#FFF5F5]/70 border-[#EF5350]/40' : 'bg-surface/30 border-border/40 opacity-50'}`}>
            <span className="text-[10px] font-black uppercase text-[#E50914] block mb-0.5">2. Kitchen</span>
            <p className="font-extrabold text-[#252525] text-xs sm:text-sm">Preparation</p>
          </div>
          <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED'].includes(order.order_status) ? 'bg-[#FFF5F5]/70 border-[#EF5350]/40' : 'bg-surface/30 border-border/40 opacity-50'}`}>
            <span className="text-[10px] font-black uppercase text-[#E50914] block mb-0.5">3. Handover</span>
            <p className="font-extrabold text-[#252525] text-xs sm:text-sm">Ready for Pickup</p>
          </div>
          <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${order.order_status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-300' : 'bg-surface/30 border-border/40 opacity-50'}`}>
            <span className="text-[10px] font-black uppercase text-emerald-700 block mb-0.5">4. Completed</span>
            <p className="font-extrabold text-[#252525] text-xs sm:text-sm">Fulfilled</p>
          </div>
        </div>
      </motion.div>

      {/* ── PROMOTIONAL / BOGO BANNER IF ACTIVE ── */}
      {appliedOffers.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-orange-300/80 rounded-3xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#E50914] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                <Gift className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-orange-950">
                  {appliedOffers[0]?.title || 'Promotional Offer Applied'}
                </h3>
                <p className="text-[11px] text-orange-900/80 font-medium">
                  {appliedOffers[0]?.description || 'Buy 1 Get 1 Free Promo'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
              Offer Active
            </span>
          </div>

          <div className="p-3 bg-white/90 rounded-2xl border border-orange-200/80 text-xs text-orange-950 flex items-center justify-between">
            <span>Kitchen Preparation Target:</span>
            <span className="font-black text-sm text-[#E50914]">
              {appliedOffers[0]?.totalKitchenQuantity || 2} UNITS TOTAL
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Detailed Ordered Items Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-border/70 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#E50914] flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Ordered Food Items ({items.length})</span>
              </h2>
              <span className="text-xs font-bold text-text/50">
                Total Subtotal: ₹{Number(order.subtotal || 0).toFixed(2)}
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {items.length === 0 ? (
                <div className="py-8 text-center text-text/50 space-y-2">
                  <UtensilsCrossed className="w-8 h-8 mx-auto text-text/30" />
                  <p className="text-xs">No food items found in this order.</p>
                </div>
              ) : (
                items.map((item, idx) => {
                  const name = item.item_name_snapshot || item.menu_item?.name || item.name || 'Food Item';
                  const img = item.item_image_snapshot || item.menu_item?.image_url;
                  const qty = Number(item.quantity || 1);
                  const unitPrice = Number(item.final_unit_price || item.unit_price_snapshot || item.price_per_item || item.price || 0);
                  const lineTotal = Number(item.line_total || (qty * unitPrice) || 0);

                  return (
                    <div key={item.id || idx} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {img ? (
                          <img 
                            src={img} 
                            alt={name} 
                            className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-border/60 shadow-2xs" 
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center shrink-0 text-text/40 border border-border/40">
                            <UtensilsCrossed className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#252525] truncate">
                            {name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-text/50 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-surface text-[#252525] font-extrabold text-[11px]">
                              {qty} × ₹{unitPrice.toFixed(2)}
                            </span>
                            {item.discount_snapshot > 0 && (
                              <span className="text-emerald-600 font-bold text-[11px]">
                                Discount: -₹{Number(item.discount_snapshot).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#252525]">
                          ₹{lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cancellation Notice if Cancelled */}
          {order.order_status === 'CANCELLED' && (
            <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 space-y-2 text-xs text-rose-950">
              <span className="font-black uppercase tracking-wider text-[11px] block text-rose-700">Order Cancellation Notice</span>
              <p>Reason: <strong className="text-rose-900">{order.cancellation_reason || 'Cancelled by customer'}</strong></p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Details & Clean Earning Card */}
        <div className="space-y-6">
          
          {/* Customer Diner Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-text/50">Customer Diner</h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center shrink-0 font-bold border border-[#EF5350]/20">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-text/40">Diner Name</p>
                  <p className="text-sm font-black text-[#252525] truncate">{order.customer_name || 'Guest Diner'}</p>
                </div>
              </div>

              {order.customer_phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 font-bold border border-emerald-500/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-text/40">Phone Number</p>
                    <p className="text-sm font-black text-[#252525]">{order.customer_phone}</p>
                  </div>
                </div>
              )}

              {order.order_type === 'DELIVERY' && order.fulfilment_address && (
                <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center shrink-0 text-text/60 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-text/40">Delivery Destination</p>
                    <p className="text-xs font-medium text-[#252525] leading-relaxed mt-0.5">
                      {typeof order.fulfilment_address === 'object' 
                        ? `${order.fulfilment_address.addressLine || ''}, ${order.fulfilment_address.city || ''}` 
                        : order.fulfilment_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Delivery Driver Details Card */}
          {order.order_type === 'DELIVERY' && order.assigned_delivery_employee && (
            <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-[#E50914]" />
                  <span>Assigned Delivery Partner</span>
                </h3>
                {order.deliveryLocation ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                    Live GPS
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-text/50 bg-surface">
                    No GPS Ping
                  </span>
                )}
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center font-bold border border-[#EF5350]/20">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#252525]">{order.assigned_delivery_employee.name}</p>
                      <span className="text-[10px] font-bold text-text/50 uppercase">
                        Vehicle: {order.assigned_delivery_employee.vehicleType || 'Bike'} ({order.assigned_delivery_employee.vehicleNumber || 'Standard'})
                      </span>
                    </div>
                  </div>

                  {order.assigned_delivery_employee.phone && (
                    <a
                      href={`tel:${order.assigned_delivery_employee.phone}`}
                      className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                      title="Call Delivery Partner"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {order.deliveryLocation && (
                  <div className="pt-3 border-t border-border/40 text-xs space-y-1.5 bg-[#FFF5F5]/60 p-3 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-text/60">Last Known GPS Ping</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        {order.deliveryLocation.recordedAt ? new Date(order.deliveryLocation.recordedAt).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text/70 font-mono text-[11px]">
                      <Compass className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>{Number(order.deliveryLocation.latitude).toFixed(5)}, {Number(order.deliveryLocation.longitude).toFixed(5)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Restaurant Net Earnings Card (Clean - Platform fee/GST excluded) */}
          <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Restaurant Net Earnings</span>
            </h3>

            <div className="space-y-2.5 text-xs py-1">
              <div className="flex justify-between items-center text-text/70">
                <span>Food Subtotal</span>
                <span className="font-extrabold text-[#252525]">₹{Number(order.subtotal || 0).toFixed(2)}</span>
              </div>

              {Number(order.discount_amount || 0) > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-bold">
                  <span>Discounts Deducted</span>
                  <span>-₹{Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}

              {Number(order.delivery_charge || 0) > 0 && (
                <div className="flex justify-between items-center text-text/70">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-[#252525]">₹{Number(order.delivery_charge).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3.5 border-t border-border/50 flex justify-between items-center bg-[#FFF5F5]/60 p-3.5 rounded-2xl">
              <div>
                <span className="text-xs font-black text-[#252525] block">Your Net Earning</span>
                <span className="text-[10px] text-text/50 font-medium">To be settled directly to bank</span>
              </div>
              <span className="text-2xl font-black text-[#E50914]">
                ₹{netFoodRevenue.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
