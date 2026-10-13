'use client';
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useEvent, useUpdateEvent } from '@/hooks/event';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { LoadingSkeleton } from '@/components/events/LoadingSkeleton';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: eventData, isLoading: isFetching } = useEvent(id);
  const event = eventData?.data || eventData;
  
  const updateMutation = useUpdateEvent();

  const handleSubmit = (data) => {
    const { cafe, ...payload } = data;

    updateMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        router.push(`/owner/events`);
      }
    });
  };

  if (isFetching) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  const defaultValues = {
    ...event,
    cafe_id: event?.cafe_id || event?.cafe?.id || ''
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Page Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8DED5]">
        <button 
          onClick={() => router.push(`/owner/events`)}
          className="w-10 h-10 rounded-xl bg-white border border-[#E8DED5] hover:bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center shadow-2xs transition-all shrink-0"
          title="Back to Event Packages"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
            Edit Custom Package — {event?.package_name || 'Event Package'}
          </h1>
          <p className="text-xs sm:text-sm text-[#2C1810]/70 mt-0.5">
            Modify rates, guest capacity, duration, and custom inclusions.
          </p>
        </div>
      </div>

      {/* Package Builder Form & Live Preview */}
      <EventForm 
        defaultValues={defaultValues}
        onSubmit={handleSubmit} 
        isLoading={updateMutation.isPending} 
        submitLabel="Save Changes"
      />

    </div>
  );
}
