import React from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, Smartphone, Bell, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Re-using UI concept from Phase 10 Notification Settings, adapted for Global Config

export const NotificationSettings = ({ initialData, onSubmit, isPending }) => {
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: initialData || {
      email_enabled: true,
      whatsapp_enabled: false,
      sms_enabled: false,
      push_enabled: true
    }
  });

  const ToggleItem = ({ name, title, description, icon: Icon, isPro = false }) => (
    <div className="flex items-start justify-between p-4 bg-white rounded-2xl border border-border shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text flex items-center gap-2">
            {title} {isPro && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span>}
          </h4>
          <p className="text-xs text-text/60 mt-1 max-w-sm">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-1">
        <input type="checkbox" {...register(name)} className="sr-only peer" disabled={isPro} />
        <div className={`w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isPro ? 'opacity-50' : 'peer-checked:bg-primary'}`}></div>
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <ToggleItem 
           name="email_enabled"
           title="Email Notifications"
           description="Send transactional emails via SendGrid/AWS SES."
           icon={Mail}
         />
         <ToggleItem 
           name="push_enabled"
           title="In-App Push"
           description="Enable browser and mobile push notifications."
           icon={Bell}
         />
         <ToggleItem 
           name="whatsapp_enabled"
           title="WhatsApp Integration"
           description="Send booking confirmations via WhatsApp Business API."
           icon={Smartphone}
           isPro
         />
         <ToggleItem 
           name="sms_enabled"
           title="SMS Alerts"
           description="Fallback SMS for critical updates (Twilio)."
           icon={AlertTriangle}
           isPro
         />
      </div>

      <div className="flex justify-end">
         <Button type="submit" disabled={!isDirty} isLoading={isPending}>
           Save Integrations
         </Button>
      </div>

    </form>
  );
};
