'use client';
import React from 'react';
import { useBookingSettings } from '@/hooks/settings';
import { BookingSettings } from '@/components/settings/BookingSettings';
import { LoadingSkeleton } from '@/components/settings/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function BookingSettingsPage() {
  const { data: settingsData, isLoading, isError } = useBookingSettings();
  
  const data = settingsData?.data;

  // Mock mutation for demo
  const handleSubmit = (formData) => {
    toast.success('Booking settings saved successfully');
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Booking Rules</h2>
        <p className="text-sm text-text/60">Configure how and when customers can book space at your cafe.</p>
      </div>

      <BookingSettings 
        initialData={data} 
        onSubmit={handleSubmit} 
        isPending={false}
      />
    </div>
  );
}
