'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { EventForm } from '@/components/events/EventForm';
import { useEvent, useUpdateEvent } from '@/hooks/event';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LoadingSkeleton } from '@/components/events/LoadingSkeleton';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: eventData, isLoading: isFetching } = useEvent(id);
  const event = eventData?.data || eventData;
  
  const updateMutation = useUpdateEvent();

  const handleSubmit = (data) => {
    const { cafe_id, cafe, ...payload } = data; // strip frontend-only or relation fields

    updateMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        router.push(`/owner/events/${id}`);
      }
    });
  };

  if (isFetching) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
        <LoadingSkeleton type="list" />
      </div>
    );
  }

  // Pre-format default values
  const defaultValues = {
    ...event,
    cafe_id: event?.cafe_id || event?.cafe?.id || ''
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <button 
            onClick={() => router.push(`/owner/events/${id}`)}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0"
            title="Back to Event Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">
                Edit {event?.package_name || 'Event Package'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                WIZARD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Update package rates, guest seating limits, inclusions, and photo gallery step-by-step.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Interactive Wizard Canvas */}
      <div className="max-w-5xl mx-auto">
        <EventForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit} 
          isLoading={updateMutation.isPending} 
          submitLabel="Save Changes"
        />
      </div>

    </div>
  );
}
