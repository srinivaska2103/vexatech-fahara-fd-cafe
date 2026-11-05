'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModernHolidayDatePickerModal from '@/app/components/fulfilment/ModernHolidayDatePickerModal';
import { 
  SlidersHorizontal, 
  UtensilsCrossed, 
  Bike, 
  Clock, 
  MapPin, 
  DollarSign, 
  Save, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Power,
  PauseCircle,
  PlayCircle,
  Plus,
  Trash2,
  AlertTriangle,
  Globe,
  Info
} from 'lucide-react';
import { foodOrderService } from '@/services/foodOrder.service';
import { toast } from 'react-hot-toast';

const DAYS_CONFIG = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const DEFAULT_SLOT = { openTime: '09:00 AM', closeTime: '10:00 PM' };

export default function FulfilmentSettingsPage() {
  const queryClient = useQueryClient();

  // 1. Fulfilment Channels
  const [isTakeawayEnabled, setIsTakeawayEnabled] = useState(true);
  const [takeawayMinOrderAmount, setTakeawayMinOrderAmount] = useState(0);
  const [estimatedPickupTimeMinutes, setEstimatedPickupTimeMinutes] = useState(20);

  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(false);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(5);
  const [minDeliveryOrderAmount, setMinDeliveryOrderAmount] = useState(100);
  const [deliveryCharge, setDeliveryCharge] = useState(30);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('');
  const [estimatedDeliveryTimeMinutes, setEstimatedDeliveryTimeMinutes] = useState(40);

  // 2. Ordering Availability Controls
  const [isOrderingEnabled, setIsOrderingEnabled] = useState(true);
  const [autoEnableOrderingHours, setAutoEnableOrderingHours] = useState(true);
  const [allowOrdersOutsideHours, setAllowOrdersOutsideHours] = useState(false);
  const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [restaurantTimezone, setRestaurantTimezone] = useState('Asia/Kolkata');

  // Confirmation modal state for Pause / Ordering Master switch
  const [pauseModalOpen, setPauseModalOpen] = useState(false);

  // 3. Weekly Business Hours (Independent per day with multiple time slots)
  const [weeklyBusinessHours, setWeeklyBusinessHours] = useState(() => {
    const init = {};
    DAYS_CONFIG.forEach(d => {
      init[d.key] = {
        isClosed: d.key === 'sunday',
        slots: d.key === 'sunday' ? [] : [{ ...DEFAULT_SLOT }]
      };
    });
    return init;
  });

  // 4. Special Closing Dates & Holidays
  const [specialClosingDates, setSpecialClosingDates] = useState([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [isHolidayDatePickerOpen, setIsHolidayDatePickerOpen] = useState(false);
  const [newHolidayReason, setNewHolidayReason] = useState('');

  // Live availability status from server
  const [currentAvailability, setCurrentAvailability] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['cafe-fulfilment-settings'],
    queryFn: () => foodOrderService.getFulfilmentSettings()
  });

  useEffect(() => {
    if (data?.data) {
      const s = data.data;
      setIsTakeawayEnabled(s.is_takeaway_enabled ?? true);
      setTakeawayMinOrderAmount(Number(s.takeaway_min_order_amount || 0));
      setEstimatedPickupTimeMinutes(s.estimated_pickup_time_minutes || 20);

      setIsDeliveryEnabled(s.is_delivery_enabled ?? false);
      setDeliveryRadiusKm(Number(s.delivery_radius_km || 5));
      setMinDeliveryOrderAmount(Number(s.min_delivery_order_amount || 100));
      setDeliveryCharge(Number(s.delivery_charge || 30));
      setFreeDeliveryThreshold(s.free_delivery_threshold ? String(s.free_delivery_threshold) : '');
      setEstimatedDeliveryTimeMinutes(s.estimated_delivery_time_minutes || 40);

      // Ordering controls
      setIsOrderingEnabled(s.is_ordering_enabled ?? true);
      setAutoEnableOrderingHours(s.auto_enable_ordering_hours ?? true);
      setAllowOrdersOutsideHours(s.allow_orders_outside_hours ?? false);
      setIsTemporarilyPaused(s.is_temporarily_paused ?? false);
      setPauseReason(s.pause_reason || '');
      setRestaurantTimezone(s.restaurant_timezone || 'Asia/Kolkata');

      // Weekly hours
      if (s.weekly_business_hours && typeof s.weekly_business_hours === 'object') {
        const merged = {};
        DAYS_CONFIG.forEach(d => {
          merged[d.key] = s.weekly_business_hours[d.key] || {
            isClosed: false,
            slots: [{ ...DEFAULT_SLOT }]
          };
        });
        setWeeklyBusinessHours(merged);
      }

      // Holidays
      if (Array.isArray(s.special_closing_dates)) {
        setSpecialClosingDates(s.special_closing_dates);
      }

      // Server live availability
      if (s.currentAvailability) {
        setCurrentAvailability(s.currentAvailability);
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload) => foodOrderService.updateFulfilmentSettings(payload),
    onSuccess: () => {
      toast.success('Restaurant business hours and settings saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['cafe-fulfilment-settings'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
  });

  // Slot handlers
  const handleToggleDayClosed = (dayKey) => {
    setWeeklyBusinessHours(prev => {
      const current = prev[dayKey] || { isClosed: false, slots: [] };
      const nextClosed = !current.isClosed;
      return {
        ...prev,
        [dayKey]: {
          ...current,
          isClosed: nextClosed,
          slots: nextClosed ? [] : (current.slots.length > 0 ? current.slots : [{ ...DEFAULT_SLOT }])
        }
      };
    });
  };

  const handleAddSlot = (dayKey) => {
    setWeeklyBusinessHours(prev => {
      const current = prev[dayKey] || { isClosed: false, slots: [] };
      return {
        ...prev,
        [dayKey]: {
          isClosed: false,
          slots: [...current.slots, { openTime: '05:00 PM', closeTime: '10:00 PM' }]
        }
      };
    });
  };

  const handleRemoveSlot = (dayKey, index) => {
    setWeeklyBusinessHours(prev => {
      const current = prev[dayKey] || { isClosed: false, slots: [] };
      const newSlots = current.slots.filter((_, i) => i !== index);
      return {
        ...prev,
        [dayKey]: {
          ...current,
          isClosed: newSlots.length === 0,
          slots: newSlots
        }
      };
    });
  };

  const handleSlotChange = (dayKey, index, field, value) => {
    setWeeklyBusinessHours(prev => {
      const current = prev[dayKey] || { isClosed: false, slots: [] };
      const newSlots = [...current.slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [dayKey]: {
          ...current,
          slots: newSlots
        }
      };
    });
  };

  // Holiday handlers
  const handleAddHoliday = () => {
    if (!newHolidayDate) {
      toast.error('Please pick a closure date');
      return;
    }
    if (specialClosingDates.some(h => (typeof h === 'string' ? h : h.date) === newHolidayDate)) {
      toast.error('This date is already added');
      return;
    }
    setSpecialClosingDates(prev => [
      ...prev,
      { date: newHolidayDate, reason: newHolidayReason.trim() || 'Holiday Closure' }
    ]);
    setNewHolidayDate('');
    setNewHolidayReason('');
  };

  const handleRemoveHoliday = (dateToRemove) => {
    setSpecialClosingDates(prev => prev.filter(h => (typeof h === 'string' ? h : h.date) !== dateToRemove));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!isTakeawayEnabled && !isDeliveryEnabled) {
      toast.error('You must enable at least Takeaway or Restaurant Delivery');
      return;
    }

    updateMutation.mutate({
      isTakeawayEnabled,
      takeawayMinOrderAmount,
      estimatedPickupTimeMinutes,
      isDeliveryEnabled,
      deliveryRadiusKm,
      minDeliveryOrderAmount,
      deliveryCharge,
      freeDeliveryThreshold: freeDeliveryThreshold ? Number(freeDeliveryThreshold) : null,
      estimatedDeliveryTimeMinutes,
      isOrderingEnabled,
      autoEnableOrderingHours,
      allowOrdersOutsideHours,
      isTemporarilyPaused,
      pauseReason: pauseReason.trim() || null,
      restaurantTimezone,
      weeklyBusinessHours,
      specialClosingDates
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-6 h-6 text-[#E50914] animate-spin mx-auto mb-2" />
        <span className="text-xs text-[#757575] font-bold">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* ── HEADER & LIVE STATUS BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
              Restaurant Fulfilment &amp; Business Hours
            </h1>
          </div>
          <p className="text-xs text-[#757575] font-medium mt-1">
            Configure weekly business hours, food ordering availability, takeaway &amp; delivery parameters
          </p>
        </div>

        {/* Live Status Pill */}
        {currentAvailability && (
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border shadow-xs ${
            currentAvailability.canPlaceOrder
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${currentAvailability.canPlaceOrder ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                {currentAvailability.badge}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {currentAvailability.message}
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── SECTION 1: ORDERING AVAILABILITY CONTROLS ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FEE2E2]">
            <span className="p-2 rounded-xl bg-red-50 text-[#E50914] border border-red-200">
              <Power className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#252525]">Ordering Availability Controls</h2>
              <span className="text-[11px] text-[#757575] font-medium block">
                Control master ordering status, automatic scheduling and temporary pause
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Control 1: Accept Food Orders Master Switch */}
            <div className="p-4 rounded-2xl bg-[#FFF5F5]/60 border border-[#FEE2E2] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#252525] block">Accept Food Orders</span>
                <span className="text-[10px] text-[#757575] font-medium block mt-0.5">
                  Master switch to enable or disable all online food ordering
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrderingEnabled}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    if (!nextVal) {
                      if (window.confirm('Are you sure you want to completely turn OFF online ordering? Customers will not be able to order.')) {
                        setIsOrderingEnabled(false);
                      }
                    } else {
                      setIsOrderingEnabled(true);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
              </label>
            </div>

            {/* Control 2: Auto-Enable During Business Hours */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#252525] block">Auto-Enable During Business Hours</span>
                <span className="text-[10px] text-[#757575] font-medium block mt-0.5">
                  Automatically open and close ordering matching your configured slots
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEnableOrderingHours}
                  onChange={(e) => setAutoEnableOrderingHours(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
              </label>
            </div>

            {/* Control 3: Allow Advance Pre-Orders Outside Hours */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#252525] block">Allow Pre-Orders Outside Business Hours</span>
                <span className="text-[10px] text-[#757575] font-medium block mt-0.5">
                  Allow customers to schedule orders for the next available open slot
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOrdersOutsideHours}
                  onChange={(e) => setAllowOrdersOutsideHours(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
              </label>
            </div>

            {/* Control 4: Temporary Pause Switch */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
              isTemporarilyPaused ? 'bg-amber-50/80 border-amber-300' : 'bg-stone-50 border-stone-200/80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PauseCircle className={`w-4 h-4 ${isTemporarilyPaused ? 'text-amber-600' : 'text-stone-400'}`} />
                  <div>
                    <span className="text-xs font-black text-[#252525] block">Temporary Pause Ordering</span>
                    <span className="text-[10px] text-[#757575] font-medium block">
                      Pause incoming orders without deleting your business hours
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTemporarilyPaused}
                    onChange={(e) => {
                      const next = e.target.checked;
                      if (next) {
                        setPauseModalOpen(true);
                      } else {
                        setIsTemporarilyPaused(false);
                        setPauseReason('');
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {isTemporarilyPaused && (
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold text-amber-800 block mb-1">
                    Pause Notice to Customers:
                  </span>
                  <input
                    type="text"
                    value={pauseReason}
                    onChange={(e) => setPauseReason(e.target.value)}
                    placeholder="e.g. Kitchen is overwhelmed. Resuming in 30 minutes."
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Timezone Configuration */}
          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#666666]">
              <Globe className="w-4 h-4 text-[#E50914]" />
              <span>Restaurant Operating Timezone:</span>
            </div>
            <select
              value={restaurantTimezone}
              onChange={(e) => setRestaurantTimezone(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+08:00)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
            </select>
          </div>
        </div>

        {/* ── SECTION 2: RESTAURANT BUSINESS HOURS (WEEKLY & MULTI-SLOT) ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FEE2E2]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-black text-[#252525]">Restaurant Business Hours</h2>
                <span className="text-[11px] text-[#757575] font-medium block">
                  Configure operating time slots independently for each day. Supports multiple slots and overnight hours (e.g. 06:00 PM – 01:00 AM).
                </span>
              </div>
            </div>
          </div>

          {/* Days Grid */}
          <div className="space-y-3 pt-1">
            {DAYS_CONFIG.map(({ key, label }) => {
              const dayData = weeklyBusinessHours[key] || { isClosed: false, slots: [] };
              const isClosed = dayData.isClosed;

              return (
                <div
                  key={key}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isClosed
                      ? 'bg-stone-50/70 border-stone-200/60 opacity-80'
                      : 'bg-[#FFF5F5]/30 border-[#FEE2E2] hover:border-[#E50914]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Day Name & Open/Closed Toggle */}
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <button
                        type="button"
                        onClick={() => handleToggleDayClosed(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isClosed
                            ? 'bg-stone-200 text-[#757575]'
                            : 'bg-[#E50914] text-white shadow-2xs'
                        }`}
                      >
                        {isClosed ? 'Closed' : 'Open'}
                      </button>
                      <span className="text-sm font-black text-[#252525]">{label}</span>
                    </div>

                    {/* Slots Area */}
                    <div className="flex-1 space-y-2">
                      {isClosed ? (
                        <span className="text-xs font-bold text-[#888888] italic">
                          Restaurant is closed all day on {label}
                        </span>
                      ) : (
                        <div className="space-y-2">
                          {dayData.slots.map((slot, sIdx) => (
                            <div key={sIdx} className="flex flex-wrap items-center gap-2">
                              {/* Open Time */}
                              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#FEE2E2] shadow-2xs">
                                <span className="text-[10px] font-black text-[#757575] uppercase">Open:</span>
                                <input
                                  type="text"
                                  value={slot.openTime}
                                  onChange={(e) => handleSlotChange(key, sIdx, 'openTime', e.target.value)}
                                  placeholder="09:00 AM"
                                  className="w-20 text-xs font-black text-[#252525] outline-none"
                                />
                              </div>

                              <span className="text-xs font-black text-[#757575]">to</span>

                              {/* Close Time */}
                              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#FEE2E2] shadow-2xs">
                                <span className="text-[10px] font-black text-[#757575] uppercase">Close:</span>
                                <input
                                  type="text"
                                  value={slot.closeTime}
                                  onChange={(e) => handleSlotChange(key, sIdx, 'closeTime', e.target.value)}
                                  placeholder="10:00 PM"
                                  className="w-20 text-xs font-black text-[#252525] outline-none"
                                />
                              </div>

                              {/* Remove Slot */}
                              {dayData.slots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(key, sIdx)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remove slot"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Slot Button */}
                    {!isClosed && (
                      <button
                        type="button"
                        onClick={() => handleAddSlot(key)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#FEE2E2] text-xs font-black text-[#E50914] flex items-center gap-1 shadow-2xs cursor-pointer transition-all self-start sm:self-center"
                      >
                        <Plus size={13} />
                        <span>Add Slot</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: SPECIAL CLOSING DATES & HOLIDAYS ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FEE2E2]">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#252525]">Special Closing Dates &amp; Holidays</h2>
              <span className="text-[11px] text-[#757575] font-medium block">
                Schedule one-off closures for festivals, renovations, or special occasions
              </span>
            </div>
          </div>

          {/* Add Holiday Picker */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <button
              type="button"
              onClick={() => setIsHolidayDatePickerOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-[#FFF5F5] border border-[#FEE2E2] hover:border-[#E50914] rounded-xl text-xs font-black text-[#252525] flex items-center justify-between sm:justify-start gap-2.5 shadow-2xs transition-all cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-[#E50914] group-hover:scale-110 transition-transform" />
              <span>{newHolidayDate || 'Select Closure Date'}</span>
              <span className="text-[10px] bg-[#FFF5F5] text-[#E50914] px-2 py-0.5 rounded-md font-bold border border-red-200">
                Pick Date
              </span>
            </button>
            <input
              type="text"
              value={newHolidayReason}
              onChange={(e) => setNewHolidayReason(e.target.value)}
              placeholder="Reason (e.g. Diwali Holiday, Renovation)"
              className="w-full flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-[#252525] outline-none"
            />
            <button
              type="button"
              onClick={handleAddHoliday}
              className="w-full sm:w-auto px-4 py-2 bg-[#252525] hover:bg-black text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Holiday</span>
            </button>
          </div>

          {/* Holiday List */}
          {specialClosingDates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {specialClosingDates.map((h, idx) => {
                const dateStr = typeof h === 'string' ? h : h.date;
                const reasonStr = typeof h === 'string' ? 'Holiday Closure' : (h.reason || 'Holiday Closure');

                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-xs">
                    <div>
                      <strong className="font-black text-purple-900 block">{dateStr}</strong>
                      <span className="text-[11px] text-purple-700 font-medium">{reasonStr}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHoliday(dateStr)}
                      className="p-1 rounded-lg text-purple-500 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#888888] italic">No special closing dates added.</p>
          )}
        </div>

        {/* ── SECTION 4: TAKEAWAY / PICKUP SETTINGS ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#FEE2E2]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-50 text-[#E50914] border border-red-200">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-[#252525]">Takeaway &amp; Pickup Orders</h3>
                <span className="text-[10px] text-[#757575] font-medium block">
                  Allow customers to order in advance and pick up food at your counter
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isTakeawayEnabled}
                onChange={(e) => setIsTakeawayEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
            </label>
          </div>

          {isTakeawayEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Estimated Preparation Time (Minutes) *
                </label>
                <input
                  type="number"
                  min="5"
                  value={estimatedPickupTimeMinutes}
                  onChange={(e) => setEstimatedPickupTimeMinutes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={takeawayMinOrderAmount}
                  onChange={(e) => setTakeawayMinOrderAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 5: RESTAURANT-OWNED DELIVERY ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#FEE2E2]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
                <Bike className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-[#252525]">Restaurant-Owned Delivery</h3>
                <span className="text-[10px] text-[#757575] font-medium block">
                  Deliver food directly to customers using your own delivery fleet
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDeliveryEnabled}
                onChange={(e) => setIsDeliveryEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
            </label>
          </div>

          {isDeliveryEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Delivery Radius (KM) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={deliveryRadiusKm}
                  onChange={(e) => setDeliveryRadiusKm(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Delivery Fee (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Min Delivery Order (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={minDeliveryOrderAmount}
                  onChange={(e) => setMinDeliveryOrderAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Free Delivery Over (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 500"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Estimated Delivery Time (Mins)
                </label>
                <input
                  type="number"
                  min="10"
                  value={estimatedDeliveryTimeMinutes}
                  onChange={(e) => setEstimatedDeliveryTimeMinutes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── SAVE ACTION ── */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#E50914] hover:bg-[#B71C1C] text-xs font-black text-white rounded-2xl cursor-pointer shadow-lg shadow-[#E50914]/25 transition-all disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? 'Saving Settings...' : 'Save Fulfilment & Business Hours'}
          </button>
        </div>

      </form>

      {/* Modern Pop-up Calendar Date Picker Modal */}
      <ModernHolidayDatePickerModal
        isOpen={isHolidayDatePickerOpen}
        onClose={() => setIsHolidayDatePickerOpen(false)}
        selectedDate={newHolidayDate}
        onSelectDate={(date) => setNewHolidayDate(date)}
      />

      {/* Confirmation Modal for Temporary Pause */}
      {pauseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-black text-[#252525]">Pause Online Food Orders</h3>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed">
              When paused, customers will see a <strong>"Temporarily Not Accepting Orders"</strong> banner and new checkout will be blocked. Your business hours will not be deleted.
            </p>
            <div>
              <label className="text-[10px] font-black uppercase text-[#252525] block mb-1">
                Notice reason to customers:
              </label>
              <input
                type="text"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="e.g. Kitchen rush, back in 30 minutes"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPauseModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#666666] hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTemporarilyPaused(true);
                  setPauseModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
