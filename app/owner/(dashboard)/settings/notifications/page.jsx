'use client';
import React from 'react';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import toast from 'react-hot-toast';

export default function GlobalNotificationSettingsPage() {
  
  const handleSubmit = (data) => {
    toast.success('Notification integrations updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Notification Channels</h2>
        <p className="text-sm text-text/60">Configure global delivery channels for your business alerts.</p>
      </div>

      <NotificationSettings onSubmit={handleSubmit} />
    </div>
  );
}
