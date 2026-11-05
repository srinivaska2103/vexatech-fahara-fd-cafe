'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  RefreshCw, 
  LogOut,
  ShoppingBag,
  AlertCircle,
  PackageCheck,
  Compass,
  User,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function DeliveryStaffPortal() {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ACTIVE');

  // Restore saved session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('g2g_delivery_staff');
      if (saved) {
        setSession(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Fetch assigned orders
  const fetchOrders = async () => {
    if (!session?.employee?.id) return;
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE_URL}/delivery/assigned-orders`, {
        headers: { 'x-employee-id': session.employee.id }
      });
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to refresh deliveries');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !pin.trim()) {
      toast.error('Please enter phone and PIN');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/delivery/login`, {
        phone: phone.trim(),
        pin: pin.trim()
      });

      if (res.data?.success) {
        toast.success(`Welcome back, ${res.data.data.employee.name}!`);
        setSession(res.data.data);
        localStorage.setItem('g2g_delivery_staff', JSON.stringify(res.data.data));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check phone & PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('g2g_delivery_staff');
    setOrders([]);
  };

  // Status transitions
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/delivery/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'x-employee-id': session.employee.id } }
      );

      if (res.data?.success) {
        toast.success(`Order marked as ${newStatus.replace(/_/g, ' ')}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const activeOrders = orders.filter(
    (o) => o.order_status !== 'DELIVERED' && o.order_status !== 'COMPLETED'
  );
  const completedOrders = orders.filter(
    (o) => o.order_status === 'DELIVERED' || o.order_status === 'COMPLETED'
  );

  const displayOrders = activeTab === 'ACTIVE' ? activeOrders : completedOrders;

  // ── VIEW 1: AUTHENTICATION SCREEN ──
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-4 selection:bg-[#E50914] selection:text-white">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#FEE2E2] shadow-2xl shadow-rose-950/10 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-[#E50914] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#E50914]/25">
              <Bike className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#252525] tracking-tight">Driver Partner Portal</h2>
              <p className="text-xs text-[#757575] font-medium mt-0.5">Grab2Go In-house Fleet Management</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1.5">
                Registered Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-[#FFF5F5]/40 border border-[#FEE2E2] rounded-2xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1.5">
                4-Digit Driver Security PIN *
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 bg-[#FFF5F5]/40 border border-[#FEE2E2] rounded-2xl text-xs font-mono font-black text-[#252525] outline-none focus:border-[#E50914] focus:bg-white tracking-widest text-center transition-all shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black rounded-2xl cursor-pointer shadow-lg shadow-[#E50914]/25 transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In to Driver Fleet'}
            </button>
          </form>

          <div className="pt-2 border-t border-[#FEE2E2] text-center">
            <span className="text-[10px] text-[#757575] font-medium">
              Registered by restaurant owner • Default PIN: 1234
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ── VIEW 2: ULTRA-MODERN MOBILE-FIRST CONSOLE ──
  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#252525] pb-24 selection:bg-[#E50914] selection:text-white">
      
      {/* ── TOP MODERN APP BAR ── */}
      <header className="bg-white border-b border-[#FEE2E2] sticky top-0 z-40 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Driver identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#E50914]/20 shrink-0">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-[#252525] leading-none">{session.employee.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-[#757575] font-bold block mt-1">
                {session.cafe.name} • <span className="uppercase text-[#E50914] font-black">{session.employee.vehicleType}</span>
              </span>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] hover:bg-white text-[#252525] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Refresh Deliveries"
            >
              <RefreshCw className={`w-4 h-4 text-[#E50914] ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#E50914] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (MOBILE-OPTIMIZED) ── */}
      <main className="max-w-xl mx-auto px-4 pt-5 space-y-4">
        
        {/* KPI Quick Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl border border-[#FEE2E2] p-4 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575]">Pending Drops</span>
              <span className="text-2xl font-black text-[#E50914] block mt-0.5">{activeOrders.length}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#FEE2E2] p-4 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575]">Delivered</span>
              <span className="text-2xl font-black text-emerald-600 block mt-0.5">{completedOrders.length}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Segmented Brand Tab Switcher */}
        <div className="flex bg-white rounded-2xl p-1 border border-[#FEE2E2] shadow-2xs">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'ACTIVE'
                ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                : 'text-[#757575] hover:text-[#252525]'
            }`}
          >
            Active Deliveries ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'COMPLETED'
                ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                : 'text-[#757575] hover:text-[#252525]'
            }`}
          >
            Completed History ({completedOrders.length})
          </button>
        </div>

        {/* Orders Feed */}
        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#FEE2E2] p-10 text-center space-y-3 shadow-2xs">
            <div className="w-14 h-14 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-[#252525]">
              {activeTab === 'ACTIVE' ? 'All Clear! No Active Deliveries' : 'No Completed Deliveries Yet'}
            </h4>
            <p className="text-xs text-[#757575] max-w-sm mx-auto leading-relaxed">
              {activeTab === 'ACTIVE' 
                ? "You're available and on standby. New delivery assignments from your restaurant will show up here live."
                : 'Once you complete food drop-offs, they will be archived here for your records.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const isCompleted = order.order_status === 'DELIVERED' || order.order_status === 'COMPLETED';

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-4 shadow-sm hover:border-[#E50914]/40 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#FEE2E2] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#252525]">{order.order_number}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] font-mono font-bold">
                          {order.order_items?.length || 0} items
                        </span>
                      </div>
                      <span className="text-[10px] text-[#757575] font-bold flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-[#E50914]" />
                        Time: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      order.order_status === 'ASSIGNED' ? 'bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]' :
                      order.order_status === 'PICKED_UP' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      order.order_status === 'OUT_FOR_DELIVERY' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {order.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-[#FFF5F5] rounded-2xl p-4 border border-[#FEE2E2] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white text-[#E50914] border border-[#FEE2E2] flex items-center justify-center font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black text-[#252525]">{order.customer_name}</span>
                      </div>

                      <a 
                        href={`tel:${order.customer_phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Phone className="w-3 h-3" /> Call Customer
                      </a>
                    </div>

                    {order.fulfilment_address && (
                      <div className="flex items-start gap-2 pt-2 border-t border-[#FEE2E2]">
                        <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#757575] block">Delivery Location</span>
                          <p className="text-xs font-bold text-[#252525] leading-relaxed mt-0.5">
                            {order.fulfilment_address.addressLine}, {order.fulfilment_address.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.delivery_instructions && (
                      <div className="bg-white border border-[#FEE2E2] rounded-xl p-2.5 text-xs text-[#252525] flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <p className="text-[11px] font-bold leading-snug">
                          Instruction: {order.delivery_instructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items Summary & Payment Amount */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <div>
                      <span className="text-[10px] text-[#757575] font-bold block">Items Snapshot</span>
                      <span className="text-[11px] font-black text-[#252525] line-clamp-1">
                        {order.order_items?.map((i) => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#757575] font-bold block">Collect from Customer</span>
                      <span className="text-base font-black text-[#E50914]">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isCompleted && (
                    <div className="pt-2 border-t border-[#FEE2E2]">
                      {order.order_status === 'ASSIGNED' && (
                        <button
                          onClick={() => updateStatus(order.id, 'PICKED_UP')}
                          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black cursor-pointer shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <PackageCheck className="w-4 h-4" />
                          Confirm Food Picked Up from Kitchen
                        </button>
                      )}

                      {order.order_status === 'PICKED_UP' && (
                        <button
                          onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                          className="w-full py-3.5 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black cursor-pointer shadow-md shadow-[#E50914]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <Compass className="w-4 h-4" />
                          Start Ride (Out for Delivery)
                        </button>
                      )}

                      {order.order_status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => updateStatus(order.id, 'DELIVERED')}
                          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Food Delivered & Payment Received
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}
