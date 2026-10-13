'use client';
import React, { Suspense } from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useCreateEvent } from '@/hooks/event';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function CreateEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEventType = searchParams.get('event_type') || 'Birthday';

  const createMutation = useCreateEvent();

  const handleSubmit = (data) => {
    const { cafe_id, ...payload } = data;
    
    createMutation.mutate({ cafeId: cafe_id, data: payload }, {
      onSuccess: () => {
        router.push('/owner/events');
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Page Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8DED5]">
        <button 
          onClick={() => router.push('/owner/events')}
          className="w-10 h-10 rounded-xl bg-white border border-[#E8DED5] hover:bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center shadow-2xs transition-all shrink-0"
          title="Back to Event Packages"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
            Create Custom Event Package
          </h1>
          <p className="text-xs sm:text-sm text-[#2C1810]/70 mt-0.5">
            Build a custom package with flexible pricing, guest limits, duration, and inclusions.
          </p>
        </div>
      </div>

      {/* Package Builder Form & Live Preview */}
      <EventForm 
        defaultValues={{ event_type: initialEventType }}
        onSubmit={handleSubmit} 
        isLoading={createMutation.isPending} 
        submitLabel="Create Package"
      />

    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-[#2C1810]/50">Loading Package Builder...</div>}>
      <CreateEventContent />
    </Suspense>
  );
}
