'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { EventDetails } from '@/components/events/EventDetails';
import { useEvent } from '@/hooks/event';
import { useParams } from 'next/navigation';
import { LoadingSkeleton } from '@/components/events/LoadingSkeleton';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const { data: eventData, isLoading } = useEvent(id);
  const event = eventData?.data || eventData;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
        <LoadingSkeleton type="list" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-12 text-center text-text/50 max-w-md mx-auto">
        Event Package not found.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      <EventDetails event={event} />
    </div>
  );
}
