'use client';
import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { CafeForm } from '@/components/cafes/CafeForm';
import { useCreateCafe, useCafes } from '@/hooks/cafe';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default function CreateCafePage() {
  const router = useRouter();
  const createMutation = useCreateCafe();
  const { data: cafesData } = useCafes();
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);
  const isLimitReached = cafes.length >= 3;

  const handleSubmit = (data) => {
    if (isLimitReached) return;

    // Map frontend form data to exactly match the backend API schema
    const payload = {
      name: data.name,
      description: data.description || "",
      address: data.address || "",
      city: data.city || "",
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      price_per_hour: data.price ? Number(data.price) : 0,
      maximum_persons: data.capacity ? Number(data.capacity) : null,
      google_rating: data.google_rating ? Number(data.google_rating) : null,
      provides_event_services: data.provides_event_services || false,
      cover_image: data.cover_image || (data.gallery && data.gallery.length > 0 ? (data.gallery[0].file_url || data.gallery[0].url || (typeof data.gallery[0] === 'string' ? data.gallery[0] : "")) : ""),
      gallery: data.gallery ? data.gallery.map(img => img.file_url || img.url || (typeof img === 'string' ? img : "")) : [],
      amenities: data.amenities || [],
      business_hours: data.businessHours || null,
      status: data.status || "DRAFT"
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/owner/cafes');
      }
    });
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <BackButton href="/owner/cafes" label="Back to Cafes" />
      </div>

      <PageHeader 
        title="Create New Cafe" 
        subtitle="Add a new venue to your portfolio. You can manage images and availability after creating."
      />

      {isLimitReached && (
        <div className="max-w-5xl mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Cafe Creation Limit Reached (3/3)</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              You have already registered the maximum allowed 3 cafes for your owner account. Please delete or modify an existing cafe to create a new one.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl">
        <CafeForm 
          onSubmit={handleSubmit} 
          isLoading={createMutation.isPending || isLimitReached} 
          submitLabel={isLimitReached ? "Limit Reached (3/3)" : "Create Cafe"}
        />
      </div>
    </PageContainer>
  );
}

