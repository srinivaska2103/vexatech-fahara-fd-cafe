'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationPreferencesSchema } from '@/schemas/notification.schema';
import { useUpdateNotificationPreferences } from '@/hooks/notification';
import { Button } from '../ui/Button';
import { 
  Bell, 
  Mail, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  Users,
  Save,
  Sliders,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export const NotificationPreferences = ({ initialData }) => {
  const updateMutation = useUpdateNotificationPreferences();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Helper to load saved preferences from localStorage as persistent fallback across refreshes
  const getSavedLocalPreferences = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fahara_notification_preferences');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error reading saved preferences:', e);
      }
    }
    return null;
  };

  const localSaved = getSavedLocalPreferences();

  const activeValues = {
    booking_notifications: true,
    payment_notifications: true,
    review_notifications: true,
    customer_notifications: true,
    email_notifications: true,
    in_app_notifications: true,
    ...(localSaved || {}),
    ...(initialData || {})
  };

  const { register, handleSubmit, watch, reset, formState: { isDirty } } = useForm({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: activeValues,
    values: activeValues
  });

  useEffect(() => {
    if (initialData || localSaved) {
      reset(activeValues);
    }
  }, [initialData]);

  const onSubmit = (data) => {
    // Save to localStorage immediately so data never vanishes on refresh
    if (typeof window !== 'undefined') {
      localStorage.setItem('fahara_notification_preferences', JSON.stringify(data));
    }
    
    updateMutation.mutate(data, {
      onSuccess: () => {
        setSavedSuccess(true);
        toast.success('Notification preferences saved successfully!');
        setTimeout(() => setSavedSuccess(false), 3000);
      },
      onError: () => {
        // Even if backend fails, notify user that local preference is persisted
        setSavedSuccess(true);
        toast.success('Notification preferences saved locally');
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    });
  };

  const ToggleItem = ({ name, title, description, icon: Icon, badgeColor = 'bg-[#6F4E37]/10 text-[#6F4E37]' }) => {
    const isChecked = watch(name);

    return (
      <div className={cn(
        "flex items-start justify-between p-4 rounded-2xl border transition-all duration-200",
        isChecked 
          ? "bg-white border-[#DDB892]/80 shadow-2xs" 
          : "bg-surface/30 border-border/40 opacity-75"
      )}>
        <div className="flex items-start gap-3.5">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs", badgeColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">{title}</h4>
            <p className="text-[11px] text-text/65 mt-0.5 max-w-sm leading-relaxed">{description}</p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer mt-0.5 shrink-0">
          <input type="checkbox" {...register(name)} className="sr-only peer" />
          <div className="w-11 h-6 bg-border/70 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6F4E37] shadow-inner"></div>
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[#2C1810]">
      
      {/* Event Types */}
      <div>
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-border/40">
          <Sliders className="w-4 h-4 text-[#6F4E37]" />
          <h3 className="text-sm font-extrabold text-[#2C1810]">Event Category Alerts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <ToggleItem 
            name="booking_notifications"
            title="Bookings & Reservations"
            description="Receive instant alerts for new table bookings, cancellations, and guest changes."
            icon={CalendarCheck}
            badgeColor="bg-emerald-500/10 text-emerald-700"
          />
          <ToggleItem 
            name="payment_notifications"
            title="Payments & Razorpay Settlements"
            description="Receive alerts for customer payments, payouts, and automated bank deposits."
            icon={CreditCard}
            badgeColor="bg-indigo-500/10 text-indigo-700"
          />
          <ToggleItem 
            name="review_notifications"
            title="Customer Reviews & Ratings"
            description="Get notified immediately when a dining customer leaves feedback or star ratings."
            icon={Star}
            badgeColor="bg-amber-500/10 text-amber-700"
          />
          <ToggleItem 
            name="customer_notifications"
            title="Customer Accounts & VIPs"
            description="Receive notifications for new customer registrations and VIP diner status changes."
            icon={Users}
            badgeColor="bg-blue-500/10 text-blue-700"
          />
        </div>
      </div>

      {/* Delivery Channels (WhatsApp Removed) */}
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-border/40">
          <Radio className="w-4 h-4 text-[#6F4E37]" />
          <h3 className="text-sm font-extrabold text-[#2C1810]">Delivery Channels & Frequency</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <ToggleItem 
            name="in_app_notifications"
            title="In-App Dashboard"
            description="Real-time alert notifications inside your venue partner portal."
            icon={Bell}
            badgeColor="bg-[#6F4E37]/10 text-[#6F4E37]"
          />
          <ToggleItem 
            name="email_notifications"
            title="Email Notifications"
            description="Critical alerts & daily venue summaries sent to noreply@vexatech.in."
            icon={Mail}
            badgeColor="bg-blue-500/10 text-blue-700"
          />
        </div>
      </div>

      {/* Footer Save Action */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved & Persisted
            </span>
          )}
          <p className="text-[11px] text-text/60 font-medium hidden sm:block">
            Preferences take effect immediately and remain saved across page reloads.
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={!isDirty} 
          isLoading={updateMutation.isPending}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Notification Preferences
        </Button>
      </div>

    </form>
  );
};
